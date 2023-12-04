import { localSettings } from "settings/settings"
import { Uploader } from "./uploader"

export class LocalUploader implements Uploader {
    settings: localSettings
    path: string

    constructor(settings: localSettings, basePath: string) {
        this.settings = settings
        this.path = `${basePath}/${this.settings.dir}/`
        // 如果目录不存在，则创建
        const fs = require('fs')
        fs.mkdir(this.path, function (err: any) {
            if (err) {
            }
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        const content = await file.arrayBuffer()

        return new Promise((resolve, reject) => {
            const fs = require('fs')

            fs.writeFile(this.path + fileName, Buffer.from(content), (err: any) => {
                if (err) {
                    reject("Error:" + err)
                }
                resolve(fileName)
            });
        })
    }

}