import { ObjectManagerSettings, storageInfo } from "settings/settings";
import { MinioUploader } from "./minio-uploader";
import { TencentCosUploader } from "./tencent-cos-uploader";

export interface Uploader {
    uploadFile(fileName: string, file: File): Promise<string>;
}

export function buildUploader(settings: ObjectManagerSettings): Uploader | undefined {
    const {storageService} = settings

    if (storageService === storageInfo.minio.name) {
        return new MinioUploader(settings.minioSettings);
    } else if (storageService === storageInfo.aliyunOss.name) {

    } else if (storageService === storageInfo.tencentOss.name) {
        return new TencentCosUploader(settings.tencentCosSettings)
    }

    return undefined
}