import React, { useCallback } from "react";
import { useDrag } from 'react-dnd';
import { Menu, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from "../index.module.css";
import myStyles from "./index.module.css";

/**
 * 本文件里要使用数据集表里面的类型设置样式、以及元素生成的方法类型，暂时这么引入，最好把相同的地方封装组件
 */
import styles2 from "../../../../../Dataset/DatasetDetail/DatasetTable/index.module.css";
import { DataType, Field, SetType, VisualType } from "../../../../../Dataset/ManageSet";
import { MenuItem, getItem } from "../../../../../Dataset/DatasetDetail/DatasetTable";
import { DragItemTypes } from "../../../../../../types";
import { MyClassIcon } from "../../../../../../components/MyIcon";

export interface DragFieldMsg {
    field: Field
    datasetId: string
}

interface IProps {
    type: VisualType.Attribute | VisualType.Metric | "allSelect",
    field: Field,
    datasetId: string,
    boxStat?: boolean,
    handleChangeBox?: (newStat: boolean) => void
    handleTypeChange: MenuProps['onClick']
}

const SetFieldItem: React.FC<IProps> = (props) => {
    const { boxStat = false, handleChangeBox } = props;

    const items: MenuItem[] = [
        getItem(SetType.VisualType, SetType.VisualType, null, Object.keys(VisualType).map(t => getItem((VisualType as any)[t], (VisualType as any)[t])), styles2.subMenu),
        getItem(SetType.DataType, SetType.DataType, null, Object.keys(DataType).map(t => getItem((DataType as any)[t], (DataType as any)[t])), styles2.subMenu),
    ];

    const [, dragRef] = useDrag(
        () => ({
            type: DragItemTypes.SetField,
            item: {
                field: props.field,
                datasetId: props.datasetId,
            } as DragFieldMsg
        }),
        []
    );

    const handleChange = useCallback((e: React.FormEvent) => {
        const bool: boolean = (e.target as HTMLInputElement).checked;
        handleChangeBox && handleChangeBox(bool);
    }, [handleChangeBox]);

    /**
     * true表示现在是列举所有字段，出现在推荐图表弹窗内
     */
    const isAllSelect = props.type === "allSelect";

    return (
        <li ref={isAllSelect ? null : dragRef}>
            <span>
                {isAllSelect ?
                    <input type="checkbox" className={myStyles.check}
                        checked={boxStat}
                        onChange={handleChange}
                    />
                    : null}
                {fieldTypeToIcon(props.field.visualType, props.field.dataType)}
                {props.field.fieldName}
            </span>
            <Popover
                className={styles.isShow}
                placement="right"
                content={
                    <Menu
                        items={items}
                        className={styles2.menu}
                        onClick={props.handleTypeChange}
                        selectedKeys={[props.field.visualType, props.field.dataType]}  // 注意顺序
                    />
                }
                overlayInnerStyle={{
                    padding: 0,
                }}
            >
                <DownOutlined style={{ cursor: "pointer", color: "#fff" }} />
            </Popover>
        </li >
    );
};

export function fieldTypeToIcon(visualType: VisualType, dataType: DataType): React.ReactNode {
    let res: React.ReactNode = null;
    if (visualType === VisualType.Attribute) {
        res = <MyClassIcon type="icon-weidu" className={myStyles.blue} />
    } else {
        res = <MyClassIcon type="icon-duliang" className={myStyles.green} />
    }
    return res;
}

export default SetFieldItem;
