import React, { useState, useImperativeHandle, CSSProperties } from "react";
import { Table, Menu, Popover } from 'antd';
import { DataFrame } from '@antv/data-wizard';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from "lodash";
import styles from "./index.module.css";
import { DataType, Field, SetType, VisualType } from "../../ManageSet";
import dataRender from "../../../../utils/dataRender";

export type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    popupClassName?: string,
    expandIcon?: React.ReactNode,
    type?: 'group',
): MenuItem {
    if(expandIcon){
        return {
            key,
            icon,
            children,
            label,
            type,
            popupClassName,
            expandIcon,
        } as MenuItem;
    }
    return {
        key,
        icon,
        children,
        label,
        type,
        popupClassName,
    } as MenuItem;
}

interface IProps {
    /**
     * 执行SQL获得的数据
     */
    datas: any[]
    /**
     * 展示多少条数据
     */
    limit: number,
    /**
     * 初始化字段类型信息
     */
    initFields?: Field[],
    /**
     * 字段是否可以修改类型
     */
    canEditType?: boolean
    style?: CSSProperties
}

export interface RefMethods {
    getFieldsMsg: () => Field[]
}

const DatasetTable = (props: IProps, ref: any) => {
    console.log(23333, props.initFields);
    const { style = {}, datas, limit, initFields, canEditType = true } = props;

    // console.log(datas, limit);
    const df = new DataFrame(datas.slice(0, 100));  // 就分析100条数据
    const infos = df.info();  // 数据太奇怪可能会卡死
    // console.log(infos);

    const items: MenuItem[] = [
        getItem(SetType.VisualType, SetType.VisualType, null, Object.keys(VisualType).map(t => getItem((VisualType as any)[t], (VisualType as any)[t])), styles.subMenu),
        getItem(SetType.DataType, SetType.DataType, null, Object.keys(DataType).map(t => getItem((DataType as any)[t], (DataType as any)[t])), styles.subMenu),
    ];
    /**
         * 以后智能推荐优化的地方
         * 
        */
    const initTypes: Field[] = infos.map(info => {
        const reType = info.recommendation;  // 建议类型
        let vT: VisualType;
        let dT: DataType;
        if (initFields) {
            const oldInfo = initFields.find(f => f.fieldName === info.name);
            if (oldInfo) {
                vT = oldInfo.visualType;
                dT = oldInfo.dataType;
            } else {
                if (reType === "float" || reType === "integer") {
                    vT = VisualType.Metric;
                    dT = DataType._Number;
                } else {
                    vT = VisualType.Attribute;
                    if (reType === "boolean") dT = DataType._Boolean;
                    else if (reType === "date") dT = DataType._Date;
                    else if (reType === "string") dT = DataType._String;
                    else dT = DataType._String;
                }
            }
        } else {
            if (reType === "float" || reType === "integer") {
                vT = VisualType.Metric;
                dT = DataType._Number;
            } else {
                vT = VisualType.Attribute;
                if (reType === "boolean") dT = DataType._Boolean;
                else if (reType === "date") dT = DataType._Date;
                else if (reType === "string") dT = DataType._String;
                else dT = DataType._String;
            }
        }

        return {
            fieldName: info.name,
            visualType: vT,
            dataType: dT
        }
    });
    const [types, setTypes] = useState<Field[]>(initTypes);
    /**
     * 这里根据infos，对两种类型进行推断，后来优化点
     * optimisticFunc()
     */

    useImperativeHandle<RefMethods, RefMethods>(ref, () => {
        return {
            /**
             * 外部点保存的时候，获得字段各种类型
             * @returns 字段各种类型数组
             */
            getFieldsMsg(): Field[] {
                return types;
            }
        };
    }, [types]);

    // Table展示的列
    const columns: ColumnsType<any> = infos.map((info, idx) => {
        const fieldName = info.name;

        const handleTypeChange: MenuProps['onClick'] = (e) => {
            const { keyPath: [v, k] } = e;
            setTypes(prev => {
                const newTypes = cloneDeep(prev);
                if (k === SetType.VisualType) {
                    newTypes[idx].visualType = v as VisualType;
                } else {
                    newTypes[idx].dataType = v as DataType;
                }
                return newTypes;
            });
        };

        const titleEle = (<div className={styles.title}>
            <span className={styles.name}>{fieldName}</span>
            {canEditType ? <Popover
                content={<Menu
                    items={items}
                    className={styles.menu}
                    onClick={handleTypeChange}
                    selectedKeys={[types[idx].visualType, types[idx].dataType]}  // 注意顺序
                />}
                overlayInnerStyle={{
                    padding: 0,
                }}
            >
                <RightOutlined style={{ cursor: "pointer" }} />
            </Popover> : null}
        </div >);
        return {
            title: titleEle,
            dataIndex: fieldName,
            render(value, data, idx) {
                return (<div className={styles.itemText}>{dataRender(value)}</div>);
            },
            width: 160
        }
    });

    // 需要展示的数据，Table组件需要key属性
    const renderDatas = datas.slice(0, limit).map(d => {
        if (d.key) return d;
        else return { ...d, key: uuidv4() }
    });

    return (<div style={style} className={styles.table}>
        <Table
            columns={columns}
            dataSource={renderDatas}
            className={styles.table}
            size="small"
            pagination={false}
            scroll={{ y: 200 }}
        />
    </div>);
};

export default DatasetTable;
