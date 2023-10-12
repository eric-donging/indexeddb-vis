import React, { useState, CSSProperties, useCallback } from "react";
import { Button, Modal, Space, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { RouteComponentProps } from "react-router-dom";
import cn from "classnames";
import { v4 as uuidv4 } from 'uuid';
import styles from "./index.module.css";
import { PathNames } from "../../../configs/routerConfig";
import { FieldType } from "../../../types";
import { deleteDatesetInfoById, getDatasetInfos } from "../../../utils/datasetStorage";

export enum SetType {
    VisualType = "可视化类型",
    DataType = "数据类型"
}

export enum VisualType {
    /**
     * 维度
     */
    Attribute = "维度",
    /**
     * 度量
     */
    Metric = "度量"
}

export enum DataType {
    _Number = "数字",
    _String = "字符串",
    _Boolean = "布尔",
    _Date = "日期",
    _Province = "省份",
    _City = "城市"
}

export interface Field {
    // 字段名
    fieldName: string,
    sqlType?: FieldType,  // 字符串执行SQL，手动判断表，然后获得SQLtype，先不做
    visualType: VisualType,
    dataType: DataType
}

/**
 * 数据集信息
 */
export interface DatasetInfo {
    key: string
    /**
     * 数据集名
     */
    name: string
    id: string
    /**
     * 使用数据库名
     */
    dbName: string
    description: string
    updateTime: string
    sql: string
    fields: Field[]
}

export type DatasetInfoList = {
    [prop in Exclude<keyof DatasetInfo, "fields">]: DatasetInfo[prop]
};

interface IPorps extends RouteComponentProps {
    style?: CSSProperties
    className?: string
}

const ManageSet: React.FC<IPorps> = (props) => {
    const { style = {}, className: superCn = '' } = props;

    const [delItem, setDelItem] = useState<string | undefined>(undefined);

    const columns: ColumnsType<DatasetInfoList> = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            className: cn(styles.calcWidth2, styles.tableItem)
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: cn(styles.calcWidth1, styles.tableItem)
        },
        {
            title: '数据库',
            dataIndex: 'dbName',
            key: 'dbName',
            className: cn(styles.calcWidth2, styles.tableItem)
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            className: cn(styles.calcWidth3, styles.tableItem)
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            className: cn(styles.calcWidth1, styles.tableItem)
        },
        {
            title: '操作',
            key: 'action',
            className: cn(styles.width4, styles.tableItem),
            render: (record: DatasetInfo) => {
                return (
                    <Space size="middle">
                        <span
                            className={cn(styles.fn12, styles.operate)}
                            onClick={() => {
                                props.history.push(`/dataset/detail?id=${record.id}`);
                            }}
                        >更新</span>
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
    ];

    const datas = getDatasetInfos();

    const handleAddSet = useCallback(() => {
        props.history.push(`${PathNames.datasetDetail}?id=${uuidv4()}`);
    }, [props.history]);

    // 关于删除数据集的弹窗
    const [open, setOpen] = useState(false);
    const handleOk = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        setDelItem(prev => {
            if (prev) {
                deleteDatesetInfoById(prev);
            }
            setOpen(false);
            return prev;
        });
    }, []);
    const handleCancel = useCallback(() => {
        setOpen(false);
    }, []);

    return (<>
        <div style={style} className={cn(styles.container, superCn)} >
            <Button
                type="primary"
                className={styles.fn12}
                onClick={handleAddSet}
            >
                <PlusOutlined />
                新建数据集
            </Button>
            <Table
                columns={columns}
                dataSource={datas}
                className={styles.table}
                size="small"
            />
        </div>

        {/* 删除数据集确认弹窗 */}
        <Modal
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText='取消'
            okText='确定'
        >
            确定要该删数据集吗？
        </Modal>
    </>);
};

export default React.memo(ManageSet);