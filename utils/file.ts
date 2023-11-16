export function isImage(file: File) {
    if (!file) {
        return false
    }

    return file.type.startsWith('image')
}