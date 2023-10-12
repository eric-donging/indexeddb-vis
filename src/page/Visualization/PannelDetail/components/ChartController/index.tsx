import React, { useCallback, useState } from "react";
import { Resizable } from "re-resizable";
import { Tabs, Tooltip } from "antd";
import type { TabsProps } from 'antd';
import cn from "classnames";
import styles from "../DatasetController/index.module.css";  // 先不抽离了
import myStyles from "./index.module.css";
import PanelExpand from "../../../../../components/PanelExpand";
import MyIcon from "../../../../../components/MyIcon";
import { ChartType } from "../../../charts/types";
import DataContent from "./dataComponents/DataContent";
import { DataConfig } from "../../../charts/dataConfigs";
import { FieldInWrap } from "./types";
import StylesWrapper from "./styleComponents/StylesWrapper";

type TypeStrT = {
    [p in ChartType]: string
};
export const TypeStr: TypeStrT = {
    [ChartType.Table]: "表格",
    [ChartType.Card]: "指标卡",
    [ChartType.Line]: "折线图",
    [ChartType.Bar]: "柱状图",
    [ChartType.RowBar]: "条形图",
    [ChartType.Pie]: "饼图",
    [ChartType.Scatter]: "散点图",
    [ChartType.Funnel]: "漏斗图",
    [ChartType.Radar]: "雷达图",
    [ChartType.Sankey]: "桑基图",
    [ChartType.Cloud]: "词云图",
    // [ChartType.Parallel]: "平行坐标系",
}

interface IProps {
    /**
     * 是否选择了图表
     */
    isSelect?: boolean
    /**
     * 选择图表的类型
     */
    selectedType?: ChartType
    /**
     * 冗余字段，为了使不同图表数据wrap key值不同，避免渲染复用bug
     */
    selectChartId?: string
    /**
     * 数据配置
     */
    dataConfig?: DataConfig[]
    /**
     * 选择图表类型改变触发
     * @param newType 
     * @returns 
     */
    onChangeType?: (newType: ChartType) => void
    /**
     * 添加所选类型的图表
     * @param type 
     * @returns 
     */
    onAddChart?: (type: ChartType) => void,
    /**
     * 给一个图表的数据配置中的一个wrapper添加一个字段
     * @param idx 第几个wrapper
     * @param field 本地化存储的字段信息
     * @returns 
     */
    onAddDataConfig?: (idx: number, field: FieldInWrap) => void
    onDeleteDataConfig?: (idx: number, fieldName: string) => void
    onEditDataConfig?: (idx: number, fieldName: string, adjustObj: object) => void
}

const ChartController: React.FC<IProps> = (props) => {
    const { isSelect = false, selectedType, selectChartId, dataConfig = [], onAddChart, onChangeType,
        onAddDataConfig, onDeleteDataConfig, onEditDataConfig } = props;

    const handleClickIcon = useCallback((chartType: ChartType) => {
        if (chartType === selectedType) {
            // 点击的图表和当前选择的类型一致
            return;
        } else if (!isSelect) {
            // 当前没有图表被选择，表示新建图表
            onAddChart && onAddChart(chartType);
        } else {
            // 切换图表类型
            onChangeType && onChangeType(chartType);
        }
    }, [isSelect, selectedType, onAddChart, onChangeType,]);

    const chartList = Object.values(ChartType).map(chartType => {
        const content = (<div className={myStyles.addText}>
            {isSelect ? `点击将当前选中图表切换成${TypeStr[chartType]}` : `点击新建${TypeStr[chartType]}`}
        </div>);
        return (
            <Tooltip title={content} placement='right' color='#fff' key={chartType}>
                <div
                    className={cn(myStyles.icon, chartType === selectedType ? myStyles.active : "")}
                    onClick={() => {
                        handleClickIcon(chartType);
                    }}
                >
                    <MyIcon type={chartType} style={{ fontSize: "24px" }} />
                </div>
            </Tooltip>

        );
    });

    const handleAddField = useCallback((idx: number, field: FieldInWrap) => {
        onAddDataConfig && onAddDataConfig(idx, field)
    }, [onAddDataConfig]);

    const handleDeleteField = useCallback((idx: number, fieldName: string) => {
        onDeleteDataConfig && onDeleteDataConfig(idx, fieldName)
    }, [onDeleteDataConfig]);

    const handleEidtField = useCallback((idx: number, fieldName: string, adjustObj: object) => {
        onEditDataConfig && onEditDataConfig(idx, fieldName, adjustObj);
    }, [onEditDataConfig]);

    

    const tabItmes: TabsProps['items'] = [{
        label: '数据',
        key: '1',
        children: <DataContent
            dataConfig={dataConfig}
            type={selectedType!}
            selectChartId={selectChartId}
            onAddField={handleAddField}
            onDeleteField={handleDeleteField}
            onEditField={handleEidtField}
        />,
    }, {
        label: '样式',
        key: '2',
        children: <StylesWrapper />,
    }, {
        label: '设置',
        key: '3',
        children: `Content of tab 1`,
    }];

    // 侧边展开收缩图标控制
    const [isExpand, setIsExpand] = useState(true);
    const handleCollapse = useCallback(() => {
        setIsExpand(false);
    }, []);
    const handleExpand = useCallback(() => {
        setIsExpand(true);
    }, []);

    // 放大缩小容器
    const [rightClass, setRightClass] = useState(styles.resizeRight);
    const handleResizeStart = useCallback(() => {
        setRightClass(prve => styles.resizeRightDrag);
    }, []);
    const handleResizeStop = useCallback(() => {
        setRightClass(prev => styles.resizeRight);
    }, []);

    return (<div className={isExpand ? myStyles.container : myStyles.containerCollapse}>
        <PanelExpand
            className={isExpand ? styles.expand : styles.expandCollapse}
            isExpand={isExpand}
            onCollapse={handleCollapse}
            onExpand={handleExpand}
        />

        <Resizable
            handleClasses={{ right: rightClass }}
            defaultSize={{ width: '200px', height: '100%' }}
            className={isExpand ? myStyles.resizeContainer : myStyles.resizeCollapse}
            minWidth={120}
            maxWidth={640}
            enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
        >
            <div className={myStyles.chart}>
                <div className={myStyles.types}>
                    <div className={myStyles.title}>图表类型</div>
                    <div className={myStyles.icons}>
                        {chartList}
                    </div>
                </div>

                {isSelect ?
                    <div className={myStyles.config}>
                        <Tabs
                            defaultActiveKey={"1"}
                            size="small"
                            items={tabItmes}
                            type="card"
                        />
                    </div> : <p>请选择图表进行配置</p>}
            </div>
        </Resizable>
    </div>);
};

export default React.memo(ChartController);
