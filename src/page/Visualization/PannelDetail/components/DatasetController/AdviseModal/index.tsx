import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Button, Modal, ModalFuncProps, message } from 'antd';
import qs from "query-string";
import styles from "../AddSetModal/index.module.css";
import myStyles from "./index.module.css";
import setStyles from "../index.module.css";
import { Field, VisualType } from '../../../../../Dataset/ManageSet';
import { Resizable } from 're-resizable';
import { getDatasetInfoById } from '../../../../../../utils/datasetStorage';
import dbOperateIns from '../../../../../../utils/dbOperate';
import { Advice, Advisor, ckbDict } from '@antv/ava';
import { canAdviseCharts, combine, getAdviseDataConfig, mapType } from './utils';
import { ChartConfigInfo, PannelDetailInfo } from '../../..';
import { addPannelDetailInfo } from '../../../../../../utils/pannelDetailStorage';
import getNewLayoutMsg from '../../../utils/getNewLayoutMsg';
import { initDataConfigs } from '../../../../charts/dataConfigs';
import { getInitStyleConfig } from '../../../../charts/styleConfigs';
import { BarStyleConfigObj, RowBarStyleConfigObj } from '../../../../charts/types';
import { BarType } from '../../../../charts/styleConfigs/bar';

interface IProps extends ModalFuncProps {
    detailInfo: PannelDetailInfo
    datasetId: string | undefined
    selectFields: string[]
    updateDetail: () => void
    renderListFunc: (type: VisualType.Attribute | VisualType.Metric | "allSelect") => React.ReactNode,
}

const AdviseModal: React.FC<IProps> = (props) => {
    const { detailInfo, datasetId, selectFields, open, onOk, onCancel, renderListFunc } = props;

    // const cn = ckbDict('zh-CN');
    // console.log(cn);

    /**
     * 数据集数据
     */
    const [datas, setDatas] = useState<any[]>([]);

    /**
     * 字段info
     */
    const [fieldInfos, setFieldInfos] = useState<Field[]>([]);

    useEffect(() => {
        if (!datasetId || !getDatasetInfoById(datasetId)) {
            message.info("请添加数据集");
        } else {
            const info = getDatasetInfoById(datasetId);
            if (!info) {
                message.error("数据集已不存在");
                return;
            }
            setFieldInfos(info.fields);
            dbOperateIns.init().then(r => {
                dbOperateIns.executeSQL(info.dbName, info.sql).then(res => {
                    setDatas(res.data.slice(0, 3000));  // 3000条数据推荐图表
                });
            });
        }
    }, [datasetId]);

    const [adviseInfos, setAdviseInfos] = useState<Advice[]>([]);

    const handleClose = useCallback(() => {
        setAdviseInfos([]);
        onCancel && onCancel();
    }, [onCancel]);

    const handleAdvise = useCallback(() => {
        const adviseData = datas.map(d => {
            const obj: any = {};
            for (const f of selectFields) {
                obj[f] = d[f];
            }
            return obj;
        });
        const myChartAdvisor = new Advisor({
            ckbCfg: canAdviseCharts
        });
        const adviseResults = myChartAdvisor.advise({ data: adviseData });
        setAdviseInfos(adviseResults);
        console.log(adviseResults);
    }, [datas, selectFields]);

    const handleOk = useCallback(() => {
        // 添加图表到仪表盘
        let layouts = detailInfo.layouts;
        const chartsConfs = adviseInfos.map(info => {
            const type = mapType(info.type);
            const { newLayouts, id } = getNewLayoutMsg(layouts);
            layouts = newLayouts;
            const styleConfig = getInitStyleConfig[type](`未命名图表${id.slice(0, 8)}`, detailInfo.theme);
            if (info.type === "percent_stacked_bar_chart" || info.type === "percent_stacked_column_chart") {
                (styleConfig as BarStyleConfigObj | RowBarStyleConfigObj).barStyle.barType = BarType.PercentStack;
            }
            return {
                key: id,
                name: `未命名图表${id.slice(0, 8)}`,
                type,
                datasetId,
                dataConfig: getAdviseDataConfig(type, info, fieldInfos, datasetId!),
                styleConfig
            }
        })
        addPannelDetailInfo({
            ...detailInfo!,
            layouts,
            chartConfigs: [
                ...detailInfo.chartConfigs,
                ...chartsConfs,
            ]
        });
        props.updateDetail();

        setAdviseInfos([]);

        onOk && onOk();
    }, [adviseInfos, datasetId, detailInfo, fieldInfos, onOk, props]);

    const [rightClass, setRightClass] = useState(setStyles.resizeRight);
    const handleResizeStart = useCallback(() => {
        setRightClass(prve => setStyles.resizeRightDrag);
    }, []);
    const handleResizeStop = useCallback(() => {
        setRightClass(prev => setStyles.resizeRight);
    }, []);

    const renderAdviseRes = useCallback(() => {
        return adviseInfos.map(i => {
            console.log(i);
            return <div key={i.type} style={{marginBottom: 4}}>
                {i.type} {i.score}
            </div>
        });
    }, [adviseInfos]);


    return (
        <Modal
            className={styles.modal}
            title="图表推荐"
            open={open}
            onOk={handleOk}
            onCancel={handleClose}
            destroyOnClose={true}
            width={"910px"}
            wrapClassName={styles.modalWrap}
            footer={[
                <Button key="advise" type="primary" onClick={handleAdvise}
                    disabled={selectFields.length > 0 ? false : true}
                >
                    推荐
                </Button>,
                <Button
                    key="save" type="primary" onClick={handleOk}
                    disabled={selectFields.length > 0 ? false : true}
                >
                    保存
                </Button>,
            ]}
            okButtonProps={{ disabled: selectFields.length > 0 ? false : true }}
            cancelButtonProps={{ disabled: selectFields.length > 0 ? false : true }}
        >
            <div className={myStyles.content}>
                <Alert message="基于当前的数据源，选择字段后会为您推荐以下图表，可选择多个渲染到仪表盘中。"
                    type='info' banner style={{ height: 36, width: "100%", fontSize: "12px" }} />

                <div className={myStyles.wrap}>
                    <Resizable
                        handleClasses={{ right: rightClass }}
                        defaultSize={{ width: '200px', height: '100%' }}
                        minWidth={120}
                        maxWidth={640}
                        enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                        onResizeStart={handleResizeStart}
                        onResizeStop={handleResizeStop}
                    >
                        <div className={myStyles.fields}>
                            <div className={myStyles.types}>
                                <div className={myStyles.title}>图表展示字段</div>
                                {renderListFunc("allSelect")}
                            </div>
                        </div>
                    </Resizable>
                    <div style={{
                        padding: 10
                    }}>
                        {renderAdviseRes()}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default React.memo(AdviseModal);
