import { ObjectManagerSettings } from "settings/settings";
import { MinioUploader } from "./minio-uploader";
import { TencentCosUploader } from "./tencent-cos-uploader";

export interface Uploader {
    uploadFile(fileName: string, file: File): Promise<string>;
}

export function buildUploader(settings: ObjectManagerSettings): Uploader | undefined {
    const {storageService} = settings

    if (storageService === "minio") {
        return new MinioUploader(settings.minioSettings);
    } else if (storageService === "aliyunOss") {

    } else if (storageService === "tencentCos") {
        return new TencentCosUploader(settings.tencentCosSettings)
    }

    return undefined
}