export function fileTypeIsImage(file: File) {
    if (!file) {
        return false
    }

    return file.type.startsWith('image')
}