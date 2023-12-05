export function getTime() {
    const time = new Date()
    return `${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}${time.getHours()}${time.getMinutes()}${time.getSeconds()}${time.getMilliseconds()}`
}