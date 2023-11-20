import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, ObjectManagerSettingTab, ObjectManagerSettings } from 'settings';
import { Uploader, buildUploader } from 'uploader/uploader';
import { isImage } from 'utils/file';

export default class ObjectManagerPlugin extends Plugin {
    settings: ObjectManagerSettings;

    uploader: Uploader | undefined;

    async onload() {
        await this.loadSettings()

        // 将插件的配置 tab 添加到设置菜单中
        this.addSettingTab(new ObjectManagerSettingTab(this.app, this))

        this.uploader = buildUploader(this.settings)

        // 处理来自剪贴板的黏贴事件
        this.registerEvent(this.app.workspace.on('editor-paste', this.customPasteEventCallback))
        // 处理文件直接从系统拖入
        this.registerEvent(this.app.workspace.on('editor-drop', this.customDropEventListener))
    }

    onunload() {
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
    }

    async saveSettings() {
        await this.saveData(this.settings)
    }

    private customPasteEventCallback = async (e: ClipboardEvent) => {
        if (e.clipboardData == null || e.clipboardData.files.length === 0) {
            return
        }

        const { files } = e.clipboardData!

        if (!files || files.length == 0) {
            return
        }

        const uploadFile = files[0]

        e.preventDefault()
        await this.uploadFileAndEmbed(uploadFile)
    }

    private customDropEventListener = async (e: DragEvent) => {
        if (e.dataTransfer == null || e.dataTransfer.files.length === 0) {
            return
        }

        const { files } = e.dataTransfer;

        if (!files || files.length == 0) {
            return
        }

        const uploadFile = files[0]

        e.preventDefault()
        await this.uploadFileAndEmbed(uploadFile)
    }

    private async uploadFileAndEmbed(uploadFile: File) {
        const editor = this.getEditor();
        if (!editor) {
            new Notice('⚠️ Please open a file.')
            return
        }

        if (!this.uploader) {
            ObjectManagerPlugin.showUnconfiguredPluginNotice()
            return
        }

        const fileIsImage = isImage(uploadFile)
        // 检测是否只允许上传图片
        if (this.settings.imageOnly && !fileIsImage) {
            new Notice('⚠️ Only image allow to upload.')
            return
        }

        const fileName = this.genFileName(uploadFile, fileIsImage)
        const progressText = `![Uploading file...  ${fileName}]()`

        editor.replaceSelection(`${progressText}\n`)

        await this.uploader.uploadFile(fileName, uploadFile)

        const { endPoint, port, bucket, useSSL } = this.settings.minioSettings
        const fileUrl = `${useSSL ? "https" : "http"}://${endPoint}:${port}/${bucket}/${fileName}`
        const markdownText = fileIsImage ? `![](${fileUrl})` : `📄 [${uploadFile.name}](${fileUrl})`
        
        ObjectManagerPlugin.replaceFirstOccurrence(editor, progressText, markdownText)
    }

    private getEditor(): Editor | undefined {
        return this.app.workspace.activeEditor?.editor
    }

    private genFileName(file: File, fileIsImage: boolean) {    
        const parts = file.name.split(".")
        if (parts.length >= 2) {
            const postfix = parts[parts.length - 1]
            if (fileIsImage) {
                return `${this.settings.imagePrefix}${Date.now()}.${postfix}`
            }

            return `${this.settings.filePrefix}${Date.now()}.${postfix}`
        }

        return `${this.settings.filePrefix}${Date.now()}-${file.name}`
    }

    private static showUnconfiguredPluginNotice() {
        const fiveSecondsMillis = 5_000
        new Notice('⚠️ Please configure Image Uploader or disable it', fiveSecondsMillis)
    }

    private static replaceFirstOccurrence(editor: Editor, target: string, replacement: string) {
        const lines = editor.getValue().split('\n')
        for (let i = 0; i < lines.length; i += 1) {
            const ch = lines[i].indexOf(target)
            if (ch !== -1) {
                const from = { line: i, ch }
                const to = { line: i, ch: ch + target.length }
                editor.replaceRange(replacement, from, to)
                break
            }
        }
    }
}