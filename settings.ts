import ObjectManager from './main'

import { App, PluginSettingTab, Setting } from 'obsidian'

export interface minioSettings {
  endPoint: string,
  port: number,
  accessKey: string,
  secretKey: string,
  bucket: string,
  namePrefix: string,
  useSSL: boolean,
}

export const DEFAULT_SETTINGS: ObjectManagerSettings = {
  minioSettings: {
    endPoint: "192.168.66.10",
    port: 9000,
    accessKey: "xishang",
    secretKey: "123456",
    bucket: "picture",
    namePrefix: "img-",
    useSSL: false,
  }
}

export interface ObjectManagerSettings {
  minioSettings: minioSettings
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
  }
}
