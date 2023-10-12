/**
 * 传入任意js类型数据，返回在页面上渲染的恰当字符串
 * @param data 数据
 */
export default function dataRender(data: any): string {
    try {
        if (data instanceof Date) {
            return data.toString();
        } else if (Object.is(null, data)) {
            return 'null';
        } else if (Object.is(undefined, data)) {
            return 'undefined';
        } else if (data instanceof Array) {
            return `[${data.toString()}]`
        } else if (typeof data === "boolean") {
            return data ? '1' : '0';
        } else if (typeof data === "object") {
            return JSON.stringify(data);
        }
        return String(data);
    }
    catch (err) {
        return '数据渲染异常';
    }
}