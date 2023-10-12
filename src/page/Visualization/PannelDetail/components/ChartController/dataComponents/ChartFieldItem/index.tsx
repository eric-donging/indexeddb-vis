import React, { useRef } from "react";
import { useDrag } from 'react-dnd';
import { Menu, Popover } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import cn from "classnames";
import styles from "./index.module.css";
import mStyles from "../../../../../../Dataset/DatasetDetail/DatasetTable/index.module.css";
import { getItem, MenuItem } from "../../../../../../Dataset/DatasetDetail/DatasetTable";
import { FieldInAttribute, FieldInMetric, FieldInGroup, FieldInWrap, FieldWrapType } from "../../types";
import { DragItemTypes } from "../../../../../../../types";

export enum AttributeSortWay {
    Default = "默认",
    Asc = "升序",
    Desc = "降序",
    Custom = "自定义",
}

export enum MetricSortWay {
    Default = "默认",
    Asc = "升序",
    Desc = "降序",
}

/**
 * 聚合方式
 */
export enum AggregateWay {
    Sum = "总计",
    Avg = "平均数",
    Count = "计数",
    DistinctCount = "去重计数",
    Max = "最大值",
    Min = "最小值",
}

interface IProps {
    belong: FieldWrapType,
    fieldMsg: FieldInWrap,
    index: number,
    /**
     * 删除此字段
     * @returns 
     */
    onDelete?: (index: number) => void

    /**
     * 修改字段
     */
    onEdit?: (index: number, adjustObj: object) => void
}

const ChartFieldItem: React.FC<IProps> = (props) => {
    const { belong, fieldMsg, index, onDelete, onEdit } = props;

    const ref = useRef<HTMLDivElement>(null);

    const [, dragRef] = useDrag(
        () => ({
            type: DragItemTypes.ChartField,
            item: {
                belong,
            },
            end(item, monitor) {
                // 没有drop到可以drop的区域，说明删除该字段
                if (!monitor.didDrop()) {
                    onDelete && onDelete(index);
                }
            },
            // collect: (monitor: any) => ({

            // }),
        }),
        [belong, index, onDelete]
    );
    dragRef(ref);

    const items: MenuItem[] = getItemsByBelong(belong);
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.keyPath.length === 2) {
            const [v, k] = e.keyPath;
            let adjustObj: object = {};
            if (belong === FieldWrapType.Attribute) {
                adjustObj = {
                    sortWay: v as AttributeSortWay
                };
            } else if (belong === FieldWrapType.Metric) {
                if (k === 'sort') {
                    adjustObj = {
                        sortWay: v as MetricSortWay
                    }
                } else {
                    adjustObj = {
                        aggregateWay: v as AggregateWay
                    }
                }
            } else if (belong === FieldWrapType.Group) {
                adjustObj = {
                    sortWay: v as AttributeSortWay
                };
            }
            onEdit && onEdit(index, adjustObj);
        }
        else if (e.keyPath[0] === 'delete') {
            onDelete && onDelete(index);
        }
    };

    const text = belong === FieldWrapType.Metric ? `[${getSelectedKeys(belong, fieldMsg)[0]}] ${fieldMsg.field.fieldName}` : fieldMsg.field.fieldName;

    return (
        <div ref={ref} className={cn(styles.container, getBackGroundClass(belong))}>
            <span className={styles.txt}>{text}</span>
            <Popover
                placement="right"
                trigger="click"
                content={
                    <Menu
                        items={items}
                        className={cn(mStyles.menu, styles.menu)}
                        onSelect={handleMenuClick}
                        selectedKeys={getSelectedKeys(belong, fieldMsg)}
                    />
                }
                overlayInnerStyle={{
                    padding: 0,
                }}
            >
                <DownOutlined className={styles.icon} />
            </Popover>
        </div>
    );
};

function getBackGroundClass(belong: FieldWrapType) {
    switch (belong) {
        case FieldWrapType.Attribute:
        case FieldWrapType.Group:
            return styles.blueColor;
        case FieldWrapType.Metric:
            return styles.greenColor;
    }
}

/**
 * 传入字段属于哪一个FieldsWrapper，返回对应操作Menu所需items
 * @param belong 
 * @returns 
 */
function getItemsByBelong(belong: FieldWrapType): MenuItem[] {
    let items: MenuItem[] = [];

    if (belong === FieldWrapType.Attribute) {
        items = [
            getItem('字段设置', 'fieldSet', null, undefined, mStyles.subMenu),
            getItem('排序', 'sort', null, Object.keys(AttributeSortWay).map(w => getItem((AttributeSortWay as any)[w], (AttributeSortWay as any)[w])), mStyles.subMenu),
            getItem('删除', 'delete', null, undefined, mStyles.subMenu),
        ];
    } else if (belong === FieldWrapType.Metric) {
        items = [
            getItem('字段设置', 'fieldSet', null, undefined, mStyles.subMenu),
            getItem('格式设置', 'formatSet', null, undefined, mStyles.subMenu),
            getItem('聚合方式', 'aggregate', null, Object.keys(AggregateWay).map(w => getItem((AggregateWay as any)[w], (AggregateWay as any)[w])), mStyles.subMenu),
            getItem('排序', 'sort', null, Object.keys(MetricSortWay).map(w => getItem((MetricSortWay as any)[w], (MetricSortWay as any)[w])), mStyles.subMenu),
            getItem('删除', 'delete', null, undefined, mStyles.subMenu),
        ];
    } else if (belong === FieldWrapType.Group) {
        items = [
            getItem('字段设置', 'fieldSet', null, undefined, mStyles.subMenu),
            getItem('排序', 'sort', null, Object.keys(AttributeSortWay).map(w => getItem((AttributeSortWay as any)[w], (AttributeSortWay as any)[w])), mStyles.subMenu),
            getItem('删除', 'delete', null, undefined, mStyles.subMenu),
        ];
    }
    return items;
}

/**
 * 获得Menu中选择的一项key
 * @param belong 
 * @param fieldMsg 
 * @returns 
 */
function getSelectedKeys(belong: FieldWrapType, fieldMsg: FieldInWrap) {
    const res: string[] = [];

    if (belong === FieldWrapType.Attribute) {
        res.push((fieldMsg as FieldInAttribute).sortWay);
    } else if (belong === FieldWrapType.Metric) {
        res.push((fieldMsg as FieldInMetric).aggregateWay);
        res.push((fieldMsg as FieldInMetric).sortWay);
    } else if (belong === FieldWrapType.Group) {
        res.push((fieldMsg as FieldInGroup).sortWay);
    }
    return res;
}


export default React.memo(ChartFieldItem);
