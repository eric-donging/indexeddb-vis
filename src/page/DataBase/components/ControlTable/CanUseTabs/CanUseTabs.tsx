import React, { useCallback, useState } from 'react';
import { Input, Tabs, Button } from 'antd';
import type { TabsProps } from 'antd';
import styles from "./CanUseTabs.module.css";
import ConfigTable from '../ConfigTable';
import { MyRouteComponentProps } from '../../../../../types';
import dbOperateIns from '../../../../../utils/dbOperate';
import { colInfosFilter } from '../../../../../utils/dataOperate';
import { defaultPathInfo } from '../../../../../configs/routerConfig';
import { getLastPath } from '../../../../../utils/pathOperate';
import { Connection } from 'jsstore';

interface ISQLTabProps extends MyRouteComponentProps { };
export const SQLTab: React.FC<ISQLTabProps> = React.memo((props) => {



    // 判定现在是哪个数据库
    let dbName: null | string;
    const nowPath = props.location?.pathname;
    if (nowPath === '/' || nowPath === `/${defaultPathInfo.pathName}` || nowPath === `/${defaultPathInfo.pathName}/`) {
        // 现在没有选择数据库
        dbName = null;
    }
    dbName = getLastPath(props.location?.pathname || '');


    const [sqlStr, setSqlStr] = useState('');
    const handleSqlChange = useCallback((e: any) => {
        setSqlStr(e.target.value);
    }, []);

    const [msg, setMsg] = useState('');

    const handleRun = useCallback(async () => {
        console.log(props);
        if (!dbName) {
            setMsg('db不存在');
            return;
        }
        const transSQL = sqlStr.replaceAll(/\s/g, ' ').replace(';', '');

        await dbOperateIns.init();
        const { error, data } = await dbOperateIns.executeSQL(dbName, transSQL);
        // 渲染的结果对应的数据，字段
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    }, [dbName, props, sqlStr]);

    return <div className={styles.sql}>
        <Button className={styles.btn} type="primary" size="small"
            onClick={handleRun} style={{ fontSize: 12 }}>执行</Button>
        <Input.TextArea
            autoSize={{ minRows: 12, maxRows: 12 }}
            size="middle"
            className={styles.textArea}
            value={sqlStr}
            onChange={handleSqlChange}
        />
        <div>{msg}</div>
    </div>
});

interface ICreateTableTabProps extends MyRouteComponentProps { }
export const CreateTableTab: React.FC<ICreateTableTabProps> = React.memo((props) => {
    const onChange = (key: string) => {
        console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <div className={styles.smallFont}>信息创建</div>,
            children: <ConfigTable isApplyFile={false} {...props} />,
        },
        {
            key: '2',
            label: <div className={styles.smallFont}>文件导入</div>,
            children: <ConfigTable {...props} />,
        },
    ];

    return <Tabs
        className={styles.tabs}
        tabPosition="left"
        items={items}
        onChange={onChange}
    />
});
