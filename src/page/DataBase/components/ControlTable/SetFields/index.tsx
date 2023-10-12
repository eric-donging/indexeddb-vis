import React, { useState, useCallback, useImperativeHandle, CSSProperties } from 'react';
import { Input, Checkbox, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import styles from './index.module.css';
import { ColInfo, FieldType } from '../../../../../types';
import { colInfosFilter, judgeColInfos, reviseColInfos } from '../../../../../utils/dataOperate';
import ColItem from './ColItem';

interface SetFieldsProps {
    // initTableName?: string
    // initColInfos?: ColInfo[]
    className?: string
    style?: CSSProperties
    onUpdateFields?: (newInfos: ColInfo[], newTableName: string) => void
}

export interface RefMethods {
    afterImportFile: (fileColInfos: ColInfo[], fileName: string) => void
}

/**
 * 处理字段列的表格组件
 */
const SetFields = (props: SetFieldsProps, ref: any) => {
    const { className: cn = '', style = {}, onUpdateFields } = props;

    const [colInfosState, setColInfosState] = useState<ColInfo[]>([]);
    const [tableNameState, setTableNameState] = useState<string>('');
    const handleTableNameChange = useCallback((e: any) => {
        setTableNameState(e.target.value);
    }, []);

    useImperativeHandle<RefMethods, RefMethods>(ref, () => {
        return {
            /**
             * 针对重复导入文件列和表名的更新
             */
            afterImportFile(fileColInfos, fileName) {
                setColInfosState(fileColInfos);
                setTableNameState(fileName);
                setIsEditArr(new Array(fileColInfos.length).fill(false));
            }
        };
    }, []);

    const [isEditArr, setIsEditArr] = useState(new Array(colInfosState.length).fill(false));

    const handleColClick = useCallback((order: number) => {
        setIsEditArr(prev => {
            return prev.map((item, idx) => {
                if (idx === order) return true;
                else return false;
            });
        })
    }, []);

    const handleAddCol = useCallback(() => {
        const newColInfo: ColInfo = {
            key: uuidv4(),
            colName: '',
            type: '',
            isNull: false,
            isPrimary: false,
        }
        setColInfosState(prev => [...prev, newColInfo]);
        setIsEditArr(prev => {
            const newArr = new Array(prev.length).fill(false);
            newArr.push(true);
            return newArr;
        })
    }, []);

    const handleColDelete = useCallback(() => {
        let index = -1;
        setIsEditArr(prev => {
            const idx = prev.indexOf(true);
            if (idx === -1) {
                return prev;
            } else {
                index = idx;
                return prev.slice(0, idx).concat(prev.slice(idx + 1));
            }
        });
        setColInfosState(prev => {
            console.log(index);
            return prev.filter((item, idx) => {
                if (idx === index) return false;
                return true;
            });
        })
    }, []);


    // 渲染每一个字段
    const trs = colInfosState.map((colInfo, idx) => {
        return <ColItem
            className={idx % 2 !== 0 ? styles.greyBg2 : ''}
            colInfo={colInfo}
            order={idx}
            isEdit={isEditArr[idx]}
            key={colInfo.key}
            onColBlur={(newColInfo) => {
                setColInfosState(prev => {
                    return prev.map((c, i) => {
                        if (i !== idx) return c;
                        return newColInfo;
                    });
                })
            }}
            onColClick={handleColClick}
        // onSelectChange={handleSelectChange}
        />
    });

    // 删除按钮是否禁止
    const deleteDisabled = isEditArr.every(i => i === false);

    // 关于扩展属性
    const selectIdx = isEditArr.indexOf(true);
    const isDefaultShow = isEditArr.includes(true) && colInfosState[selectIdx].type !== '';
    const isAutoIncreaseShow = isEditArr.includes(true) && colInfosState[selectIdx].type === FieldType.number;
    const handleDefaultChange = useCallback((e: any) => {
        setColInfosState(prev => {
            const newInfo = { ...prev[selectIdx], default: e.target.value };
            const newInfos = [...prev];
            newInfos[selectIdx] = newInfo;
            return newInfos;
        });
    }, [selectIdx]);
    const handleAutoChange = useCallback((e: any) => {
        setColInfosState(prev => {
            const newInfo = { ...prev[selectIdx], autoIncrement: e.target.checked };
            const newInfos = [...prev];
            newInfos[selectIdx] = newInfo;
            return newInfos;
        });
    }, [selectIdx]);

    // 保存按钮事件
    const handleSaveBtnClick = useCallback(() => {
        setTableNameState(prev => {
            if (!prev) {
                message.error('表名不能为空');
            } else {
                setColInfosState(prev2 => {
                    // 过滤掉空info
                    const filterInfos = colInfosFilter(prev2);
                    // 进行必填、是否重复判断
                    const res: boolean = judgeColInfos(filterInfos);
                    // default属性值要转为对应的type类型
                    const reviseInfos = reviseColInfos(filterInfos);
                    if (res) {
                        console.log(prev, '这是表名');
                        onUpdateFields && onUpdateFields(reviseInfos, prev);
                    }
                    return prev2;
                })
            }
            return prev;
        })
    }, [onUpdateFields]);

    return (
        <div className={`${styles.wrap} ${cn}`} style={style}>
            <label className={`${styles.fs12}`} style={{ marginBottom: '20px', display: 'block' }}>
                <span className={styles.red}>*</span>
                表名：<Input className={styles.input} value={tableNameState} onChange={handleTableNameChange} />
            </label>
            <div className={styles.btnWrap}>
                <Button size='small' type='primary' className={styles.btn} onClick={handleAddCol}>
                    <PlusOutlined />
                    <span style={{ margin: 0 }}>新增</span>
                </Button>
                <Button size='small' onClick={handleColDelete} disabled={deleteDisabled}>删除</Button>
            </div>

            <header className={`${styles.header} ${styles.greyBg}`}>
                <div>序号</div>
                <div><span className={styles.red}>*</span>列名</div>
                <div><span className={styles.red}>*</span>类型</div>
                <div>可空</div>
                <div>主键</div>
            </header>

            <table className={styles.tab}>
                <tbody>
                    {trs}
                </tbody>
            </table>


            <div className={styles.expandAttr}>
                <p>扩展属性</p>
                {isDefaultShow ?
                    <div>
                        <label>默认值：<Input
                            value={colInfosState[selectIdx].default}
                            onChange={handleDefaultChange}
                            className={styles.input}
                        /></label>
                    </div>
                    : null}
                {isAutoIncreaseShow ?
                    <div>
                        <label>自动增长：<Checkbox
                            className={styles.checkbox}
                            checked={colInfosState[selectIdx].autoIncrement}
                            onChange={handleAutoChange}
                        /></label>
                    </div> :
                    null}
            </div>

            <div className={styles.saveBtn}>
                <Button onClick={handleSaveBtnClick} type='primary' size='middle'>保存变更</Button>
            </div>
        </div>
    );
}

export default SetFields;
