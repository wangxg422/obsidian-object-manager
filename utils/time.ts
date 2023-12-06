import moment from "moment"

export function getTime() {
    return moment().format('YYYYMMDDHHmmssSSS')
}