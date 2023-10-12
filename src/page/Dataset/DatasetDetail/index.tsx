import React, { useState, useCallback, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { LeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, message, Select } from 'antd';
import qs from "query-string";
import styles from "./index.module.css";
import cn from "classnames";
import { DatasetInfo, DatasetInfoList, Field } from "../ManageSet";
import dbOperateIns from "../../../utils/dbOperate";
import DatasetTable from "./DatasetTable";
import { addDatasetInfo, getDatasetInfoById } from "../../../utils/datasetStorage";
import { PathNames } from "../../../configs/routerConfig";

interface IProps extends RouteComponentProps {
}

interface ButtonValues extends Partial<DatasetInfoList> {
    /**
     * 展示数据条数限制（并非查询限制）
     */
    limit?: number
}

const DatasetTableWrapper = React.forwardRef(DatasetTable);

let whichBtn = 0;  // 组件两个按钮，当前点击的是哪个

const DatasetDetail: React.FC<IProps> = (props) => {
    const [canSave, setCanSave] = useState(false);

    const [initFields, setInitFields] = useState<Field[] | undefined>(undefined);

    const id: string = qs.parse(props.location.search).id as string;
    const initInfo = getDatasetInfoById(id);
    console.log(id, initInfo);
    let _initInfo: ButtonValues;
    if (initInfo) {
        _initInfo = { ...initInfo, limit: 100 };  // 必有id
    } else {
        // 新建，添加id字段
        _initInfo = { id: id, limit: 100, description: '', sql: 'SELECT * FROM ' }
        // _initInfo = { id: id, limit: 100, description: '', sql: 'SELECT * FROM S', name: 'sss', dbName: 'ceshi' }
    }

    // 如果本地化存储有
    useEffect(() => {
        console.log('effect');
        if (initInfo) {
            setInitFields(initInfo.fields);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    console.log('render');

    const [dbNames, setDbNames] = useState<string[]>([]);
    useEffect(() => {
        dbOperateIns.getAllDBName().then(res => {
            setDbNames(res);
        });
    }, []);

    /**
     * 展示数据集对应的数据
     */
    const [showData, setShowData] = useState<any[]>([]);
    const [limit, setLimit] = useState(100);

    const [isShowTable, setIsShowTable] = useState(false);  // 是否展示数据集表

    const tableRef = useRef();

    const onFinish = useCallback(async (values: ButtonValues) => {
        const transSQL = values.sql!.replaceAll(/\s/g, ' ').replace(';', '');
        if (whichBtn === 0) {
            // 点击执行，执行sql语句，查询
            await dbOperateIns.init();
            const { error, data } = await dbOperateIns.executeSQL(values.dbName!, transSQL);
            // 渲染的结果对应的数据，字段
            if (error) {
                message.error(error);
                setShowData([]);
                return;
            }

            setShowData(data);
            setLimit(values.limit!);
            setCanSave(true);
            setIsShowTable(true);
        } else {
            // 点击保存本地化存储
            // 信息里必定有id字段
            console.log(values);
            const saveSetInfo: DatasetInfo = {
                key: _initInfo.id!,
                name: values.name!,
                id: _initInfo.id!,
                dbName: values.dbName!,
                description: values.description!,
                updateTime: new Date().toLocaleString(),
                sql: values.sql!,
                fields: (tableRef.current as any).getFieldsMsg(),
            }
            console.log(saveSetInfo);
            addDatasetInfo(saveSetInfo);  // 包含了存在相同id则更新的功能
        }
    }, [_initInfo.id]);

    const onFinishFailed = useCallback((errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }, []);

    const handleValueChange = useCallback(() => {
        setCanSave(false);
    }, []);

    const getDBList = useCallback(() => {
        return dbNames.map(name => (
            <Select.Option value={name} key={name} className={cn(styles.fs12)}>{name}</Select.Option>
        ));
    }, [dbNames]);

    return (
        <div className={cn(styles.container)}>
            <header>
                <span onClick={() => {
                    props.history.push('/' + PathNames.dataset)
                }}>
                    <LeftOutlined />
                </span>
                新建数据集
            </header>

            <Form
                name="basic"
                size="small"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 12, offset: 1 }}
                className={styles.content}
                initialValues={_initInfo}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                onValuesChange={handleValueChange}
                autoComplete="off"
            >
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '数据集名称必填' }]}
                >
                    <Input size="middle" />
                </Form.Item>

                <Form.Item
                    label="描述"
                    name="description"
                >
                    <Input.TextArea
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        size="middle"
                        className={cn(styles.ptb4)}
                    />
                </Form.Item>

                <Form.Item
                    label="数据库"
                    name="dbName"
                    rules={[{ required: true, message: '数据库必选' }]}
                >
                    <Select className={cn(styles.selectWrap)} size="middle">
                        {getDBList()}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="SQL"
                    name="sql"
                >
                    <Input.TextArea
                        autoSize={{ minRows: 18, maxRows: 18 }}
                        size="middle"
                        className={cn(styles.fs13, styles.ptb4)}
                    />
                </Form.Item>

                <footer>
                    <div className={styles.item1}>
                        展示前
                        <Form.Item name="limit" wrapperCol={{ span: 16 }} className={cn(styles.number)}>
                            <InputNumber min={1} size="middle" />
                        </Form.Item>
                        条数据
                    </div>
                    <div className={styles.item2}>
                        <Form.Item wrapperCol={{ span: 16 }} className={cn(styles.mb0)}>
                            <Button type="primary" htmlType="submit" size="middle" onClick={() => {
                                whichBtn = 0;
                            }}>
                                执行
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 16 }} className={cn(styles.mb0, styles.ml30)}>
                            <Button
                                type="primary" htmlType="submit" size="middle"
                                disabled={!canSave}
                                onClick={() => {
                                    whichBtn = 1;
                                }}
                            >
                                保存
                            </Button>
                        </Form.Item>
                    </div>
                </footer>
            </Form>

            {isShowTable ? <DatasetTableWrapper
                datas={showData}
                limit={limit}
                style={{ position: 'absolute', bottom: 64, left: 0 }}
                initFields={initFields}
                ref={tableRef}
            /> : null}
        </div>
    );
};

export default React.memo(DatasetDetail);

