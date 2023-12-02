import * as stream from "stream";
import { minioSettings } from "../settings/settings";
import { Uploader } from "./uploader";
import { Client } from "minio";

export class MinioUploader implements Uploader {
    settings: minioSettings
    minioClient: Client

    constructor(settings: minioSettings) {
        this.settings = settings

        this.minioClient = new Client({
            endPoint: settings.endPoint,
            port: parseInt(settings.port),
            useSSL: settings.useSSL,
            accessKey: settings.accessKey,
            secretKey: settings.secretKey,
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        const content = await file.arrayBuffer()
        const client = this.minioClient
        const bucket = this.settings.bucket

        // 指定Content-Type为文件类型，如不指定，则默认为binary/octet-stream，浏览器访问图片时会直接下载
        const metaData = {
            'Content-Type': file.type
        }

        return new Promise((resolve, reject) => {
            client.putObject(bucket, fileName, Buffer.from(content), file.size, metaData,function (err, objInfo) {
                if (err) {
                    reject("Error:" + err.message) 
                }
                
                resolve(fileName)
            })
        })
    }
}