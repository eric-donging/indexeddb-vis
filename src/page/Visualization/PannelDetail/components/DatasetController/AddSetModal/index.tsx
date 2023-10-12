import React, { useCallback, useEffect, useState } from 'react';
import { message, Modal, ModalFuncProps } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styles from "./index.module.css";
import { getDatasetInfos, getDatasetInfoById } from '../../../../../../utils/datasetStorage';
import DatasetTable from '../../../../../Dataset/DatasetDetail/DatasetTable';
import { DatasetInfo } from '../../../../../Dataset/ManageSet';
import dbOperateIns from '../../../../../../utils/dbOperate';

interface IProps extends ModalFuncProps {
    onAddSet?: (newSetId: string) => void
}

const DatasetTableWrapper = React.forwardRef(DatasetTable);

const AddSetModal: React.FC<IProps> = (props) => {
    const { open, onOk, onAddSet, onCancel: handleCancel } = props;

    const [updateState, forceUpdate] = useState({});

    const [selectId, setSelectId] = useState<undefined | string>(undefined);
    const [datasetEle, setDatasetEle] = useState<React.ReactNode>(null);

    if (selectId && !getDatasetInfoById(selectId)) {
        setSelectId(undefined);
    }

    const getAllDatasetList = useCallback(
        () => {
            const list = getDatasetInfos()
                .map((info, idx) => {
                    return (
                        <li
                            key={info.key}
                            onClick={() => {
                                if (info.id === selectId) return;
                                setSelectId(info.id)
                            }}
                            className={info.id === selectId ? styles.active : ""}
                        >
                            <div>{info.name}</div>
                            <div>{info.updateTime}</div>
                        </li>
                    );
                });
            return (
                <ul className={styles.list}>
                    {list}
                </ul>
            );
        },
        [selectId],
    );

    useEffect(() => {
        if (!selectId || !getDatasetInfoById(selectId)) {
            setDatasetEle("请从左侧选择数据集");
        } else {
            // setDatasetEle('wait   wait');
            const info = getDatasetInfoById(selectId) as DatasetInfo;
            dbOperateIns.init().then(r => {
                dbOperateIns.executeSQL(info.dbName, info.sql).then(res => {
                    setDatasetEle(<>
                        <DatasetTableWrapper
                            key={info.updateTime}  // 给个key，每次切换数据集，表格重新渲染，避免出现两个表格大小不一致，先压缩再变成正常大小
                            datas={res.data} limit={100}
                            style={{
                                height: 'calc(100% - 20px)',
                            }}
                            canEditType={false}
                        />
                        <div className={styles.tip}>数据预览只显示100行数据</div>
                    </>);
                });
            });
        }
    }, [selectId, updateState]);

    const handleOk = useCallback(() => {
        if (getDatasetInfoById(selectId!)) {  // 确保万无一失
            onAddSet && onAddSet(selectId!);
        } else {
            message.error("数据集已不存在！");
        }
        onOk && onOk();
    }, [onAddSet, onOk, selectId]);

    return (
        <Modal
            className={styles.modal}
            title="添加数据集"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            cancelText='取消'
            okText='确定'
            destroyOnClose={true}
            width={"910px"}
            wrapClassName={styles.modalWrap}
            okButtonProps={{ disabled: selectId ? false : true }}
        >
            <div className={styles.alertContent}>
                <div className={styles.selectSet}>
                    <div>
                        <span>请选择数据集</span>
                        <ReloadOutlined
                            style={{ cursor: "pointer" }}
                            onClick={() => { forceUpdate({}) }}
                        />
                    </div>
                    {getAllDatasetList()}
                </div>
                <div className={styles.showSet}>
                    {datasetEle}
                </div>
            </div>
        </Modal>
    )
}

export default AddSetModal;
