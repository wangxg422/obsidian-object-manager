import { MinioUploader } from "./minio-uploader";
import { TencentCosUploader } from "./tencent-cos-uploader";
import { AliyunOssUploader } from "./aliyun-oss-uploader";
import { ObjectManagerSettings, storageInfo } from "../settings/settings";
import { LocalUploader } from "./local-uploader";

export interface Uploader {
    uploadFile(fileName: string, file: File): Promise<string>
}

export function buildUploader(settings: ObjectManagerSettings,): Uploader | undefined {
    const { storageService, localSettings, minioSettings, aliyunOssSettings, tencentCosSettings } = settings

    let uploader: Uploader | undefined

    if (storageService === storageInfo.local.name) {
        if (settings.vaultSettings.basePath) {
            uploader = new LocalUploader(localSettings, settings.vaultSettings.basePath)
        }
    } else if (storageService === storageInfo.minio.name) {
        if (minioSettings.endPoint && minioSettings.accessKey && minioSettings.secretKey) {
            uploader = new MinioUploader(minioSettings)
        }
    } else if (storageService === storageInfo.aliyunOss.name) {
        if (aliyunOssSettings.bucket && aliyunOssSettings.accessKeyId && aliyunOssSettings.accessKeySecret) {
            uploader = new AliyunOssUploader(aliyunOssSettings)
        }
    } else if (storageService === storageInfo.tencentOss.name) {
        if (tencentCosSettings.bucket && tencentCosSettings.secretId && tencentCosSettings.secretKey) {
            uploader = new TencentCosUploader(tencentCosSettings)
        }
    }

    return uploader
}