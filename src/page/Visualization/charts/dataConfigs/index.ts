import { VisualType } from "../../../Dataset/ManageSet";
import { FieldInWrap, FieldWrapType } from "../../PannelDetail/components/ChartController/types";
import { ChartType } from "../types";

import {
    dataRenderConfig as lineDataRenderConfig, lineInitDataConfig,
    isDataConfigOver as isLineDataConfigOver, dataConfigToData as lineDataConfigToData,
} from "./line";
import {
    dataRenderConfig as barDataRenderConfig, barInitDataConfig,
    isDataConfigOver as isBarDataConfigOver, dataConfigToData as barDataConfigToData,
} from "./bar";
import {
    dataRenderConfig as rowBarDataRenderConfig, rowBarInitDataConfig,
    isDataConfigOver as isRowBarDataConfigOver, dataConfigToData as rowBarDataConfigToData,
} from "./rowBar";
import {
    dataRenderConfig as pieDataRenderConfig, pieInitDataConfig,
    isDataConfigOver as isPieDataConfigOver, dataConfigToData as pieDataConfigToData,
} from "./pie";
import {
    dataRenderConfig as radarDataRenderConfig, radarInitDataConfig,
    isDataConfigOver as isRadarDataConfigOver, dataConfigToData as radarDataConfigToData,
} from "./radar";
import {
    dataRenderConfig as cardDataRenderConfig, cardInitDataConfig,
    isDataConfigOver as isCardDataConfigOver, dataConfigToData as cardDataConfigToData,
} from "./card"

export interface DataItemConfig {
    title: string
    // 最多几个字段，-1表示不限制
    limit: number
    // 允许拖拽进来的字段类型 
    allow: 'all' | VisualType.Attribute | VisualType.Metric
    // 本组件属于哪种类型
    type: FieldWrapType
}

/**
 * 本地化存储的 一项 数据配置类型
 */
export interface DataConfig {
    type: FieldWrapType,
    fields: FieldInWrap[],
}


type ConfigT = {
    [p in ChartType]: DataItemConfig[]
};
/**
 * 图表类型 到 数据配置渲染的Wrapper配置 映射
 */
export const dataRenderConfigs: ConfigT = {
    [ChartType.Line]: lineDataRenderConfig,
    [ChartType.Table]: [],
    [ChartType.Card]: cardDataRenderConfig,
    [ChartType.Bar]: barDataRenderConfig,
    [ChartType.RowBar]: rowBarDataRenderConfig,
    [ChartType.Pie]: pieDataRenderConfig,
    [ChartType.Scatter]: [],
    [ChartType.Funnel]: [],
    [ChartType.Radar]: radarDataRenderConfig,
    [ChartType.Sankey]: [],
    [ChartType.Cloud]: [],
    // [ChartType.Parallel]: []
}


type InitDataConfigT = {
    [p in ChartType]: DataConfig[]
};
/**
 * 图表类型 到 初始的本地化存储数据配置
 */
export const initDataConfigs: InitDataConfigT = {
    [ChartType.Line]: lineInitDataConfig,
    [ChartType.Table]: [],
    [ChartType.Card]: cardInitDataConfig,
    [ChartType.Bar]: barInitDataConfig,
    [ChartType.RowBar]: rowBarInitDataConfig,
    [ChartType.Pie]: pieInitDataConfig,
    [ChartType.Scatter]: [],
    [ChartType.Funnel]: [],
    [ChartType.Radar]: radarInitDataConfig,
    [ChartType.Sankey]: [],
    [ChartType.Cloud]: [],
    // [ChartType.Parallel]: []
}

type JudgeDataConfigOverT = {
    [p in ChartType]: (configs: DataConfig[]) => boolean
}
/**
 * 判断一个图表的数据配置是否足以渲染图表
 */
export const isDataConfigOver: JudgeDataConfigOverT = {
    [ChartType.Table]: function (configs: DataConfig[]): boolean {
        throw new Error("Function not implemented.");
    },
    [ChartType.Card]: isCardDataConfigOver,
    [ChartType.Line]: isLineDataConfigOver,
    [ChartType.Bar]: isBarDataConfigOver,
    [ChartType.RowBar]: isRowBarDataConfigOver,
    [ChartType.Pie]: isPieDataConfigOver,
    [ChartType.Scatter]: function (configs: DataConfig[]): boolean {
        throw new Error("Function not implemented.");
    },
    [ChartType.Funnel]: function (configs: DataConfig[]): boolean {
        throw new Error("Function not implemented.");
    },
    [ChartType.Radar]: isRadarDataConfigOver,
    [ChartType.Sankey]: function (configs: DataConfig[]): boolean {
        throw new Error("Function not implemented.");
    },
    [ChartType.Cloud]: function (configs: DataConfig[]): boolean {
        throw new Error("Function not implemented.");
    },
    // [ChartType.Parallel]: function (configs: DataConfig[]): boolean {
    //     throw new Error("Function not implemented.");
    // }
}

/**
 * 注释以折线图为例，补齐其他图表后可以把个别属性类型变成 ?:
 */
export interface DataMsg {
    /**
     * X轴维度的值数组
     */
    attrValues: string[]
    /**
     * 选择了几个度量，决定几条直线
     */
    metrFields: string[]
    /**
     * 折线值，多条直线多个数组
     */
    values: (number | undefined)[][]
}

type DataConfigToDataT = {
    [p in ChartType]: (configs: DataConfig[]) => Promise<false | DataMsg>
}
/**
 * 数据配置到配置echarts图表所需的数据
 */
export const dataConfigToData: DataConfigToDataT = {
    [ChartType.Table]: function (configs: DataConfig[]) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Card]: cardDataConfigToData,
    [ChartType.Line]: lineDataConfigToData,
    [ChartType.Bar]: barDataConfigToData,
    [ChartType.RowBar]: rowBarDataConfigToData,
    [ChartType.Pie]: pieDataConfigToData,
    [ChartType.Scatter]: function (configs: DataConfig[]) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Funnel]: function (configs: DataConfig[]) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Radar]: radarDataConfigToData,
    [ChartType.Sankey]: function (configs: DataConfig[]) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Cloud]: function (configs: DataConfig[]) {
        throw new Error("Function not implemented.");
    },
    // [ChartType.Parallel]: function (configs: DataConfig[]) {
    //     throw new Error("Function not implemented.");
    // }
}
