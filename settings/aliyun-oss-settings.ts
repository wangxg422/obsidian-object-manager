import { Setting } from "obsidian"
import { aliyunOssSettings } from "./settings"
import ObjectManager from '../main'

export function renderAliyunOssSettings(containerEl: HTMLElement, plugin: ObjectManager) {
  const settings = plugin.settings.aliyunOssSettings

  containerEl.createEl("h3", { text: "oss settings" })

  new Setting(containerEl)
    .setName("server endpoint")
    .setDesc("aliyun oss endpoint.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.endPoint)
        .onChange(async value => {
          settings.endPoint = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("access key id")
    .setDesc("aliyun oss access key id.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.accessKeyId)
        .onChange(async value => {
          settings.accessKeyId = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("oss secret key")
    .setDesc("aliyun oss access secret.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.accessSecret)
        .onChange(async value => {
          settings.accessSecret = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("bucket")
    .setDesc("oss bucket name.")
    .addText(text =>
      text
        .setPlaceholder("oss bucket name")
        .setValue(settings.bucket)
        .onChange(async value => {
          settings.bucket = value
          await plugin.saveSettings()
        })
    )
}