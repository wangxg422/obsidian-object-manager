import ObjectManager from '../main'

import { App, PluginSettingTab, Setting } from 'obsidian'
import { renderMinioSettings } from './minio-settings'
import { renderAliyunOssSettings } from './aliyun-oss-settings'
import { renderTencentCosSettings } from './tencent-cos-settings'
import { renderLocalSettings } from './local-settings'

export interface vaultSettings {
  basePath: string,
}

export interface localSettings {
  dir: string,
  wikiLink: boolean,
}

export interface minioSettings {
  endPoint: string,
  port: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
  useSSL: boolean,
}

export interface aliyunOssSettings {
  region: string,
  accessKeyId: string,
  accessKeySecret: string,
  bucket: string,
}

export interface tencentCosSettings {
  secretId: string,
  secretKey: string,
  bucket: string,
  region: string,
  storageClass: string,
}

export const DEFAULT_SETTINGS: ObjectManagerSettings = {
  vaultSettings: {
    basePath: ""
  },
  imageOnly: false,
  storageService: "minio",
  localSettings: {
    dir: "attachments",
    wikiLink: false,
  },
  minioSettings: {
    endPoint: "",
    port: "",
    accessKey: "",
    secretKey: "",
    bucket: "",
    useSSL: false,
  },
  aliyunOssSettings: {
    region: "",
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
  },
  tencentCosSettings: {
    secretId: "",
    secretKey: "",
    bucket: "",
    region: "",
    storageClass: "",
  },
}

export interface ObjectManagerSettings {
  vaultSettings: vaultSettings,
  storageService: string,
  imageOnly: boolean,
  imageWidth: string,
  localSettings: localSettings,
  minioSettings: minioSettings,
  aliyunOssSettings: aliyunOssSettings,
  tencentCosSettings: tencentCosSettings,
}

export const storageInfo = {
  local: {
    name: "local",
    hideCls: "local-settings-hide"
  },
  minio: {
    name: "minio",
    hideCls: "minio-settings-hide"
  },
  aliyunOss: {
    name: "aliyunOss",
    hideCls: "aliyun-oss-settings-hide"
  },
  tencentOss: {
    name: "tencentCos",
    hideCls: "tencent-cos-settings-hide"
  }
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

    containerEl.createEl("h1", { text: "Object Manager Settings" })

    const commonSettingsEl = containerEl.createEl("div", { cls: "" })

    const localSettingsEl = containerEl.createEl("div", { cls: storageInfo.local.hideCls })
    const minioSettingsEl = containerEl.createEl("div", { cls: storageInfo.minio.hideCls })
    const aliyunOssSettingsEl = containerEl.createEl("div", { cls: storageInfo.aliyunOss.hideCls })
    const tencentCosSettingsEl = containerEl.createEl("div", { cls: storageInfo.tencentOss.hideCls })

    localSettingsEl.toggleClass(storageInfo.local.hideCls, storageInfo.local.name !== this.plugin.settings.storageService)
    minioSettingsEl.toggleClass(storageInfo.minio.hideCls, storageInfo.minio.name !== this.plugin.settings.storageService)
    aliyunOssSettingsEl.toggleClass(storageInfo.aliyunOss.hideCls, storageInfo.aliyunOss.name !== this.plugin.settings.storageService)
    tencentCosSettingsEl.toggleClass(storageInfo.tencentOss.hideCls, storageInfo.tencentOss.name !== this.plugin.settings.storageService)

    renderLocalSettings(localSettingsEl, this.plugin)
    renderMinioSettings(minioSettingsEl, this.plugin)
    renderAliyunOssSettings(aliyunOssSettingsEl, this.plugin)
    renderTencentCosSettings(tencentCosSettingsEl, this.plugin)

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
    .setName("image width")
    .setDesc("the default image width,if null,the image width will not set")
    .addText(t =>
        t.setValue(this.plugin.settings.imageWidth)
        .onChange(async value => {
          this.plugin.settings.imageWidth = value
          await this.plugin.saveSettings()
        })
    )

    new Setting(commonSettingsEl)
      .setName("file storage service")
      .setDesc("the file service to store files.")
      .addDropdown(dropdown => {
        dropdown
          .addOption("local","local directory")
          .addOption("minio", "minio")
          .addOption("aliyunOss", "aliyun OSS")
          .addOption("tencentCos", "tencent COS")
          .setValue(this.plugin.settings.storageService)
          .onChange(async value => {
            localSettingsEl.toggleClass(storageInfo.local.hideCls, storageInfo.local.name !== value)
            minioSettingsEl.toggleClass(storageInfo.minio.hideCls, storageInfo.minio.name !== value)
            aliyunOssSettingsEl.toggleClass(storageInfo.aliyunOss.hideCls, storageInfo.aliyunOss.name !== value)
            tencentCosSettingsEl.toggleClass(storageInfo.tencentOss.hideCls, storageInfo.tencentOss.name !== value)

            this.plugin.settings.storageService = value
            await this.plugin.saveSettings()
            await this.plugin.loadSettings()
          })
      })
  }
}
