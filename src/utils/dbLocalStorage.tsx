import { ITable } from 'jsstore';


const spitStr = '!$&$';

/**
 * 本地化存储数据库表信息
 * @param dbName 数据库名称
 * @param tableName 表名称
 * @param obj 表jsstore对象
 */
export function setTableObj(dbName: string, tableName: string, obj: ITable) {
    // 一个本地化存储存数据库对应表的名称
    const res = localStorage.getItem(dbName);
    if (res) {
        localStorage.setItem(dbName, JSON.stringify([tableName, ...JSON.parse(res)]));
    } else {
        localStorage.setItem(dbName, JSON.stringify([tableName]));
    }

    // 一个存具体的表对应的对象
    localStorage.setItem(`${dbName}${spitStr}${tableName}`, JSON.stringify(obj));
}

/**
 * 返回数据库对应表本地化存储的信息
 * @param dbName 数据库名
 * @returns 
 */
export function getTableObj(dbName: string): ITable[] {
    const res = localStorage.getItem(dbName);
    if (res) {
        const items = [];
        const tableNames = JSON.parse(res);
        for (const tableName of tableNames) {
            const item = localStorage.getItem(`${dbName}${spitStr}${tableName}`);
            if (item) {
                items.push(JSON.parse(item));
            }
        }
        return items;
    } else {
        return [];
    }
}

/**
 * 根据数据库名，获得表名数组
 * @param dbName 
 * @returns 
 */
export function getTableNames(dbName:string):string[]{
    const res = localStorage.getItem(dbName);
    if(res){
        return JSON.parse(res);
    }else{
        return [];
    }
}

/**
 * 删除本地化存储的表信息
 * @param dbName 
 */
export function deleteTableObj(dbName: string) {
    const res = localStorage.getItem(dbName);
    if(res){
        const tableNames = JSON.parse(res);
        console.log(111,tableNames);
        for(const t of tableNames){
            localStorage.removeItem(`${dbName}${spitStr}${t}`);
        }
        localStorage.removeItem(dbName);
    }    
}
