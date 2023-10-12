import React, { useState, useCallback, useRef, CSSProperties } from 'react';
import { message } from 'antd';
import { ITable } from 'jsstore';
import UploadFile from '../../../../../components/UploadFile';
import SetFields, { RefMethods } from '../SetFields';
import { ColInfo, MyRouteComponentProps } from '../../../../../types';
import dbOperateIns from '../../../../../utils/dbOperate';
import { colInfosToTColumns, datasToColInfos, dataTransform } from '../../../../../utils/dataOperate';
import { getLastPath } from '../../../../../utils/pathOperate';

import styles from './index.module.css';
import { getTableNames } from '../../../../../utils/dbLocalStorage';

interface IProps extends MyRouteComponentProps {
    /**
     * 是否使用文件导入的形式
     */
    isApplyFile?: boolean,
    /**
     * 是否是重新编辑修改，默认false
     */
    isEdit?: boolean,
    style?: CSSProperties,
    className?: string
}

const SetFieldsWrapper = React.forwardRef(SetFields);  // 写外面不行，不知道为什么

/**
 * 定义表名、列结构、保存数据的组件
 */
const ConfigTable: React.FC<IProps> = (props) => {
    const { isEdit = false, className: cn = '', style = {}, isApplyFile = true } = props;

    // 为了在文件导入时使用SetFields里面的方法
    const fileRef = useRef<RefMethods>();
    // 文件导入的SetFields组件什么时候显示
    const [isShow, setIsShow] = useState(false);
    // 数据，如果是文件导入，数组不为空
    const [datas, setDatas] = useState<object[]>([]);
    // 文件上传成功的回调
    const handleUploadSuccess = useCallback((datas: object[], fileName: string) => {
        const idx = fileName.indexOf('.');
        if (idx > 0) fileName = fileName.slice(0, idx);
        const fileInfos = datasToColInfos(datas);
        fileRef.current!.afterImportFile(fileInfos, fileName);
        setDatas(datas);
        setIsShow(true);
    }, []);

    // 点击保存变更时接下来的操作
    const handleUpdateFields = useCallback(async (infos: ColInfo[], tableName: string) => {
        const path = props.location?.pathname;
        if (!path) return;
        const dbName = getLastPath(path);  // 得到数据库名称

        const tableNames = getTableNames(dbName);
        const idx = tableNames.indexOf(tableName)
        if (!isEdit) {
            if (idx >= 0) {
                message.error("数据库中表名不能重复");
                return;
            }
        }

        await dbOperateIns.init();

        const tableObj: ITable = {
            name: tableName,
            columns: colInfosToTColumns(infos)
        }

        setDatas(prev => {
            if (prev.length === 0) {
                // 没有数据，直接创建表
                (async () => {
                    const bool = await dbOperateIns.addTable(dbOperateIns.dbConnectionObj[dbName], tableObj);
                    if (bool) {
                        message.success('表创建或修改成功');
                    } else {
                        message.error('表创建或修改失败');
                    }
                })();
            } else {
                // 根据infos把datas数据类型转换好
                const newDatas = dataTransform(datas, infos);
                // 创建表后添加数据
                (async () => {
                    try {
                        let bool = await dbOperateIns.addTable(dbOperateIns.dbConnectionObj[dbName], tableObj);
                        if (bool) {
                            message.success('表创建或修改成功');
                        } else {
                            message.error('表创建或修改失败');
                        }
                        bool = await dbOperateIns.addData(dbOperateIns.dbConnectionObj[dbName], tableName, newDatas);
                        if (bool) {
                            message.success('数据添加成功');
                        } else {
                            message.error('数据添加失败');
                        }
                    } catch (err: any) {
                        message.error(err?.message);
                    }
                })();
            }
            return prev;
        });

    }, [datas, isEdit, props.location?.pathname]);

    // 渲染的东西
    let ele = null;
    if (!isApplyFile) {
        // 既然写了ref，就都用ref，否则很乱套，出bug
        ele = (<SetFieldsWrapper ref={fileRef} className={styles.fields} onUpdateFields={handleUpdateFields} />);
    } else {
        ele = (<>
            <UploadFile className={styles.upload} onUploadSuccess={handleUploadSuccess} />
            {/* 采用style形式，一开始得运行组件，从而绑上去ref方法 */}
            <SetFieldsWrapper
                ref={fileRef}
                style={{
                    display: isShow ? 'block' : 'none'
                }}
                className={styles.fields}
                onUpdateFields={handleUpdateFields}
            />
        </>)
    }

    return <div className={`${styles.opWrap} ${cn}`} style={style}>
        {ele}
    </div>
}

export default React.memo(ConfigTable);
