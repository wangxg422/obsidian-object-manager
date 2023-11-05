import * as stream from "stream";
import { minioSettings } from "../settings";
import { Uploader } from "./uploader";
import { Client } from "minio";

export class MinioUploader implements Uploader {
    settings: minioSettings
    minioClient: Client

    constructor(settings: minioSettings) {
        this.settings = settings

        this.minioClient = new Client({
            endPoint: settings.endPoint,
            port: settings.port,
            useSSL: settings.useSSL,
            accessKey: settings.accessKey,
            secretKey: settings.secretKey,
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        const content = await file.arrayBuffer()
        const client = this.minioClient
        const bucket = this.settings.bucket

        return new Promise((resolve, reject) => {
            client.putObject(bucket, fileName, Buffer.from(content), file.size, function (err, objInfo) {
                if (err) {
                    reject("Error:" + err.message) 
                }
                console.log('Success', objInfo)
                resolve(fileName)
            })
        })
    }
}