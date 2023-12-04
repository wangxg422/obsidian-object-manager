import { Setting } from "obsidian"
import ObjectManager from '../main'

export function renderAliyunOssSettings(containerEl: HTMLElement, plugin: ObjectManager) {
  const settings = plugin.settings.aliyunOssSettings

  containerEl.createEl("h3", { text: "aliyun OSS settings" })

  new Setting(containerEl)
    .setName("bucket")
    .setDesc("aliyun OSS bucket name.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.bucket)
        .onChange(async value => {
          settings.bucket = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("oss bucket region")
    .setDesc("aliyun oss bucket region.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.region)
        .onChange(async value => {
          settings.region = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("oss access key id")
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
    .setName("oss access key secret")
    .setDesc("aliyun oss access key secret.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.accessKeySecret)
        .onChange(async value => {
          settings.accessKeySecret = value
          await plugin.saveSettings()
        })
    )
}