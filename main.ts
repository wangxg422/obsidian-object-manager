import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { DEFAULT_SETTINGS, ObjectManagerSettingTab, ObjectManagerSettings, storageInfo } from 'settings/settings';
import { Uploader, buildUploader } from 'uploader/uploader';
import { fileTypeIsImage } from 'utils/file';
import { GetUUID } from 'utils/uuid';

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

        const fileIsImage = fileTypeIsImage(uploadFile)
        // 检测是否只允许上传图片
        if (this.settings.imageOnly && !fileIsImage) {
            new Notice('⚠️ Only image allow to upload.')
            return
        }

        const originalFileName = uploadFile.name.replace(/\s+/g, "")
        const storeFileName = this.genFileName(originalFileName, fileIsImage)
        const progressText = `![Uploading file...  ${storeFileName}]()`

        editor.replaceSelection(`${progressText}\n`)

        await this.uploader.uploadFile(storeFileName, uploadFile)

        const markdownText = this.genMarkdownText(this.settings, storeFileName, originalFileName, fileIsImage)
        ObjectManagerPlugin.replaceFirstOccurrence(editor, progressText, markdownText)
    }

    private genMarkdownText(settings: ObjectManagerSettings, storeFileName: string, originalFileName: string, fileIsImage: boolean): string {
        let fileUrl = ""

        const { storageService } = settings
        if (storageService === storageInfo.minio.name) {
            const { endPoint, port, bucket, useSSL } = this.settings.minioSettings
            let urlPort = ""
            if (port === "" || (useSSL && port === "443") || (!useSSL && port === "80")) {
                urlPort = ""
            } else {
                urlPort = ":" + port
            }

            fileUrl = `${useSSL ? "https" : "http"}://${endPoint}${urlPort}/${bucket}/${storeFileName}`
        } else if (storageService === storageInfo.aliyunOss.name) {
            // https://xishang-note.oss-cn-beijing.aliyuncs.com/xx.jpg
            const { bucket,region } = this.settings.aliyunOssSettings
            fileUrl = `https://${bucket}.oss-cn-${region}.aliyuncs.com/${storeFileName}`
        } else if (storageService === storageInfo.tencentOss.name) {
            // https://share-1256198756.cos.ap-beijing.myqcloud.com/xx.png
            const { bucket, region } = this.settings.tencentCosSettings
            fileUrl = `https://${bucket}.cos.${region}.myqcloud.com/${storeFileName}`
        } else {
        }

        return fileIsImage ? `![${originalFileName}](${fileUrl})` : `📄 [${originalFileName}](${fileUrl})`
    }

    private getEditor(): Editor | undefined {
        return this.app.workspace.activeEditor?.editor
    }

    private genFileName(originalFileName: string, fileIsImage: boolean) {
        const uuid = GetUUID()
        const time = Date.now()
        const parts = originalFileName.split(".")
        if (parts.length >= 2) {
            const postfix = parts[parts.length - 1]
            if (fileIsImage) {
                return `img-${uuid}${time}.${postfix}`
            }

            return `${postfix}-${uuid}${time}.${postfix}`
        }

        return `${originalFileName}-${uuid}${time}`
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