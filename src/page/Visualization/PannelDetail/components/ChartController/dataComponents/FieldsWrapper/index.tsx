import React, { useCallback, useState } from "react";
import { useDrop } from 'react-dnd';
import cn from "classnames";
import { DragItemTypes } from "../../../../../../../types";
import { VisualType } from "../../../../../../Dataset/ManageSet";
import { DragFieldMsg } from "../../../DatasetController/SetFieldItem";
import ChartFieldItem, { AggregateWay, AttributeSortWay, MetricSortWay } from "../ChartFieldItem";
import { FieldInAttribute, FieldInGroup, FieldInMetric, FieldInWrap, FieldWrapType } from "../../types";
import styles from "./index.module.css";

interface IProps {
    title: string,
    /**
     * 最多几个字段，-1表示不限制
     */
    limit: number,
    /**
     * 允许拖拽进来的字段类型
     */
    allow: 'all' | VisualType.Attribute | VisualType.Metric,
    /**
     * 本组件属于哪种类型
     */
    type: FieldWrapType,
    /**
     * 字段信息
     */
    fields: FieldInWrap[],

    onAddField?: (newField: FieldInWrap) => void,  // 现在关于参数传递的类型成了问题

    onDeleteField?: (fieldName: string) => void

    onEditField?: (fieldName: string, adjustObj: object) => void
}


// function is


const FieldsWrapper: React.FC<IProps> = (props) => {
    const { title, limit, allow, type, fields, onAddField, onDeleteField, onEditField } = props;

    const [forbidTip, setForbidTip] = useState<string | undefined>(undefined);

    const [{ isOver, canDrop }, dropRef] = useDrop<DragFieldMsg, any, any>(() => ({
        accept: [DragItemTypes.SetField, DragItemTypes.ChartField],
        drop(item, monitor) {
            const itemType = monitor.getItemType();
            if (itemType === DragItemTypes.SetField) {
                // 共有的对象属性
                const commonObj = {
                    field: item.field,
                    datasetId: item.datasetId,
                    fieldSet: {
                        alias: '',
                        description: ''
                    },
                }
                if (type === FieldWrapType.Attribute) {
                    onAddField && onAddField({
                        ...commonObj,
                        sortWay: AttributeSortWay.Default
                    } as FieldInAttribute);
                } else if (type === FieldWrapType.Metric) {
                    onAddField && onAddField({
                        ...commonObj,
                        aggregateWay: AggregateWay.Sum,
                        sortWay: MetricSortWay.Default
                    } as FieldInMetric);
                } else if (type === FieldWrapType.Group) {
                    onAddField && onAddField({
                        ...commonObj,
                        sortWay: AttributeSortWay.Default
                    } as FieldInGroup);
                }
            }
            else {

            }
        },
        // hover() {
        //     console.log(111);
        // },
        canDrop(item, monitor) {
            const itemType = monitor.getItemType();
            if (itemType === DragItemTypes.SetField) {
                if (fields.some(f => f.field.fieldName === item.field.fieldName)) {
                    setForbidTip("已存在相同的字段");
                    return false;
                }
                if (limit !== -1 && fields.length === limit) {
                    setForbidTip("已经超过最大字段数");
                    return false;
                }
                if (allow !== "all" && item.field.visualType !== allow) {
                    setForbidTip(`${title}字段只允许${allow}字段`);
                    return false;
                }
                return true;
            }
            return true;
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.isOver() ? !!monitor.canDrop() : true,  // 避免一开始没hover，默认false值
        }),
    }), [props]);

    const handleDelete = useCallback((index: number) => {
        onDeleteField && onDeleteField(fields[index].field.fieldName);
    }, [fields, onDeleteField]);

    const handleEidt = useCallback((index: number, adjustObj: object) => {
        onEditField && onEditField(fields[index].field.fieldName, adjustObj);
    }, [fields, onEditField]);



    const itemList = fields.map((field, idx) =>
        <ChartFieldItem
            key={`${title}-${field.field.fieldName}`} index={idx}
            belong={type} fieldMsg={field}
            onDelete={handleDelete}
            onEdit={handleEidt}
        />
    );

    return (<div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <div ref={dropRef} className={cn(styles.content,
            isOver ? styles.itemOver : '',
            canDrop ? '' : styles.itemForbid
        )} >
            {fields.length === 0 ? <>
                <div className={styles.tip}>将字段拖到此处</div>
                {canDrop ? null : <div className={styles.tip}>{forbidTip}</div>}
            </>
                :
                <div>
                    {itemList}
                    {canDrop ? null : <div className={styles.tip}>{forbidTip}</div>}
                </div>
            }
        </div>
    </div>);
};

export default React.memo(FieldsWrapper);
