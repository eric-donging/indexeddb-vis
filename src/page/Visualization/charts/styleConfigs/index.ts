import { EChartsOption } from "echarts-for-react";
import { DataMsg } from "../dataConfigs";
import { ChartType, StyleConfigRenderTypes } from "../types";
import {
    styleConfigRenderItems as lineStyleRenderItems,
    getInitStyleConfig as getLineInitStyleConfig,
    styleConfigToEChartsConfig as lineStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getLineStyleConfigAfterUpdateTheme,
} from "./line";
import {
    styleConfigRenderItems as barStyleRenderItems,
    getInitStyleConfig as getBarInitStyleConfig,
    styleConfigToEChartsConfig as barStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getBarStyleConfigAfterUpdateTheme,
} from "./bar";
import {
    styleConfigRenderItems as rowBarStyleRenderItems,
    getInitStyleConfig as getRowBarInitStyleConfig,
    styleConfigToEChartsConfig as rowBarStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getRowBarStyleConfigAfterUpdateTheme,
} from "./rowBar";
import {
    styleConfigRenderItems as pieStyleRenderItems,
    getInitStyleConfig as getPieInitStyleConfig,
    styleConfigToEChartsConfig as pieStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getPieStyleConfigAfterUpdateTheme,
} from "./pie";
import {
    styleConfigRenderItems as radarStyleRenderItems,
    getInitStyleConfig as getRadarInitStyleConfig,
    styleConfigToEChartsConfig as radarStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getRadarStyleConfigAfterUpdateTheme,
} from "./radar";
import {
    styleConfigRenderItems as cardStyleRenderItems,
    getInitStyleConfig as getCardInitStyleConfig,
    styleConfigToEChartsConfig as cardStyleConfigToEChartsConfig,
    getStyleConfigAfterUpdateTheme as getCardStyleConfigAfterUpdateTheme,
} from "./card";
import { PannelTheme } from "../../../../types";

type ConfigT = {
    [p in ChartType]: StyleConfigRenderTypes[]
};
/**
 * 图表类型 到 数据配置渲染的Wrapper配置 映射
 */
export const styleConfigRenderItems: ConfigT = {
    [ChartType.Line]: lineStyleRenderItems,
    [ChartType.Table]: [],
    [ChartType.Card]: cardStyleRenderItems,
    [ChartType.Bar]: barStyleRenderItems,
    [ChartType.RowBar]: rowBarStyleRenderItems,
    [ChartType.Pie]: pieStyleRenderItems,
    [ChartType.Scatter]: [],
    [ChartType.Funnel]: [],
    [ChartType.Radar]: radarStyleRenderItems,
    [ChartType.Sankey]: [],
    [ChartType.Cloud]: [],
    // [ChartType.Parallel]: []
}


type InitStyleConfigT = {
    [p in ChartType]: (title: string, theme: PannelTheme) => object
};
/**
 * 传入图表标题，获得初始化样式配置
 */
export const getInitStyleConfig: InitStyleConfigT = {
    [ChartType.Table]: function (title: string): object {
        throw new Error("Function not implemented.");
    },
    [ChartType.Card]: getCardInitStyleConfig,
    [ChartType.Line]: getLineInitStyleConfig,
    [ChartType.Bar]: getBarInitStyleConfig,
    [ChartType.RowBar]: getRowBarInitStyleConfig,
    [ChartType.Pie]: getPieInitStyleConfig,
    [ChartType.Scatter]: function (title: string): object {
        throw new Error("Function not implemented.");
    },
    [ChartType.Funnel]: function (title: string): object {
        throw new Error("Function not implemented.");
    },
    [ChartType.Radar]: getRadarInitStyleConfig,
    [ChartType.Sankey]: function (title: string): object {
        throw new Error("Function not implemented.");
    },
    [ChartType.Cloud]: function (title: string): object {
        throw new Error("Function not implemented.");
    },
    // [ChartType.Parallel]: function (title: string): object {
    //     throw new Error("Function not implemented.");
    // }
};


type AfterUpdateThemeType = {
    [p in ChartType]: (oldStyleConfig: any, theme: PannelTheme) => any
};
/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 */
export const getStyleConfigAfterUpdateTheme: AfterUpdateThemeType = {
    [ChartType.Table]: function (oldStyleConfig: any, theme: PannelTheme) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Card]: getCardStyleConfigAfterUpdateTheme,
    [ChartType.Line]: getLineStyleConfigAfterUpdateTheme,
    [ChartType.Bar]: getBarStyleConfigAfterUpdateTheme,
    [ChartType.RowBar]: getRowBarStyleConfigAfterUpdateTheme,
    [ChartType.Pie]: getPieStyleConfigAfterUpdateTheme,
    [ChartType.Scatter]: function (oldStyleConfig: any, theme: PannelTheme) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Funnel]: function (oldStyleConfig: any, theme: PannelTheme) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Radar]: getRadarStyleConfigAfterUpdateTheme,
    [ChartType.Sankey]: function (oldStyleConfig: any, theme: PannelTheme) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Cloud]: function (oldStyleConfig: any, theme: PannelTheme) {
        throw new Error("Function not implemented.");
    },
    // [ChartType.Parallel]: function (oldStyleConfig: any, theme: PannelTheme) {
    //     throw new Error("Function not implemented.");
    // }
}


type styleConfigToEChartsConfigT = {
    [p in ChartType]: ((styleConfig: any, dataMsg: DataMsg) => EChartsOption)
    | ((styleConfig: any, dataMsg: DataMsg, theme: PannelTheme) => EChartsOption)
};
/**
 * 图表样式配置到echarts配置
 */
export const styleConfigToEChartsConfig: styleConfigToEChartsConfigT = {
    [ChartType.Table]: function (styleConfig: any, dataMsg: DataMsg) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Card]: cardStyleConfigToEChartsConfig,
    [ChartType.Line]: lineStyleConfigToEChartsConfig,
    [ChartType.Bar]: barStyleConfigToEChartsConfig,
    [ChartType.RowBar]: rowBarStyleConfigToEChartsConfig,
    [ChartType.Pie]: pieStyleConfigToEChartsConfig,
    [ChartType.Scatter]: function (styleConfig: any, dataMsg: DataMsg) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Funnel]: function (styleConfig: any, dataMsg: DataMsg) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Radar]: radarStyleConfigToEChartsConfig,
    [ChartType.Sankey]: function (styleConfig: any, dataMsg: DataMsg) {
        throw new Error("Function not implemented.");
    },
    [ChartType.Cloud]: function (styleConfig: any, dataMsg: DataMsg) {
        throw new Error("Function not implemented.");
    },
    // [ChartType.Parallel]: function (styleConfig: any, dataMsg: DataMsg) {
    //     throw new Error("Function not implemented.");
    // }
};
