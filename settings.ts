import ObjectManager from './main'

import { App, PluginSettingTab, Setting } from 'obsidian'

export interface minioSettings {
  endPoint: string,
  port: string,
  accessKey: string,
  secretKey: string,
  bucket: string,
  imagePrefix: string,
  filePrefix: string,
  useSSL: boolean,
}

export const DEFAULT_SETTINGS: ObjectManagerSettings = {
  minioSettings: {
    endPoint: "192.168.66.10",
    port: "9000",
    accessKey: "xishang",
    secretKey: "xishang",
    bucket: "mynote",
    imagePrefix: "img-",
    filePrefix: "file-",
    useSSL: false,
  },
  imageOnly: false,
}

export interface ObjectManagerSettings {
  minioSettings: minioSettings,
  imageOnly: boolean,
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
    // 添加控件到面板容器中
    new Setting(containerEl)
      .setName("server addresses") // 设置控件名称
      .setDesc("The is object manager.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("server address") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.endPoint) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.endPoint = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

    new Setting(containerEl)
      .setName("server port") // 设置控件名称
      .setDesc("minio server port.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("default is 9000") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.port) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.port = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

      new Setting(containerEl)
      .setName("access key") // 设置控件名称
      .setDesc("minio server access key.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.accessKey) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.accessKey = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

      new Setting(containerEl)
      .setName("secret key") // 设置控件名称
      .setDesc("minio secret key.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.secretKey) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.secretKey = value
            await this.plugin.saveSettings() // 保存设置
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
      .setName("image prefix") // 设置控件名称
      .setDesc("image file name prefix.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.imagePrefix) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.imagePrefix = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

      new Setting(containerEl)
      .setName("file prefix") // 设置控件名称
      .setDesc("file name prefix if file type is not image.") // 设置控件描述文案
      .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
        text
          .setPlaceholder("") // 设置文本框 placeholder
          .setValue(this.plugin.settings.minioSettings.filePrefix) // 设置文本框内容
          .onChange(async value => { // 监听文本框的 change 事件
            this.plugin.settings.minioSettings.filePrefix = value
            await this.plugin.saveSettings() // 保存设置
          })
      )

      new Setting(containerEl)
      .setName("use SSL") // 设置控件名称
      .setDesc("enable when minio server is using ssl.") // 设置控件描述文案
      .addToggle(t => {
        t.setValue(this.plugin.settings.minioSettings.useSSL)
        t.onChange(async value => {
              this.plugin.settings.minioSettings.useSSL = value
              await this.plugin.saveSettings()
            })
      })
  }
}
