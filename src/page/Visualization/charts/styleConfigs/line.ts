import { EChartsOption } from "echarts-for-react";
import { PannelTheme } from "../../../../types";
import { DataMsg } from "../dataConfigs";
import { LabelObjToValue, LabelPosition, LineStyleConfigObj, StyleConfigRenderTypes } from "../types";
import { getEChartsGrid, getEChartsLegend, getEChartsLogicXAxis, getEChartsLogicYAxis, getEChartsTooltip, getLabelInitObj, getLegendInitObj, getTitleInitObj, getXAxisInitObj, getYAxisInitObj } from "./common";
import themeObjs from "../MyChart/themes";

export enum LineType {
    normal = "折线",
    smooth = "圆滑曲线",
    step = "阶梯曲线",
}

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.ContentLineStyle,
    StyleConfigRenderTypes.Label, StyleConfigRenderTypes.XAxis,
    StyleConfigRenderTypes.YAxis, StyleConfigRenderTypes.Legend
];

/**
 * 获得折线图初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): LineStyleConfigObj {
    const themeConfig = themeObjs[theme];
    return {
        // 图表标题
        chartTitle: getTitleInitObj(title),

        // 折线样式
        contentLineStyle: {
            lineWidth: 2,
            lineType: LineType.normal,
        },

        // 数据标签
        label: getLabelInitObj(themeConfig.graph.label.color),

        xAxis: getXAxisInitObj(themeConfig.categoryAxis.axisLine.lineStyle.color, themeConfig.categoryAxis.axisLabel.color),
        yAxis: getYAxisInitObj(themeConfig.categoryAxis.axisLine.lineStyle.color, themeConfig.categoryAxis.axisLabel.color, themeConfig.categoryAxis.splitLine.lineStyle.color),
        legend: getLegendInitObj(themeConfig.legend.textStyle.color),
    }
};

// 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
export { getStyleConfigAfterUpdateTheme } from "./common";

/**
 * 图表样式配置到echarts配置
 * @param styleConfig 
 * @returns 
 */
export function styleConfigToEChartsConfig(styleConfig: LineStyleConfigObj, dataMsg: DataMsg): EChartsOption {
    const { attrValues, metrFields, values } = dataMsg;
    const { contentLineStyle, label, xAxis, yAxis, legend } = styleConfig;

    const calcYAxis = getEChartsLogicYAxis(yAxis, metrFields);

    const calcSeries: any[] = values.map((value, idx) => {
        const res: any = {
            name: metrFields[idx],  // 对应legend
            data: value,
            type: 'line',
            lineStyle: {
                width: contentLineStyle.lineWidth,  // 线宽
            },
            label: {
                show: label.show,
                position: LabelObjToValue[label.position as LabelPosition],
                fontSize: label.fontSize,
                color: label.color,
            },
            connectNulls: true,  // 折线图跨点连线
        };

        const lineT = contentLineStyle.lineType;
        if (lineT === LineType.normal) {
            res.smooth = false;
            res.step = false;
        } else if (lineT === LineType.smooth) {
            res.smooth = true;
            res.step = false;
        } else if (lineT === LineType.step) {
            res.smooth = false;
            res.step = true;
        }

        return res;
    });

    return {
        tooltip: getEChartsTooltip(),
        xAxis: getEChartsLogicXAxis(xAxis, attrValues),
        yAxis: calcYAxis,
        legend: getEChartsLegend(legend, metrFields),
        grid: getEChartsGrid(calcYAxis.nameGap, legend.position, legend.show, yAxis.titleShow),
        series: calcSeries,
    };
}
