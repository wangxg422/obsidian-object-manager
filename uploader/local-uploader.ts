import { localSettings } from "settings/settings"
import { Uploader } from "./uploader"

export class LocalUploader implements Uploader {
    settings: localSettings
    constructor(settings: localSettings) {
        this.settings = settings
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            
        })
    }
    
}