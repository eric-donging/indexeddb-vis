import { DataFrame } from '@antv/data-wizard';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { uniq, cloneDeep } from 'lodash';
import { IColumnOption, TColumns } from 'jsstore';
import { ColInfo, FieldType } from '../types';

/**
 * 辅助函数，dftype转换成FieldType
 * @param type 
 * @returns 
 */
export function dftypeToFieldType(type: string): FieldType {
    let colType: FieldType;
    if (type === 'integer' || type === 'float') {
        colType = FieldType.number;
    } else if (type === 'boolean') {
        colType = FieldType.boolean;
    } else if (type === 'date') {
        colType = FieldType.dateTime;
    } else if (type === 'string') {
        colType = FieldType.string;
    } else {
        // type === 'null'
        colType = FieldType.object;
    }
    return colType;
}


/**
 * 传入上传文件后的json数据，返回初步预测ColInfo数组
 * @param datas 
 * @returns 
 */
export function datasToColInfos(datas: object[]): ColInfo[] {
    // console.log(datas);
    const df = new DataFrame(datas);
    const infos = df.info();  // 数据太奇怪可能会卡死
    // console.log(infos);
    const conInfos: ColInfo[] = df.columns.map((field, idx) => {
        const type = infos[idx].recommendation;
        const colType: FieldType = dftypeToFieldType(type);
        return {
            key: uuidv4(),
            colName: field as string,
            type: colType,
            isNull: true,
            isPrimary: false
        }
    });
    console.log(444);
    return conInfos;
}

/**
 * 传入colInfos，每一项除了key属性，如果其他属性是空串或false则过滤掉
 * @param infos 
 * @returns 
 */
export function colInfosFilter(infos: ColInfo[]): ColInfo[] {
    type InfoKey = keyof ColInfo;
    return infos.filter((info: ColInfo) => {
        const keys: InfoKey[] = Object.keys(info).filter(it => it !== 'key') as InfoKey[];
        return !keys.every(key => {
            if (!info[key]) return true;
            return false;
        });
    });
}

/**
 * 传入colInfos，检测是否有必填选项未填，是否字段名有重复
 * @param infos 
 * @returns 
 */
export function judgeColInfos(infos: ColInfo[]): boolean {
    // 判断是否有必填选项未填
    const mustBool = infos.some(info => {
        if (info.colName === '' || info.type === '') return true;
        return false;
    });
    if (mustBool) {
        message.error('有必填字段为空');
        return false;
    }

    // 判断字段名是否有重复
    const fieldName = infos.map(info => info.colName);
    const names = uniq(fieldName);
    if (fieldName.length > names.length) {
        message.error('字段名字不能重复');
        return false;
    }

    // 判断字段名是否有非法空白符
    const hasEmpty = fieldName.some(name => (name.includes(' ') || name.includes('\t')));
    if (hasEmpty) {
        message.error('字段名不能有空格');
        return false;
    }

    return true;
}

/**
 * 根据type类型，如果default有值，把字符串转换成对应的type类型
 * @param infos 
 */
export function reviseColInfos(infos: ColInfo[]): ColInfo[] {
    return infos.map(info => {
        if (info.type === FieldType.number && info.default) {
            return { ...info, default: Number(info.default) };
        } else if (info.type === FieldType.boolean && info.default) {
            return { ...info, default: Boolean(info.default) };
        } else if (info.type === FieldType.dateTime && info.default) {
            return { ...info, default: new Date(info.default) };
        } else if (info.type === FieldType.object && info.default) {
            const defaultStr = info.default;
            try {
                const defaultObj = Function('return ' + defaultStr)();
                if (typeof defaultObj === 'object') {
                    return { ...info, default: defaultObj };
                }
                return { ...info, default: null };
            } catch (e) {
                return { ...info, default: null };
            }
        } else if (info.type === FieldType.array && info.default) {
            const defaultStr = info.default;
            try {
                const defaultArr = Function('return ' + defaultStr)();
                if (defaultArr instanceof Array) {
                    return { ...info, default: defaultArr };
                }
                return { ...info, default: [] };
            } catch (e) {
                return { ...info, default: [] };
            }
        }
        return info;
    })
}

/**
 * infos到jsstore创建表需要的columns的映射
 * @param infos 
 * @returns 
 */
export function colInfosToTColumns(infos: ColInfo[]): TColumns {
    const res: TColumns = {};
    for (const info of infos) {
        const key = info.colName;
        const option: IColumnOption = {
            primaryKey: info.isPrimary,
            notNull: !info.isNull,
            dataType: info.type as string,
        }
        if (info.default) {
            option.default = info.default;
        }
        if (info.autoIncrement) {
            option.autoIncrement = info.autoIncrement;
        }
        res[key] = option;
    }
    return res;
}

/**
 * 根据infos将数据类型修正
 * @param datas 
 * @param infos 
 * @returns 
 */
export function dataTransform(datas: object[], infos: ColInfo[]): object[] {
    console.log(datas, infos);
    const newData: object[] = cloneDeep(datas);
    for (const { colName, type } of infos) {
        newData.map((data: any) => {
            const value = data[colName];
            if (type === FieldType.number) {
                data[colName] = Number(value);
            } else if (type === FieldType.string) {
                if (value instanceof Object && !(value instanceof Array)) {
                    try {
                        data[colName] = JSON.parse(value);
                    } catch {
                        data[colName] = '';
                    }
                } else {
                    data[colName] = String(value);
                }
            }
            else if (type === FieldType.boolean) {
                data[colName] = Boolean(value);
            } else if (type === FieldType.dateTime) {
                data[colName] = new Date(value);
            } else if (type === FieldType.object) {
                if (typeof value === "string") {
                    try {
                        const defaultObj = Function('return ' + value)();

                        if (typeof defaultObj === 'object') {
                            data[colName] = defaultObj;
                        } else {
                            data[colName] = null
                        }
                    } catch (e) {
                        data[colName] = null;
                    }
                } else {
                    data[colName] = value;
                }
            } else if (type === FieldType.array) {
                if (typeof value === "string") {
                    try {
                        const defaultArr = Function('return ' + value)();
                        if (defaultArr instanceof Array) {
                            data[colName] = defaultArr;
                        } else {
                            data[colName] = [];
                        }
                    } catch (e) {
                        data[colName] = [];
                    }
                } else {
                    data[colName] = value;
                }
            }
            return data;
        });
    }
    // console.log(newData);
    return newData;
}