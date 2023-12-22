import { Setting } from "obsidian"
import ObjectManager from '../main'

export function renderLocalSettings(containerEl: HTMLElement, plugin: ObjectManager) {
    const settings = plugin.settings.localSettings

    containerEl.createEl("h3", { text: "local settings" })

    new Setting(containerEl)
        .setName("attachment storage directory")
        .setDesc("relative to the root directory of the vault. eg: accachments.")
        .addText(text =>
            text
                .setPlaceholder("")
                .setValue(settings.dir)
                .onChange(async value => {
                    settings.dir = value
                    await plugin.saveSettings()
                })
        )

    new Setting(containerEl)
        .setName("wiki link")
        .setDesc("use wiki link, otherwise embed markdown format.")
        .addToggle(t => {
            t.setValue(settings.wikiLink)
            t.onChange(async value => {
                settings.wikiLink = value
                await plugin.saveSettings()
            })
        })
}