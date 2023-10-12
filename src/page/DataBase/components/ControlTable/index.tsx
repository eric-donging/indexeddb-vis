import React, { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { Resizable } from 're-resizable';
import { Connection, ITable } from 'jsstore';
import { Tree, List, Tabs, Empty, message } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { ReloadOutlined } from '@ant-design/icons';
import MyIcon from '../../../../components/MyIcon';
import { WrapMenu, TableMenu } from './ClickMenu/ClickMenu';
import { MyRouteComponentProps } from '../../../../types';
import { ContextMenuDataSet } from '../../types';
import { defaultPathInfo } from '../../../../configs/routerConfig';
import { getLastPath } from '../../../../utils/pathOperate';
import dbOperateIns from '../../../../utils/dbOperate';
import styles from './index.module.css';
import { CreateTableTab, SQLTab } from './CanUseTabs/CanUseTabs';

interface IProps extends MyRouteComponentProps {
    defaultSize: {
        width: string | number,
        height: string | number
    },
    minWidth: string | number,
    maxWidth: string | number
    style?: CSSProperties,
    className?: string
}

const ControlTable: React.FC<IProps> = (props) => {
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };

    // 容器宽度
    const [width, setWidth] = useState(parseInt('' + props.defaultSize.width));

    // 表的树结构
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [isTreeEmpty, setIsTreeEmpty] = useState(true);

    const [tables, setTables] = useState<ITable[]>([]);

    const [updateObj, forceUpdate] = useState<any>({});
    const handleReloadTable = useCallback(() => {
        console.log('re render');
        forceUpdate({});
    }, []);


    // 判定数据库，获得表数据
    useEffect(() => {
        (async () => {
            await dbOperateIns.init();  // 初始化数据库操作实例

            // 判定现在是哪个数据库
            const nowPath = props.location?.pathname;
            if (nowPath === '/' || nowPath === `/${defaultPathInfo.pathName}` || nowPath === `/${defaultPathInfo.pathName}/`) {
                // 现在没有选择数据库
                return;
            }

            const dbN = getLastPath(props.location?.pathname || '');

            const connection: Connection = dbOperateIns.dbConnectionObj[dbN];
            const tables = connection.database.tables.filter(it => it.name !== 'JsStore_Meta');
            setTables(tables);
        })();
    }, [props.location?.pathname, updateObj]);

    // 表结构渲染以及打点处理
    useEffect(() => {
        setWidth(prev => {
            console.log(prev);
            const data: DataNode[] = tables.map(tb => {
                const tbName = tb.name;
                const cols = Object.keys(tb.columns);
                const children: DataNode[] = cols.map(col => ({
                    title: <div
                        data-type='col'
                        data-name={col}
                        data-belong={tbName}
                        style={{
                            maxWidth: prev - 84,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {col}
                    </div>,
                    icon: <MyIcon type='icon-liebiao' />,
                    key: `${tbName}-${col}`,
                }));
                return {
                    title: <div
                        data-type='table'
                        data-name={tbName}
                        style={{
                            maxWidth: prev - 60,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {tbName}
                    </div>,
                    icon: <MyIcon type='icon-biaodanzujian-biaoge' style={{ fontSize: '16px' }} />,
                    key: tbName,
                    children
                }
            });

            setTreeData(data);
            if (tables.length > 0) {
                setIsTreeEmpty(false);
            } else if (tables.length === 0) {
                setIsTreeEmpty(true);
            }
            return prev;
        })
    }, [tables, width,]);


    // 控制右键点击需要的state
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [isShowWrapMenu, setIsShowWrapMenu] = useState(false);
    const [isShowTableMenu, setIsShowTableMenu] = useState(false);
    const [selectedTableName, setSelectedTableName] = useState('');

    /**
     * 处理右键点击组件显示的操作选项
     */
    const handleContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsShowWrapMenu(prev => false);
        setIsShowTableMenu(prev => false);

        const target = e.target as HTMLElement;
        const { clientX, clientY } = e;
        setMenuPosition(prev => ({
            x: clientX,
            y: clientY + 10
        }));

        const dataset: ContextMenuDataSet = target.dataset;
        console.log(dataset)
        if (dataset.type === 'wrap') {
            // 右击的是空白
            const nowPath = props.location?.pathname;
            if (nowPath === '/' || nowPath === `/${defaultPathInfo.pathName}` || nowPath === `/${defaultPathInfo.pathName}/`) {
                // 现在没有选择数据库
                message.warning('请先选择数据库实例');
            } else {
                setIsShowWrapMenu(true);
            }
        } else if (dataset.type === 'table') {
            // 右击的是表
            setSelectedTableName(prev => dataset.name || '');  // 设置选中的表名
            setIsShowTableMenu(true);
        } else if (dataset.type === 'col') {
            // 右击的是列
        }
    }, [props.location?.pathname]);

    /**
     * 取消右键产生的操作选项的显示
     */
    const cancleContextMenu = useCallback(() => {
        setIsShowWrapMenu(prev => false);
        setIsShowTableMenu(prev => false);
    }, []);


    // 关于设置大小时右边阴影效果的样式
    const [rightClass, setRightClass] = useState(styles.resizeRight);


    // 右侧选项卡相关
    const initialItems: any[] = [
        { label: 'SQL 窗口', children: <SQLTab location={props.location} />, key: '1', closable: false },
    ];
    const [activeKey, setActiveKey] = useState(initialItems[0].key);
    const [items, setItems] = useState(initialItems);
    const newTabIndex = useRef(1);

    const handleTabsChange = useCallback((newActiveKey: string) => {
        setActiveKey(newActiveKey);
    }, []);

    /**
     * 新增默认的tab窗口
     */
    const addTab = useCallback((lableStr: string = 'SQL 窗口', child: JSX.Element = <SQLTab location={props.location} />) => {
        const newActiveKey = `${++newTabIndex.current}`;
        const newPanes = [...items];
        newPanes.push({ label: lableStr + newActiveKey, children: child, key: newActiveKey });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    }, [items, props.location]);

    /**
     * 移除现有的某个tab窗口
     */
    const removeTab = useCallback((targetKey: string) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        setItems(newPanes);
        setActiveKey(newActiveKey);
    }, [activeKey, items]);

    /**
     * 编辑tab窗口
     */
    const onEditTab = useCallback((targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
        if (action === 'add') {
            addTab();
        } else {
            removeTab(targetKey as string);
        }
    }, [addTab, removeTab]);

    /**
     * 右键新增SQL窗口
     */
    const handleCreateSQL = useCallback(() => {
        addTab();
        return true;
    }, [addTab]);

    /**
     * 右键新增新建表窗口
     */
    const handleCreateTable = useCallback(() => {
        addTab('新建表', <CreateTableTab location={props.location} />)
    }, [addTab, props.location]);

    const { style = {}, className: cn = '' } = props;
    return (
        <>
            {/* 关于展示表树状的组件 */}
            <Resizable
                style={{
                    ...style
                }}
                className={`${cn} ${styles.wrap}`}
                size={{ width: width, height: 'auto' }}
                onResizeStart={() => {
                    setRightClass(prve => styles.resizeRightDrag);
                }}
                onResizeStop={(e, direction, ref, d) => {
                    setWidth(prev => width + d.width);
                    setRightClass(prev => styles.resizeRight);
                }}
                defaultSize={props.defaultSize}
                minWidth={props.minWidth}
                maxWidth={props.maxWidth}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                handleClasses={{ right: rightClass }}
            >
                <div
                    className={styles.contentWrap}
                    data-type='wrap'
                    onContextMenu={handleContextMenu}
                    onClick={cancleContextMenu}
                >
                    <List className={styles.title}>
                        <div className={styles.txt}>
                            <span>表</span>
                            <ReloadOutlined className={styles.icon} onClick={handleReloadTable} />
                        </div>
                    </List>

                    {isTreeEmpty ? <Empty className={styles.empty} />
                        : <Tree
                            showLine
                            showIcon
                            expandAction={'click'}
                            onSelect={onSelect}
                            treeData={treeData}
                        />
                    }

                </div>
            </Resizable>

            {/* 右侧选项卡 */}
            <Tabs
                className={styles.tabs}
                type="editable-card"
                onChange={handleTabsChange}
                onClick={cancleContextMenu}
                activeKey={activeKey}
                onEdit={onEditTab}
                items={items}
            />

            {/* 右键点击展示的列表组件 */}
            {isShowWrapMenu ?
                <WrapMenu
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                    onClickOver={cancleContextMenu}
                    onCreateTable={handleCreateTable}
                    onCreateSQL={handleCreateSQL}
                />
                : null}
            {isShowTableMenu ?
                <TableMenu
                    tableName={selectedTableName}
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                />
                : null}
        </>
    )
}

export default React.memo(ControlTable);