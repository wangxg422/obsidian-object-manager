import { aliyunOssSettings } from "settings/settings";
import { Uploader } from "./uploader";
import OSS from "ali-oss";

export class AliyunOssUploader implements Uploader {
    settings: aliyunOssSettings
    aliyunOssClient: OSS

    constructor(settings: aliyunOssSettings) {
        this.settings = settings

        this.aliyunOssClient = new OSS({
            region: "oss-cn-" + settings.region,
            accessKeyId: settings.accessKeyId,
            accessKeySecret: settings.accessKeySecret,
            bucket: settings.bucket,
            secure: true
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const options = {
                headers: { "Content-Type": file.type },
            }

            this.aliyunOssClient.put(fileName, file, options).then(objInfo => {
                if (objInfo && objInfo.res && objInfo.res.status === 200) {
                    console.log("file " + fileName + " upload completed")
                    resolve(fileName)
                } else {
                    reject("Error:" + objInfo)
                }
            })
        })
    }

}