import { Connection, ITable, IDataBase } from 'jsstore';
import workerInjector from "jsstore/dist/worker_injector";
import SqlWeb from "sqlweb";
import { setTableObj, getTableObj, deleteTableObj } from './dbLocalStorage'

export interface SQLResult {
    error: string,
    data: any[]
}

interface ConnectObj {
    [prop: string]: Connection
}

class DBOperate {
    dbConnectionObj: ConnectObj = {};
    flag: boolean = false;

    /**
     * 初始化，维护内部dbConnections对象
     */
    async init() {
        if (this.flag) {
            return;
        }
        const databasesInfo = await indexedDB.databases();

        for (const { name, version } of databasesInfo) {
            const connection = new Connection();
            connection.addPlugin(workerInjector);
            connection.addPlugin(SqlWeb);
            if (typeof name === 'string') {
                const dbObj = getTableObj(name);
                const database: IDataBase = {
                    name: name,
                    tables: [...dbObj],
                    version: version,
                }
                const bool = await connection.initDb(database);
                this.dbConnectionObj[name] = connection;
            }
        }
        this.flag = true;
        // console.log(this.dbConnectionObj);
    }

    /**
     * 获得浏览器所有数据库名称
     */
    async getAllDBName(): Promise<string[]> {
        const databases = await indexedDB.databases();
        return databases.map(obj => obj.name as string);
    }

    /**
     * 传入数据库名称，返回数据库的连接对象（无则创建数据库），返回还有布尔值，判定是否已经存在该名称的数据库
     * @param dbName 数据库名称
     * @returns 
     */
    async createDB(dbName: string): Promise<{ connection: Connection, bool: boolean }> {
        const oldConnection = this.dbConnectionObj[dbName];
        if (oldConnection) {
            return {
                connection: oldConnection as Connection,
                bool: false
            };
        }

        const connection = new Connection();
        connection.addPlugin(workerInjector);
        const database: IDataBase = {
            name: dbName,
            tables: [],
        }

        const bool = await connection.initDb(database);
        this.dbConnectionObj[dbName] = connection;
        return {
            connection,
            bool
        };
    }

    /**
     * 删除数据库
     * @param dbName
     * @returns
     */
    async dropDB(dbName: string): Promise<boolean> {
        try {
            await this.dbConnectionObj[dbName].dropDb();
            delete this.dbConnectionObj[dbName];
            deleteTableObj(dbName);
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
    async addTable(connection: Connection, table: ITable): Promise<boolean> {
        // 同名表已经存在
        if (connection.database.tables.some(tb => {
            // console.log(tb, table.name);
            return tb.name === table.name
        })) {
            // console.log('同名表已存在')
            return false;
        }

        let oldVersion = connection.database.version;
        if (!oldVersion) {
            oldVersion = 1;
        }
        // console.log(oldVersion);
        const dbName = connection.database.name;
        const newTables = [...connection.database.tables, table].filter(it => it.name !== 'JsStore_Meta');
        const database: IDataBase = {
            name: dbName,
            tables: newTables,
            version: ++oldVersion
        };

        // 这里可能报错,例如字段里有非法字符%
        try {
            const bool = await connection.initDb(database);
            console.log(bool)
            this.dbConnectionObj[dbName] = connection;
            setTableObj(dbName, table.name, table);

            return bool;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * 给表添加数据
     * @param connection 
     * @param tableName 
     * @param data 
     * @returns 
     */
    async addData(connection: Connection, tableName: string, data: object | object[]): Promise<boolean> {
        if (!(data instanceof Array)) {
            data = [data];
        }
        const noOfRowsInserted = await connection.insert({
            into: tableName,
            values: data as any[], //you can insert multiple values at a time
        });
        if (typeof noOfRowsInserted === "number" && noOfRowsInserted > 0) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 传入数据库名称和sql语句，返回执行结果
     * @param dbName 
     * @param sql 
     * @returns 
     */
    async executeSQL(dbName: string, sql: string): Promise<SQLResult> {
        try {
            // console.log(this.dbConnectionObj[dbName]);
            // console.log(dbName);
            const res = await (this.dbConnectionObj[dbName] as any).$sql.run(sql);
            return {
                error: "",
                data: res
            }
        } catch (err: any) {
            console.log('发生了错误');
            console.log(err);
            return {
                error: `[${err.type}]:${err.message}`,
                data: []
            }
        }

    }
}

const dbOperateIns = new DBOperate();
export default dbOperateIns;
