import ObjectManager from './main'

import { App, Notice, PluginSettingTab, Setting } from 'obsidian'

export interface minioSettings {
  endPoint: string,
  port: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
  useSSL: boolean,
}

export interface ossSettings {
  endPoint: string,
  accessKeyId: string,
  accessSecret: string,
  bucket: string,
  object: string, //Object完整路径，完整路径中不能包含Bucket名称
}

export const DEFAULT_SETTINGS: ObjectManagerSettings = {
  imageOnly: false,
  storageService: "minio",
  minioSettings: {
    endPoint: "",
    port: "",
    accessKey: "",
    secretKey: "",
    bucket: "",
    useSSL: false,
  },
  ossSettings: {
    endPoint: "",
    accessKeyId: "",
    accessSecret: "",
    bucket: "",
    object: ""
  }
}

export interface ObjectManagerSettings {
  storageService: string,
  imageOnly: boolean,
  minioSettings: minioSettings,
  ossSettings: ossSettings,
}

// 创建插件的自定义配置
export class ObjectManagerSettingTab extends PluginSettingTab {
  plugin: ObjectManager

  /**
  * 构造函数中接受两个参数
  * app: Obsidian 中的App对象
  * plugin: 需要自定义设置的插件对象
  */
  constructor(app: App, plugin: ObjectManager) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    // containerEl 是插件设置面板的容器
    const { containerEl } = this
    // 清空面板
    containerEl.empty()

    containerEl.createEl("h1", { text: "file manager settings" })

    const commonSettingsEl = containerEl.createEl("div", { cls: "" })

    const minioSettings = containerEl.createEl("div", { cls: "minio-settings-hide" })
    const ossSettings = containerEl.createEl("div", { cls: "oss-settings-hide" })

    minioSettings.toggleClass("minio-settings-hide", "minio" !== this.plugin.settings.storageService)
    ossSettings.toggleClass("oss-settings-hide", "oss" !== this.plugin.settings.storageService)

    this.renderMinioSettings(minioSettings)
    this.renderOssSettings(ossSettings)

    new Setting(commonSettingsEl)
      .setName("image only")
      .setDesc("only image allows to upload.")
      .addToggle(t => {
        t.setValue(this.plugin.settings.imageOnly)
        t.onChange(async value => {
          this.plugin.settings.imageOnly = value
          await this.plugin.saveSettings()
        })
      })

    new Setting(commonSettingsEl)
      .setName("file storage service")
      .setDesc("the file service to save files.")
      .addDropdown(dropdown => {
        dropdown
          .addOption("minio", "minio")
          .addOption("oss", "oss")
          .setValue(this.plugin.settings.storageService)
          .onChange(async value => {
            minioSettings.toggleClass("minio-settings-hide", "minio" !== value)
            ossSettings.toggleClass("oss-settings-hide", "oss" !== value)
            
            this.plugin.settings.storageService = value
            await this.plugin.saveSettings()
          })
      })
  }

  renderMinioSettings(containerEl: HTMLElement) {
    containerEl.createEl("h3", { text: "minio settings" })

    new Setting(containerEl)
      .setName("server endpoint")
      .setDesc("The is object manager.")
      .addText(text =>
        text
          .setPlaceholder("server address")
          .setValue(this.plugin.settings.minioSettings.endPoint)
          .onChange(async value => {
            this.plugin.settings.minioSettings.endPoint = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("server port")
      .setDesc("minio server port.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.minioSettings.port)
          .onChange(async value => {
            this.plugin.settings.minioSettings.port = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("access key")
      .setDesc("minio server access key.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.minioSettings.accessKey)
          .onChange(async value => {
            this.plugin.settings.minioSettings.accessKey = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("secret key")
      .setDesc("minio secret key.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.minioSettings.secretKey)
          .onChange(async value => {
            this.plugin.settings.minioSettings.secretKey = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("bucket") // 设置控件名称
      .setDesc("minio bucket name.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.bucket) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.bucket = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

    new Setting(containerEl)
      .setName("use SSL")
      .setDesc("enable when minio server is using ssl.")
      .addToggle(t => {
        t.setValue(this.plugin.settings.minioSettings.useSSL)
        t.onChange(async value => {
          this.plugin.settings.minioSettings.useSSL = value
          await this.plugin.saveSettings()
        })
      })
  }

  renderOssSettings(containerEl: HTMLElement) {
    containerEl.createEl("h3", { text: "oss settings" })

    new Setting(containerEl)
      .setName("server endpoint")
      .setDesc("aliyun oss endpoint.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.ossSettings.endPoint)
          .onChange(async value => {
            this.plugin.settings.ossSettings.endPoint = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("access key id")
      .setDesc("aliyun oss access key id.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.ossSettings.accessKeyId)
          .onChange(async value => {
            this.plugin.settings.ossSettings.accessKeyId = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("oss secret key")
      .setDesc("aliyun oss access secret.")
      .addText(text =>
        text
          .setPlaceholder("")
          .setValue(this.plugin.settings.ossSettings.accessSecret)
          .onChange(async value => {
            this.plugin.settings.ossSettings.accessSecret = value
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName("bucket")
      .setDesc("oss bucket name.")
      .addText(text =>
        text
          .setPlaceholder("oss bucket name")
          .setValue(this.plugin.settings.ossSettings.bucket)
          .onChange(async value => {
            this.plugin.settings.ossSettings.bucket = value
            await this.plugin.saveSettings()
          })
      )
  }
}