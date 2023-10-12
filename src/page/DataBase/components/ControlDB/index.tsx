import React, { useEffect, useState, useCallback, CSSProperties } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Tooltip, Dropdown, Space, Modal, Form, Input, message } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import MyIcon from '../../../../components/MyIcon';
import PanelExpand from '../../../../components/PanelExpand';
import dbOperateIns from '../../../../utils/dbOperate';
import { defaultPathInfo } from '../../../../configs/routerConfig';
import styles from './index.module.css';
import { MyRouteComponentProps } from '../../../../types';
import { getLastPath } from '../../../../utils/pathOperate';

interface IProps extends MyRouteComponentProps {
    style?: CSSProperties,
    className?: string
}

type MenuItem = Required<MenuProps>['items'][number];
/**
 * 生成列表每一项
 */
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const ControlDB: React.FC<IProps> = (props) => {
    // 强制渲染，给机会重新运行useEffect
    const [updateObj, forceUpdate] = useState({});

    // 要渲染数据库列表的React元素
    const [items, setItems] = useState<MenuProps['items']>([]);


    // 关于弹框，新建数据库实例
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    // 弹窗中input框 数据库实例名称值
    const [value, setValue] = useState<string>('');

    // 弹窗点击创建按钮后的操作
    const handleAddDB = useCallback(async (dbName: string) => {
        const { bool } = await dbOperateIns.createDB(dbName);
        if (bool) {
            // 创建数据库成功
            message.success('数据库实例创建成功！');
            forceUpdate({});
        } else {
            // 数据库已经存在
            message.error('数据库已存在！');
        }
    }, []);

    const showModal = useCallback(() => {
        setOpen(true);
    }, []);
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);
    const handleOk = useCallback(async () => {
        if (!value) {
            message.error("数据库名不能为空");
            return;
        }
        setConfirmLoading(true);
        await handleAddDB(value);
        setOpen(false);
        setConfirmLoading(false);
    }, [handleAddDB, value]);


    // 删除数据库
    const [open2, setOpen2] = useState(false);
    const [confirmLoading2, setConfirmLoading2] = useState(false);
    const [willDelete, setWillDelete] = useState('');

    const handleDeleteDB = useCallback(async (dbName: string) => {
        // const { connection } = await dbOperateIns.createDB(dbName);
        const bool = await dbOperateIns.dropDB(dbName);
        if (bool) {
            message.success('数据库实例删除成功！');
            props.history?.push('/' + defaultPathInfo.pathName);
            forceUpdate({});
        } else {
            message.error('数据库实例删除失败！');
        }
    }, [props.history]);

    const showModal2 = useCallback(() => {
        setOpen2(true);
    }, []);
    const handleCancel2 = useCallback(() => {
        setOpen2(false);
    }, []);
    const handleOk2 = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        setConfirmLoading2(true);
        await handleDeleteDB(willDelete);
        setOpen2(false);
        setConfirmLoading2(false);
    }, [handleDeleteDB, willDelete]);



    // 一开始读取浏览器数据库名称，并渲染列表
    useEffect(() => {
        (async () => {
            await dbOperateIns.init();
            const dbNames = await dbOperateIns.getAllDBName();
            const itemChildren: MenuProps['items'] = dbNames
                .map(dbName => {
                    const i: MenuProps['items'] = [
                        {
                            key: '1',
                            label: <div onClick={e => {
                                showModal2();
                                setWillDelete(dbName);  // 将要删除数据库的状态
                                e.stopPropagation();
                            }}>删除</div>
                        }
                    ];
                    const dbItem = (<div className={styles.title}>
                        <span>
                            <MyIcon type='icon-shujuku1' style={{
                                fontSize: '16px'
                            }} />
                            <span>{dbName}</span>
                        </span>
                        <Dropdown menu={{ items: i }}>
                            <div onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}>
                                <Space>
                                    <DownOutlined />
                                </Space>
                            </div>
                        </Dropdown>
                    </div>);
                    return getItem(dbItem, dbName);
                });

            // 标题，数据库实例
            const content = <div className={styles.addText}>
                新增数据库实例
            </div>;
            const title = (<div className={styles.title} style={{
                margin: '8px 4px'
            }}>
                <span>数据库实例</span>
                <Tooltip title={content} placement='right' color='#fff'>
                    <PlusOutlined className={styles.icon} onClick={showModal} />
                </Tooltip>
            </div>);

            setItems([
                getItem(title, 'dbIns', null, itemChildren, 'group'),
            ]);
        })();
    }, [showModal, showModal2, updateObj]);


    const handleMenuItemClick: MenuProps['onClick'] = (e) => {
        const dbName = e.key;
        let path = '/' + defaultPathInfo.pathName;
        path += `/${dbName}`;
        path && props?.history?.push(path);
    };

    // 侧边展开收缩图标控制
    const [isExpand, setIsExpand] = useState(true);
    const handleCollapse = useCallback(() => {
        setIsExpand(false);
    }, []);
    const handleExpand = useCallback(() => {
        setIsExpand(true);
    }, []);

    const { style = {}, className: cn = '' } = props;

    // 根据地址判断哪个数据库实例样式上被选择
    let defaultSelectedKey: string;
    const path = props.location?.pathname;
    if (!path) {
        defaultSelectedKey = '';
    } else {
        defaultSelectedKey = getLastPath(path);
    }

    return (
        <div
            className={`${isExpand ? styles.container : styles.containerCollapse} ${cn}`}
            style={style}>
            <Menu
                onClick={handleMenuItemClick}
                defaultSelectedKeys={[defaultSelectedKey]}
                className={styles.menu}
                mode="vertical"
                items={items}
            />

            <PanelExpand
                className={isExpand ? styles.expand : styles.expandCollapse}
                isExpand={isExpand}
                onCollapse={handleCollapse}
                onExpand={handleExpand}
            />

            {/* 新建数据库实例弹窗 */}
            <Modal
                title="新增数据库实例"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                cancelText='取消'
                okText='创建'
            >
                <Form
                    style={{ margin: '50px 0px' }}
                    name="basic"
                    wrapperCol={{ span: 16 }}
                >
                    <Form.Item
                        label="数据库实例名"
                        name="dbName"
                        rules={[{ required: true, message: '请输入数据库实例名称' }]}
                    >
                        <Input value={value} onChange={(e) => {
                            setValue(e.target.value);
                        }} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 删除数据库确认弹窗 */}
            <Modal
                open={open2}
                onOk={handleOk2}
                confirmLoading={confirmLoading2}
                onCancel={handleCancel2}
                cancelText='取消'
                okText='确定'
            >
                确定要该删除数据库实例吗？
            </Modal>
        </div>
    );
};

export default React.memo(ControlDB);
