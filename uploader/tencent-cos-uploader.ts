import * as COS from "cos-nodejs-sdk-v5";
import { Uploader } from "./uploader";
import { tencentCosSettings } from "../settings/settings";

export class TencentCosUploader implements Uploader {
    settings: tencentCosSettings
    tencentCosClient: COS

    constructor(settings: tencentCosSettings) {
        this.settings = settings

        this.tencentCosClient = new COS({
            SecretId: settings.secretId,
            SecretKey: settings.secretKey,
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
        const fs = require('fs')
        const stream = fs.createReadStream(file)

        return new Promise((resolve, reject) => {
            this.tencentCosClient.putObject({
                Bucket: this.settings.bucket, /* 填入您自己的存储桶，必须字段 */
                Region: this.settings.region,  /* 存储桶所在地域，例如 ap-beijing，必须字段 */
                Key: fileName,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                StorageClass: this.genStorageClass(this.settings.storageClass),
                /* 当 Body 为 stream 类型时，ContentLength 必传，否则 onProgress 不能返回正确的进度信息 */
                Body: stream, // 上传文件对象
                ContentLength: fs.statSync(file).size,
                onProgress: function (progressData) {
                }
            }, function (err, data) {
                console.log(err || data);
            })
        })
        // return new Promise((resolve, reject) => {
        //     this.tencentCosClient.uploadFile({
        //         Bucket: '', /* 填入您自己的存储桶，必须字段 */
        //         Region: '',  /* 存储桶所在地域，例如 ap-beijing，必须字段 */
        //         Key: '',  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        //         FilePath: "",                /* 必须 */
        //         SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
        //         Headers: {
        //             'Content-Type': file.type
        //         },
        //     }, function (err, data) {
        //         if (err) {
        //             reject("Error:" + err.message) 
        //         } else {
        //             resolve(fileName)
        //         }
        //     })
        // })
    }
    private genStorageClass(storageClass: string): COS.StorageClass | undefined {
        return 'STANDARD'
    }
}
