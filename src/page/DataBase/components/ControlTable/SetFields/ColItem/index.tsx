import React, { CSSProperties, useCallback, useState } from "react"
import { Checkbox, Input, Select } from "antd"
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ColInfo, FieldType } from "../../../../../../types"
import styles from "../index.module.css";

/**
 * ColItem组件属性约束
 */
interface ColItemProps {
    colInfo: ColInfo
    /**
     * 这是第几列
     */
    order: number
    /**
     * 是否在编辑，false则不显示input框
     */
    isEdit: boolean
    className?: string
    style?: CSSProperties
    /**
     * ColItem组件有元素从focus变成blur调用的函数，传入改变后的信息
     */
    onColBlur?: (changedColInfo: ColInfo) => void
    /**
     * ColItem组件被点击了调用的函数，传入自身是第几列
     */
    onColClick?: (order: number) => void
}
type ColFormEvent = React.FormEvent | CheckboxChangeEvent | string;

/**
 * 
 * @param e 判断事件类型是哪一个
 * @returns 
 */
function isInputEvent(e: ColFormEvent): e is React.FormEvent {
    try {
        const ev = e as React.FormEvent;
        const target = ev.target as HTMLInputElement;
        if ('value' in target) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}
/**
 * 
 * @param e 判断事件类型是哪一个
 * @returns 
 */
function isCheckboxEvent(e: ColFormEvent): e is CheckboxChangeEvent {
    try {
        const ev = e as React.FormEvent;
        const target = ev.target as HTMLInputElement;
        if ('checked' in target && !('value' in target)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}
/**
 * 
 * @param e 判断事件类型是哪一个
 * @returns 
 */
function isSelectEvent(e: ColFormEvent): e is FieldType {
    if (typeof e === 'string') return true;
    return false;
}

/**
 * 每一行对应的组件
 */
const ColItem: React.FC<ColItemProps> = (props) => {
    const { colInfo, order, isEdit, className: cn = '', style = {}, onColBlur, onColClick } = props;

    const [formData, setFormData] = useState<ColInfo>(colInfo);

    // 控制isNull是否禁用，当isPrimary为true时，需要禁用
    const [disabled, setDisabled] = useState<boolean>(colInfo.isPrimary);

    // 表单元素改变，仅改变组件的状态
    const handleChange = useCallback((e: ColFormEvent) => {
        if (isInputEvent(e)) {
            const newColValue = (e.target as HTMLInputElement).value;
            setFormData(prev => ({
                ...prev,
                colName: newColValue
            }));
        } else if (isSelectEvent(e)) {
            const newTypeValue = e;
            setFormData(prev => {
                console.log(prev);
                const newData = {
                    ...prev,
                    type: newTypeValue
                }
                onColBlur && onColBlur(newData);
                return newData;
            });
        } else if (isCheckboxEvent(e)) {
            const newChecked = e.target.checked;
            if (Object.values(e.target).includes('isNull')) {
                setFormData(prev => ({
                    ...prev,
                    isNull: newChecked
                }));
            } else {
                if (newChecked) {
                    setFormData(prev => ({
                        ...prev,
                        isPrimary: newChecked,
                        isNull: false
                    }));
                    setDisabled(true);
                } else {
                    setFormData(prev => ({
                        ...prev,
                        isPrimary: newChecked
                    }));
                    setDisabled(false);
                }
            }
        }
    }, [onColBlur]);

    // 外面点击其他地方，或者组件切换表单元素，更改外部的属性
    const handleBlur = useCallback(() => {
        setFormData(prev => {
            onColBlur && onColBlur(formData);
            return prev;
        });
    }, [formData, onColBlur]);

    // 自身点击后的处理，主要用来切换edit属性
    const handleClick = useCallback(() => {
        onColClick && onColClick(order);
    }, [order, onColClick]);

    // select选项卡的元素
    const options = Object.values(FieldType).map(t => {
        return <Select.Option key={t} value={t} className={styles.fs12}>{t}</Select.Option>;
    });

    return (
        <tr
            onBlur={handleBlur}
            onClick={handleClick}
            className={`${isEdit ? styles.blueBg : ''} ${cn} ${styles.colWrap}`}
            style={style}
        >
            <td>{order}</td>
            <td>
                {
                    isEdit ?
                        <Input
                            value={formData.colName}
                            className={styles.inputCol}
                            onChange={handleChange}
                        />
                        : formData.colName
                }
            </td>
            <td>
                {
                    isEdit ?
                        <Select
                            size='small'
                            value={formData.type}
                            className={styles.select}
                            onChange={handleChange}
                        >
                            {options}
                        </Select>
                        : formData.type
                }

            </td>
            <td><Checkbox onChange={handleChange} disabled={disabled} data-item='isNull' checked={formData.isNull} /></td>
            <td><Checkbox onChange={handleChange} data-item='isPrimary' checked={formData.isPrimary} /></td>
        </tr>
    )
};

export default React.memo(ColItem);
