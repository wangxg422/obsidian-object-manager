import { ObjectManagerSettings } from "settings";
import { MinioUploader } from "./minio";

export interface Uploader {
    uploadFile(fileName: string, file: File): Promise<string>;
}

export function buildUploader(settings: ObjectManagerSettings): Uploader | undefined {
    return new MinioUploader(settings.minioSettings);
}