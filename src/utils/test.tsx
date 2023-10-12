import { Connection, ITable, IDataBase } from 'jsstore';
import workerInjector from "jsstore/dist/worker_injector";

/**
 * 获得浏览器所有数据库名称
 */
export async function getAllDBName(): Promise<string[]> {
    const databases = await indexedDB.databases();
    return databases.map(obj => obj.name as string);
}

/**
 * 传入数据库名称，返回数据库的连接对象（无则创建数据库），返回还有布尔值，判定是否已经存在该名称的数据库
 * @param dbName 数据库名称
 * @returns 
 */
export async function createDB(dbName: string): Promise<{ connection: Connection, bool: boolean }> {
    const connection = new Connection();
    connection.addPlugin(workerInjector);

    const dbs = await indexedDB.databases();
    const db = dbs.find(db => db.name === dbName);

    const database: IDataBase = {
        name: dbName,
        tables: [],
    }
    if (db) {
        database.version = db.version;
    }

    const bool = await connection.initDb(database);
    return {
        connection,
        bool
    };
}

/**
 * 删除数据库
 * @param connection 
 * @returns
 */
export async function dropDB(connection: Connection): Promise<boolean> {
    try {
        await connection.dropDb();
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 给数据库添加表
 * @param connection 数据库连接
 * @param table 添加的表
 * @returns true表示新建表成功，false表示失败（同名表已存在）
 */
export async function addTable(connection: Connection, table: ITable): Promise<boolean> {
    console.log("add 开始", connection, table);
    console.log('长度',connection.database.tables.length);
    // 同名表已经存在
    if (connection.database.tables.some(tb => {
        console.log(tb, table.name);
        return tb.name === table.name
    })) {
        console.log('同名标已存在')
        return false;
    }

    let oldVersion = connection.database.version;
    if (!oldVersion) {
        oldVersion = 1;
    }
    const dbName = connection.database.name;
    const database: IDataBase = {
        name: dbName,
        tables: [...connection.database.tables, table],
        version: ++oldVersion
    };
    return await connection.initDb(database);
}

/**
 * 删除数据库的表
 * @param connection 
 * @param tableName 
 * @returns true表示删除表成功，false表示失败（表不存在）
 */
export async function deleteTable(connection: Connection, tableName: string): Promise<boolean> {
    // 不存在该名称的表
    if (connection.database.tables.every(tb => tb.name !== tableName)) {
        return false;
    }

    let oldVersion = connection.database.version;
    if (!oldVersion) {
        oldVersion = 1;
    }
    const dbName = connection.database.name;
    const newTables = connection.database.tables.filter(tb => tb.name !== tableName);
    const database: IDataBase = {
        name: dbName,
        tables: newTables,
        version: ++oldVersion
    };
    return await connection.initDb(database);
}