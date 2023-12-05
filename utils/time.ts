export function getTime() {
    const time = new Date()
    return `${time.getFullYear}${time.getMonth}${time.getDate}${time.getHours}${time.getMinutes}${time.getSeconds}${time.getMilliseconds}`
}