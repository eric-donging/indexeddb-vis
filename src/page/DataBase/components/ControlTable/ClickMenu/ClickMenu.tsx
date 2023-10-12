import React, { useCallback, CSSProperties } from 'react'
import { List } from 'antd';
import styles from './ClickMenu.module.css'
import { MyRouteComponentProps } from '../../../../../types';


interface WrapMenuProps {
    onClickOver?: () => void
    onCreateTable?: () => void
    onCreateSQL?: () => void
    style?: CSSProperties
    className?: string
}

/**
 * 右键点击空白展示的选项
 * @param props 
 * @returns 
 */
export const WrapMenu: React.FC<WrapMenuProps> = React.memo((props) => {
    const handleCreateTable = useCallback(async () => {
        // 自己点击完也要使列表隐藏
        props.onClickOver && props.onClickOver();

        if (props.onCreateTable) {
            await props.onCreateTable();
            console.log('创建表结束')
        }
    }, [props]);

    const handleCreateSQL = useCallback(() => {
        props.onClickOver && props.onClickOver();

        if (props.onCreateSQL) {
            props.onCreateSQL();
        }
    }, [props]);

    const listItem = [
        <List.Item
            key='createTable1'
            className={styles.listItem}
            onClick={handleCreateTable}
        >
            新建表
        </List.Item>,
        <List.Item
            key='createSQL1'
            className={styles.listItem}
            onClick={handleCreateSQL}
        >
            新建SQL窗口
        </List.Item>
    ];

    const { className: cn = '', style = {} } = props;

    return <List
        className={`${styles.list} ${cn}`}
        style={style}
        size='small'
    >
        {listItem}
    </List>
});


interface TableMenuProps {
    onReviseTable?: () => Promise<boolean>
    onDeleteTable?: () => Promise<boolean>
    onExportTable?: () => Promise<boolean>
    onCreateSQL?: () => boolean
    style?: CSSProperties
    className?: string
    tableName: string
}

/**
 * 点击表展示的选项
 * @param props 
 * @returns 
 */
export const TableMenu: React.FC<TableMenuProps> = React.memo((props) => {
    const handleReviseTable = useCallback(async () => {
        if (props.onReviseTable) {
            props.onReviseTable();
        }
    }, [props]);

    const handleDeleteTable = useCallback(() => {
        if (props.onDeleteTable) {
            props.onDeleteTable();
        }
    }, [props]);

    const handleExportTable = useCallback(() => {
        if (props.onExportTable) {
            props.onExportTable();
        }
    }, [props]);

    const handleCreateSQL = useCallback(() => {
        if (props.onCreateSQL) {
            props.onCreateSQL();
        }
    }, [props]);

    const listItem = [
        <List.Item
            key={`revise${props.tableName}`}
            className={styles.listItem}
            onClick={handleReviseTable}
        >
            修改表
        </List.Item>,
        <List.Item
            key={`delete${props.tableName}`}
            className={styles.listItem}
            onClick={handleDeleteTable}
        >
            删除表
        </List.Item>,
        <List.Item
            key={`export${props.tableName}`}
            className={styles.listItem}
            onClick={handleExportTable}
        >
            导出表
        </List.Item>,
        <List.Item
            key={`createsql${props.tableName}`}
            className={styles.listItem}
            onClick={handleCreateSQL}
        >
            新建SQL窗口
        </List.Item>
    ];

    const { className: cn = '', style = {} } = props;

    return <List
        className={`${styles.list} ${cn}`}
        style={style}
        size='small'
    >
        {listItem}
    </List>
});



// export const ColMenu: React.FC = () => {
//     return <List
//         size='small'
//         bordered
//         dataSource={colData}
//         renderItem={(item) => (
//             <List.Item>
//                 {item}
//             </List.Item>
//         )}
//     />
// }