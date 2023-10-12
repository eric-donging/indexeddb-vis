export function getLastPath(pathStr: string): string {
    let idx = pathStr.indexOf('/');
    if (idx === -1) return pathStr;

    let result: string;
    while (true) {
        const newIdx = pathStr.indexOf('/', idx + 1);
        if (newIdx === -1) {
            result = pathStr.slice(idx + 1);
            break;
        }
        idx = newIdx;
    }
    return result;
}

/**
 * 传入location里pathname，返回第一个路径字符串
 * @param pathStr 
 * @returns 
 */
export function getFirstPath(pathStr: string): string {
    if (pathStr === '/' || !pathStr.startsWith('/')) return '';

    const idx = pathStr.indexOf('/', 1);
    if (idx === -1) {
        return pathStr.slice(1);
    } else {
        return pathStr.slice(1, idx);
    }
}