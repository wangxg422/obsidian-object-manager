import { Setting } from "obsidian"
import { minioSettings } from "./settings"
import ObjectManager from '../main'

export function renderMinioSettings(containerEl: HTMLElement, plugin: ObjectManager) {
  const settings = plugin.settings.minioSettings

  containerEl.createEl("h3", { text: "minio settings" })

  new Setting(containerEl)
    .setName("server endpoint")
    .setDesc("The is object manager.")
    .addText(text =>
      text
        .setPlaceholder("server address")
        .setValue(settings.endPoint)
        .onChange(async value => {
          settings.endPoint = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("server port")
    .setDesc("minio server port.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.port)
        .onChange(async value => {
          settings.port = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("access key")
    .setDesc("minio server access key.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.accessKey)
        .onChange(async value => {
          settings.accessKey = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("secret key")
    .setDesc("minio secret key.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.secretKey)
        .onChange(async value => {
          settings.secretKey = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("bucket") // 设置控件名称
    .setDesc("minio bucket name.") // 设置控件描述文案
    .addText(text => // addText 方法用于创建 input 文本框, 回调函数中的参数为文本框dom对象
      text
        .setPlaceholder("") // 设置文本框 placeholder
        .setValue(settings.bucket) // 设置文本框内容
        .onChange(async value => { // 监听文本框的 change 事件
          settings.bucket = value
          await plugin.saveSettings() // 保存设置
        })
    )

  new Setting(containerEl)
    .setName("use SSL")
    .setDesc("enable when minio server is using ssl.")
    .addToggle(t => {
      t.setValue(settings.useSSL)
      t.onChange(async value => {
        settings.useSSL = value
        await plugin.saveSettings()
      })
    })
}