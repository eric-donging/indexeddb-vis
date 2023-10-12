import React, { useCallback, useMemo, useRef, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import qs from "query-string";
import cn from "classnames";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { message } from "antd";
import OperateHeader from "./components/OperateHeader";
import styles from "./index.module.css";
import { getPannelInfoById } from "../../../utils/pannelStorage";
import { PathNames } from "../../../configs/routerConfig";
import DatasetController from "./components/DatasetController";
import { ref as LayoutRef } from "../../../components/MyLayout";
import ChartController from "./components/ChartController";
import PannelContent, { Layouts } from "./components/PannelContent";
import getNewLayoutMsg from "./utils/getNewLayoutMsg";
import { ChartType, StyleConfigObj } from "../charts/types";
import { FieldInWrap } from "./components/ChartController/types";
import { addPannelDetailInfo, getPannelDetailInfoById } from "../../../utils/pannelDetailStorage";
import { DataConfig, initDataConfigs } from "../charts/dataConfigs";
import { getInitStyleConfig, getStyleConfigAfterUpdateTheme } from "../charts/styleConfigs";
import { PannelTheme } from "../../../types";

interface StyleConfigCtx {
    styleConfig: Partial<StyleConfigObj> | undefined
    chartType: ChartType | undefined
    chartId: string | undefined
    theme: PannelTheme
    changeStyleConfig?: (newConfig: Partial<StyleConfigObj>) => void
}
export const styleConfigCtx = React.createContext<StyleConfigCtx>({ styleConfig: {}, chartType: undefined, chartId: undefined, theme: PannelTheme.Walden });

/**
 * 本地化存储的图表配置信息类型
 */
export interface ChartConfigInfo {
    /**
     * 图表key
     */
    key: string
    /**
     * 图表名
     */
    name: string
    /**
     * 图表类型
     */
    type: ChartType
    /**
     * 使用的数据集id，选定后不能更改
     */
    datasetId: string | undefined
    /**
     * 数据配置
     */
    dataConfig: DataConfig[],
    /**
     * 样式配置
     */
    styleConfig: Partial<StyleConfigObj>
}

/**
 * 本地化存储一个仪表盘细节信息类型
 */
export interface PannelDetailInfo {
    /**
     * 仪表盘id
     */
    id: string
    /**
     * 仪表盘拥有数据集的id数组
     */
    datasetIds: string[]
    /**
     *  图表的布局
     */
    layouts: Layouts,
    /**
     * 仪表盘图表的主题
     */
    theme: PannelTheme,
    /**
     * 图表本地化存储
     */
    chartConfigs: ChartConfigInfo[]
}

interface IProps extends RouteComponentProps { }

const PannelDetail: React.FC<IProps> = (props) => {
    /**
     * 强制刷新
     */
    const [, forceUpdate] = useState<any>({});

    const pannelId = useRef(qs.parse(props.location.search).id as string).current;

    /**
     * 保持数据一致，并刷新
     */
    const updateInfo = useCallback(() => {
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        forceUpdate({});
    }, [pannelId]);

    // 基础信息获得
    const info = getPannelInfoById(pannelId);
    const detailInfoRef = useRef(getPannelDetailInfoById(pannelId));

    // console.log("重新获得本地化信息了", detailInfoRef.current?.layouts.sm);

    // 和头部各操作相关的函数
    const handleBack = useCallback(() => {
        console.log('back');
        props.history.push("/" + PathNames.visual);
    }, [props.history]);

    const wait = useCallback(() => {
        console.log('wait~ wait~ wait~');
        message.info("敬请期待！");
    }, []);

    const handlePreview = useCallback(() => {
        console.log(1111);
        const w = window.open('about:blank');
        if (w) {
            w.location.href = `/visual/preview?id=${pannelId}`;
        }
    }, [pannelId]);

    const [wrapClass, setWrapClass] = useState('');
    const handleFull = useCallback((status: boolean) => {
        console.log(status, 'full');
        if (status) {  // 全屏
            setWrapClass(styles.fullWrap);
            LayoutRef.current.style.minWidth = "0px";
        } else {
            setWrapClass('');
            LayoutRef.current.style.minWidth = "1200px";
        }
    }, []);

    const handleTheme = useCallback((newTheme: PannelTheme) => {
        if (detailInfoRef.current!.theme === newTheme) {
            return;
        } else {
            addPannelDetailInfo({
                ...detailInfoRef.current!,
                theme: newTheme,
                // 变换主题，每个图表关于颜色的configStyle需要改变
                chartConfigs: detailInfoRef.current!.chartConfigs.map(c => {
                    console.log('变换主题', c);
                    return {
                        ...c,
                        styleConfig: getStyleConfigAfterUpdateTheme[c.type](c.styleConfig, newTheme),
                    };
                }),
            })
            updateInfo();
        }
    }, [updateInfo]);

    // 数据集管理组件相关
    const [selectSetId, setSelectSetId] = useState<string | undefined>(detailInfoRef.current?.datasetIds[0]);

    const handleSelectSetIdChange = useCallback((newId: string) => {
        if (newId !== selectSetId) {
            setSelectSetId(newId);
            setSelectChartId(undefined);
            setIsChartSelected(false);
            setSelectedChartType(undefined);
        }
    }, [selectSetId]);

    const handleAddSet = useCallback((id: string) => {
        if (detailInfoRef.current!.datasetIds.some(i => i === id)) {
            message.info("该数据集已存在");
        } else {
            addPannelDetailInfo({
                ...detailInfoRef.current!,
                datasetIds: [...detailInfoRef.current!.datasetIds, id]
            })
            detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
            message.success("添加成功");
            if (!selectSetId) {
                setSelectSetId(id);
            }
            forceUpdate({});
        }
    }, [pannelId, selectSetId]);


    /**
     * 当前是否有图表被选中，以及被选中图表的类型
     */
    const [isChartSelected, setIsChartSelected] = useState<boolean>(false);
    const [selectedChartType, setSelectedChartType] = useState<ChartType | undefined>(undefined);

    // 仪表盘被选中的图表id
    const [selectChartId, setSelectChartId] = useState<string | undefined>(undefined);

    const handleAddChart = useCallback((type: ChartType) => {
        if (detailInfoRef.current!.datasetIds.length === 0) {
            message.warning("当前仪表盘没有数据集，请先添加数据集或新建数据集后再创建图表");
            return;
        }

        setIsChartSelected(true);
        setSelectedChartType(type);
        const { newLayouts, id } = getNewLayoutMsg(detailInfoRef.current!.layouts);
        // console.log(newLayouts, id);
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            layouts: newLayouts,
            chartConfigs: [
                ...detailInfoRef.current!.chartConfigs,
                {
                    key: id,
                    name: `未命名图表${id.slice(0, 8)}`,
                    type,
                    datasetId: selectSetId,
                    dataConfig: initDataConfigs[type],
                    styleConfig: getInitStyleConfig[type](`未命名图表${id.slice(0, 8)}`, detailInfoRef.current!.theme),
                }
            ]
        });
        setSelectChartId(id);
        updateInfo();
    }, [selectSetId, updateInfo]);

    const handleChangeType = useCallback((newType: ChartType) => {
        console.log('要变力，要变力！', newType);
    }, []);

    const handleAddDataConfig = useCallback((idx: number, field: FieldInWrap) => {
        const editChartConfig = detailInfoRef.current!.chartConfigs.find(c => c.key === selectChartId);
        if (!editChartConfig) {
            return;
        }
        editChartConfig.dataConfig[idx].fields.push(field);
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            chartConfigs: detailInfoRef.current!.chartConfigs.map(c => {
                if (c.key === selectChartId) {
                    return editChartConfig;
                }
                return c;
            }),
        });
        updateInfo();
    }, [selectChartId, updateInfo]);

    const handleDeleteDataConfig = useCallback((idx: number, fieldName: string) => {
        const editChartConfig = detailInfoRef.current!.chartConfigs.find(c => c.key === selectChartId);
        if (!editChartConfig) {
            return;
        }
        const index = editChartConfig.dataConfig[idx].fields.findIndex(f => f.field.fieldName === fieldName);
        if (index > -1) {
            editChartConfig.dataConfig[idx].fields.splice(index, 1);
        }
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            chartConfigs: detailInfoRef.current!.chartConfigs.map(c => {
                if (c.key === selectChartId) {
                    return editChartConfig;
                }
                return c;
            }),
        });
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        // console.log(detailInfoRef.current);
        forceUpdate({});
    }, [pannelId, selectChartId]);

    const handleEditDataConfig = useCallback((idx: number, fieldName: string, adjustObj: object) => {
        const editChartConfig = detailInfoRef.current!.chartConfigs.find(c => c.key === selectChartId);
        if (!editChartConfig) {
            return;
        }
        const index = editChartConfig.dataConfig[idx].fields.findIndex(f => f.field.fieldName === fieldName);
        editChartConfig.dataConfig[idx].fields[index] = {
            ...editChartConfig.dataConfig[idx].fields[index],
            ...adjustObj,
        }
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            chartConfigs: detailInfoRef.current!.chartConfigs.map(c => {
                if (c.key === selectChartId) {
                    return editChartConfig;
                }
                return c;
            }),
        });
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        forceUpdate({});
    }, [pannelId, selectChartId]);

    const chartControllerDataConfig = useMemo(() => {
        // console.log('useMemo运行了');
        if (!detailInfoRef.current) {
            return undefined;
        }
        return detailInfoRef.current.chartConfigs.find(c => c.key === selectChartId)?.dataConfig
    }, [selectChartId, detailInfoRef.current]);

    const chartControllerStyleConfig = useMemo(() => {
        // console.log('useMemo运行了');
        if (!detailInfoRef.current) {
            return undefined;
        }
        return detailInfoRef.current.chartConfigs.find(c => c.key === selectChartId)?.styleConfig
    }, [selectChartId, detailInfoRef.current]);

    const changeStyleConfig = useCallback((newConfig: Partial<StyleConfigObj>) => {
        const editChartConfig = detailInfoRef.current!.chartConfigs.find(c => c.key === selectChartId);
        if (!editChartConfig) {
            return;
        }
        editChartConfig.styleConfig = { ...editChartConfig.styleConfig, ...newConfig };
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            chartConfigs: detailInfoRef.current!.chartConfigs.map(c => {
                if (c.key === selectChartId) {
                    return editChartConfig;
                }
                return c;
            }),
        });
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        forceUpdate({});
    }, [pannelId, selectChartId]);

    // 仪表盘内容相关操作
    const handleClickPannelConetnt = useCallback((newId: string | undefined, type: ChartType | undefined, datasetId: string | undefined) => {
        setSelectChartId(newId);  // 改变被选中的图表id state
        if (!newId) {  // 点击的是仪表盘的空白
            setIsChartSelected(false);
            setSelectedChartType(undefined);
        } else {
            setIsChartSelected(true);
            setSelectedChartType(type);
            if (datasetId) {
                setSelectSetId(datasetId);
            }
        }
    }, []);

    const handleDeleteChart = useCallback((id: string) => {
        setIsChartSelected(false);
        setSelectedChartType(undefined);
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            layouts: {
                sm: detailInfoRef.current!.layouts.sm.filter(layout => layout.i !== id),
                xs: detailInfoRef.current!.layouts.xs.filter(layout => layout.i !== id)
            },
            chartConfigs: detailInfoRef.current!.chartConfigs.filter(config => config.key !== id)
        });
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        forceUpdate({});
    }, [pannelId]);

    const handleLayoutsChange = useCallback((newLayouts: Layouts) => {
        addPannelDetailInfo({
            ...detailInfoRef.current!,
            layouts: newLayouts
        });
        detailInfoRef.current = getPannelDetailInfoById(pannelId);  // 数据一致
        forceUpdate({});
    }, [pannelId]);

    if (!info || !detailInfoRef.current) {
        return (<h1>该仪表盘已不存在</h1>);
    }
    return (<DndProvider backend={HTML5Backend}>
        <div className={cn(styles.container, wrapClass)}>
            <OperateHeader
                title={info.name}
                theme={detailInfoRef.current.theme}
                onBack={handleBack}
                onPreview={handlePreview}
                onShare={wait}
                onChangeFullStatus={handleFull}  // 组件传递的方法用useCallback包一下，这样React.memo就有意义了
                onChangeTheme={handleTheme}
            />

            <div className={styles.content}>
                <DatasetController
                    selectedId={selectSetId}
                    detailInfo={detailInfoRef.current}
                    updateFather={updateInfo}
                    onChangeSeletedId={handleSelectSetIdChange}
                    onAddSet={handleAddSet}
                />

                <styleConfigCtx.Provider value={{
                    styleConfig: chartControllerStyleConfig,
                    chartType: selectedChartType,
                    chartId: selectChartId,
                    theme: detailInfoRef.current.theme,
                    changeStyleConfig: changeStyleConfig
                }}>
                    <ChartController
                        isSelect={isChartSelected}
                        selectedType={selectedChartType}
                        selectChartId={selectChartId}  // 冗余字段，为了使不同图表数据wrap key值不同，避免渲染复用bug
                        dataConfig={chartControllerDataConfig}
                        onAddChart={handleAddChart}
                        onChangeType={handleChangeType}
                        onAddDataConfig={handleAddDataConfig}
                        onDeleteDataConfig={handleDeleteDataConfig}
                        onEditDataConfig={handleEditDataConfig}
                    />

                    <PannelContent
                        layouts={detailInfoRef.current.layouts}
                        chartConfigs={detailInfoRef.current.chartConfigs}
                        selectId={selectChartId}
                        onChangeSelectId={handleClickPannelConetnt}
                        onDeleteChart={handleDeleteChart}
                        onLayoutsChange={handleLayoutsChange}
                    />
                </styleConfigCtx.Provider>
            </div>
        </div>
    </DndProvider >);
};

export default PannelDetail;
