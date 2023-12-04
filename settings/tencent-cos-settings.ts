import { Setting } from "obsidian"
import ObjectManager from '../main'

export function renderTencentCosSettings(containerEl: HTMLElement, plugin: ObjectManager) {
  const settings = plugin.settings.tencentCosSettings

  containerEl.createEl("h3", { text: "tencent COS settings" })

  new Setting(containerEl)
    .setName("access key id")
    .setDesc("tencent COS access key id.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.secretId)
        .onChange(async value => {
          settings.secretId = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("cos access secret")
    .setDesc("tencent COS access secret.")
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
    .setName("bucket")
    .setDesc("tencent COS bucket name.")
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
    .setName("region")
    .setDesc("tencent COS bucket region.")
    .addText(text =>
      text
        .setPlaceholder("")
        .setValue(settings.region)
        .onChange(async value => {
          settings.region = value
          await plugin.saveSettings()
        })
    )
}