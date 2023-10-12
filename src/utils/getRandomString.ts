export function getRandomString(length: number) {
    return Math.random().toString(36).substring(2, 2 + length).split("").join(".")
}

export function getNowTimeString(start: string = ''): string {
    const d = new Date();
    return `${start}${d.getFullYear()}${trimZero(d.getMonth() + 1)}${trimZero(d.getDay())}${trimZero(d.getHours())}${trimZero(d.getMinutes())}${trimZero(d.getSeconds())}`
}

function trimZero(s: number | string): string {
    let t = String(s);
    if (t.length === 1) {
        t = '0' + t;
    }
    return t;
}
