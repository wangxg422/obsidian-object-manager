import { Uploader } from "./uploader";
import { tencentCosSettings } from "../settings/settings";
import COS from "cos-js-sdk-v5";

export class TencentCosUploader implements Uploader {
    settings: tencentCosSettings
    tencentCosClient: COS

    constructor(settings: tencentCosSettings) {
        this.settings = settings

        console.log(settings)
        this.tencentCosClient = new COS({
            SecretId: settings.secretId,
            SecretKey: settings.secretKey,
        })
    }

    public async uploadFile(fileName: string, file: File): Promise<string> {
    
        return new Promise((resolve, reject) => {
            this.tencentCosClient.uploadFile({
                Bucket: this.settings.bucket, /* 填入您自己的存储桶，必须字段 */
                Region: this.settings.region,  /* 存储桶所在地域，例如ap-beijing，必须字段 */
                Key: fileName,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
                SliceSize: 1024 * 1024 * 5,     /* 触发分块上传的阈值，超过5MB使用分块上传，非必须 */
                onTaskReady: function(taskId) {                   /* 非必须 */
                },
                onProgress: function (progressData) {           /* 非必须 */
                },
                onFileFinish: function (err, data, options) {   /* 非必须 */
                },
                // 支持自定义headers 非必须
                Headers: {
                  'Content-Type': file.type
                },
            }, function(err, data) {
                if (err) {
                    reject("Error:" + err.message)
                } else {
                    resolve(fileName)
                }
            })
        })
    }
    private genStorageClass(storageClass: string): COS.StorageClass | undefined {
        return 'STANDARD'
    }
}
