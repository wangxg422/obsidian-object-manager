import { Setting } from "obsidian"
import { tencentCosSettings } from "./settings"
import ObjectManager from '../main'

export function renderTencentCosSettings(containerEl: HTMLElement, plugin: ObjectManager) {
  const settings = plugin.settings.tencentCosSettings

  containerEl.createEl("h3", { text: "tencent COS settings" })

  new Setting(containerEl)
    .setName("access key id")
    .setDesc("tencent cos access key id.")
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
    .setName("oss secret key")
    .setDesc("aliyun oss access secret.")
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
    .setDesc("cos bucket name.")
    .addText(text =>
      text
        .setPlaceholder("cos bucket name")
        .setValue(settings.bucket)
        .onChange(async value => {
          settings.bucket = value
          await plugin.saveSettings()
        })
    )

  new Setting(containerEl)
    .setName("region")
    .setDesc("cos bucket region.")
    .addText(text =>
      text
        .setPlaceholder("cos bucket region")
        .setValue(settings.region)
        .onChange(async value => {
          settings.region = value
          await plugin.saveSettings()
        })
    )
}