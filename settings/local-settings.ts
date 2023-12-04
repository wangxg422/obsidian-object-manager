import { Setting } from "obsidian"
import ObjectManager from '../main'

export function renderLocalSettings(containerEl: HTMLElement, plugin: ObjectManager) {
    const settings = plugin.settings.localSettings

    containerEl.createEl("h3", { text: "local settings" })

    new Setting(containerEl)
        .setName("storage directory")
        .setDesc("the directory to save files.")
        .addText(text =>
            text
                .setPlaceholder("")
                .setValue(settings.dir)
                .onChange(async value => {
                    settings.dir = value
                    await plugin.saveSettings()
                })
        )

}