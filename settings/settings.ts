import ObjectManager from '../main'

import { App, Notice, PluginSettingTab, Setting } from 'obsidian'
import { renderMinioSettings } from './minio-settings'
import { renderAliyunOssSettings } from './aliyun-oss-settings'
import { renderTencentCosSettings } from './tencent-cos-settings'

export interface minioSettings {
  endPoint: string,
  port: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
  useSSL: boolean,
}

export interface aliyunOssSettings {
  endPoint: string,
  accessKeyId: string,
  accessSecret: string,
  bucket: string,
  object: string, //Object完整路径，完整路径中不能包含Bucket名称
}

export interface tencentCosSettings {
  secretId: string,
  secretKey: string,
  bucket: string,
  region: string,
  storageClass: string,
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
  aliyunOssSettings: {
    endPoint: "",
    accessKeyId: "",
    accessSecret: "",
    bucket: "",
    object: ""
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
  storageService: string,
  imageOnly: boolean,
  minioSettings: minioSettings,
  aliyunOssSettings: aliyunOssSettings,
  tencentCosSettings: tencentCosSettings,
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

    const minioSettingsEl = containerEl.createEl("div", { cls: "minio-settings-hide" })
    const aliyunOssSettingsEl = containerEl.createEl("div", { cls: "aliyun-oss-settings-hide" })
    const tencentCosSettingsEl = containerEl.createEl("div", { cls: "tencent-cos-settings-hide" })

    minioSettingsEl.toggleClass("minio-settings-hide", "minio" !== this.plugin.settings.storageService)
    aliyunOssSettingsEl.toggleClass("aliyun-oss-settings-hide", "aliyunOss" !== this.plugin.settings.storageService)
    tencentCosSettingsEl.toggleClass("tencent-oss-settings-hide", "tencentCos" !== this.plugin.settings.storageService)

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
      .setName("file storage service")
      .setDesc("the file service to save files.")
      .addDropdown(dropdown => {
        dropdown
          .addOption("minio", "minio")
          .addOption("aliyunOss", "aliyun OSS")
          .addOption("tencentCos", "tencent COS")
          .setValue(this.plugin.settings.storageService)
          .onChange(async value => {
            minioSettingsEl.toggleClass("minio-settings-hide", "minio" !== value)
            aliyunOssSettingsEl.toggleClass("aliyun-oss-settings-hide", "aliyunOss" !== value)
            tencentCosSettingsEl.toggleClass("tencent-cos-settings-hide", "tencentCos" !== value)

            this.plugin.settings.storageService = value
            await this.plugin.saveSettings()
          })
      })
  }
}