import React, { CSSProperties, useState, useCallback, useRef } from "react";
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { RouteComponentProps } from "react-router-dom";
import cn from "classnames";
import { v4 as uuidv4 } from 'uuid';
import styles from "./index.module.css";
import { addPannelInfo, deletePannelInfoById, getPannelInfos } from "../../../utils/pannelStorage";
import { getNowTimeString } from "../../../utils/getRandomString";

/**
 * 仪表盘信息
 */
export interface PannelInfo {
    key: string
    name: string
    id: string
    description: string
}

interface IPorps extends RouteComponentProps {
    style?: CSSProperties
    className?: string
}

const ManagePannel: React.FC<IPorps> = (props) => {
    const { style = {}, className: superCn = '' } = props;

    const [, setDelItem] = useState<string | undefined>(undefined);

    const columns: ColumnsType<PannelInfo> = [
        {
            title: '门户名称',
            dataIndex: 'name',
            key: 'name',
            className: cn(styles.calcWidth2, styles.tableItem),
            render: (name, record) => {
                return (
                    <span
                        className={styles.pannelName}
                        onClick={() => {
                            props.history.push(`/visual/detail?id=${record.id}`);
                        }}
                    >{name}</span>
                );
            },
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: cn(styles.calcWidth1, styles.tableItem)
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            className: cn(styles.calcWidth3, styles.tableItem)
        },
        {
            title: '操作',
            key: 'action',
            className: cn(styles.width4, styles.tableItem),
            render: (record: PannelInfo) => {
                return (
                    <Space size="middle">
                        <span
                            className={cn(styles.fn12, styles.operate)}
                            onClick={() => {
                                console.log(record.id);
                                infoRef2.current = record;
                                setOpen3(true);
                            }}
                        >设置</span>
                        <span
                            className={cn(styles.fn12, styles.operate)}
                            onClick={() => {
                                setDelItem(record.id);
                                setOpen(true);
                            }}
                        >删除</span>
                        <span className={cn(styles.fn12, styles.operate)}>导出</span>
                    </Space>
                )
            },
        },
    ]

    const datas: PannelInfo[] = getPannelInfos();

    // 关于删除仪表盘的弹窗
    const [open, setOpen] = useState(false);
    const handleOk = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        setDelItem(prev => {
            if (prev) {
                deletePannelInfoById(prev);
            }
            setOpen(false);
            return prev;
        });
    }, []);
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);

    // 新建仪表盘的弹窗
    const infoRef = useRef<PannelInfo>();
    const [open2, setOpen2] = useState(false);
    const handleOk2 = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        if (!infoRef.current?.name) {
            return;
        }
        addPannelInfo(infoRef.current);
        setOpen2(false);
    }, []);
    const handleCancel2 = useCallback(() => {
        setOpen2(false);
    }, []);
    const showModal2 = useCallback(() => {
        const id = uuidv4();
        infoRef.current = {
            id: id,
            key: id,
            name: getNowTimeString('未命名仪表盘集合_'),
            description: '',
        };
        console.log(infoRef);
        setOpen2(true);
    }, []);

    // 修改仪表盘的弹窗
    const infoRef2 = useRef<PannelInfo>();
    const [open3, setOpen3] = useState(false);
    const handleOk3 = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        if (!infoRef2.current?.name) {
            return;
        }
        addPannelInfo(infoRef2.current);
        setOpen3(false);
    }, []);
    const handleCancel3 = useCallback(() => {
        setOpen3(false);
    }, []);

    return (<>
        <div style={style} className={cn(styles.container, superCn)} >
            <Button
                type="primary"
                className={styles.fn12}
                onClick={showModal2}
            >
                <PlusOutlined />
                新建仪表盘
            </Button>
            <Table
                columns={columns}
                dataSource={datas}
                className={styles.table}
                size="small"
            />
        </div>

        {/* 删除仪表盘确认弹窗 */}
        <Modal
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText='取消'
            okText='确定'
        >
            确定要该删除仪表盘吗？
        </Modal>

        {/* 新建仪表盘弹窗 */}
        <Modal
            title="新增仪表盘"
            open={open2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            cancelText='取消'
            okText='确定'
            destroyOnClose={true}
            width={700}
        >
            <Form
                style={{ margin: '50px 0px' }}
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16, offset: 1 }}
                initialValues={infoRef.current}
                labelAlign="right"
            >
                <Form.Item
                    label="仪表盘集合名称"
                    name="name"
                    rules={[{ required: true, message: '请输入仪表盘名称' }]}
                >
                    <Input value={infoRef.current?.name} onChange={(e) => {
                        infoRef.current = {
                            ...infoRef.current,
                            name: e.target.value
                        } as PannelInfo;
                    }} />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                >
                    <Input.TextArea
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        value={infoRef.current?.description}
                        onChange={(e) => {
                            infoRef.current = {
                                ...infoRef.current,
                                description: e.target.value
                            } as PannelInfo;
                        }} />
                </Form.Item>
            </Form>
        </Modal>

        {/* 修改仪表盘弹窗 */}
        <Modal
            title="设置"
            open={open3}
            onOk={handleOk3}
            onCancel={handleCancel3}
            cancelText='取消'
            okText='确定'
            destroyOnClose={true}
            width={700}
        >
            <Form
                style={{ margin: '50px 0px' }}
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16, offset: 1 }}
                initialValues={infoRef2.current}
                labelAlign="right"
            >
                <Form.Item
                    label="仪表盘集合名称"
                    name="name"
                    rules={[{ required: true, message: '请输入仪表盘名称' }]}
                >
                    <Input value={infoRef2.current?.name} onChange={(e) => {
                        infoRef2.current = {
                            ...infoRef2.current,
                            name: e.target.value
                        } as PannelInfo;
                    }} />
                </Form.Item>
                <Form.Item
                    label="描述"
                    name="description"
                >
                    <Input.TextArea
                        autoSize={{ minRows: 4, maxRows: 4 }}
                        value={infoRef2.current?.description}
                        onChange={(e) => {
                            infoRef2.current = {
                                ...infoRef2.current,
                                description: e.target.value
                            } as PannelInfo;
                        }} />
                </Form.Item>
            </Form>
        </Modal>
    </>);
};

export default React.memo(ManagePannel);