import { EChartsOption } from "echarts-for-react";
import { DataMsg } from "../dataConfigs";
import { PieLabelPosition, PieObjToValue, PieStyleConfigObj, StyleConfigRenderTypes } from "../types";
import { getSum } from "../utils";
import { getTitleInitObj, getLabelInitObj, getLegendInitObj, getEChartsTooltip, getEChartsLegend, getSquareEChartsGrid } from "./common";
import themeObjs from "../MyChart/themes";
import { PannelTheme } from "../../../../types";

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.PieStyle,
    StyleConfigRenderTypes.Label, StyleConfigRenderTypes.Legend
];

/**
 * 获得饼图初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): PieStyleConfigObj {
    const themeConfig = themeObjs[theme];
    return {
        // 图表标题
        chartTitle: getTitleInitObj(title),

        // 饼图样式
        pieStyle: {
            size: [0, 80]
        },

        // 数据标签
        label: getLabelInitObj(themeConfig.graph.label.color, PieLabelPosition.Inside),
        legend: getLegendInitObj(themeConfig.legend.textStyle.color),
    }
};

/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 * @param oldStyleConfig 
 * @param theme 
 */
export function getStyleConfigAfterUpdateTheme(oldStyleConfig: PieStyleConfigObj, theme: PannelTheme): PieStyleConfigObj {
    const themeConfig = themeObjs[theme];
    oldStyleConfig.label.color = themeConfig.graph.label.color;
    oldStyleConfig.legend.color = themeConfig.legend.textStyle.color;
    return oldStyleConfig;
}

/**
 * 图表样式配置到echarts配置
 * @param styleConfig 
 * @returns 
 */
export function styleConfigToEChartsConfig(styleConfig: PieStyleConfigObj, dataMsg: DataMsg, theme: PannelTheme): EChartsOption {
    const { pieStyle, label, legend } = styleConfig;

    const total = getSum(dataMsg.values);

    return {
        tooltip: getEChartsTooltip(true, total),
        legend: getEChartsLegend(legend, dataMsg.metrFields.length > 1 ? dataMsg.metrFields : dataMsg.attrValues, "circle"),
        grid: getSquareEChartsGrid(legend.position, legend.show),
        series: getPieSeries(),
        color: getPieColor(dataMsg.metrFields.length, theme),
    };

    function getPieSeries(): any[] {
        const res: any = {
            // name: '2333',  // 对应legend
            type: 'pie',
            radius: pieStyle.size.map(s => s * 0.9 + "%"),
            label: {
                show: label.show,
                position: PieObjToValue[label.position as PieLabelPosition],
                fontSize: label.fontSize,
                color: label.color,
                formatter: label.position === PieLabelPosition.Inside ? '{d}%' : '{b}: {d}%'
            },
            data: getPieData(dataMsg),
            selectedMode: "single",
            emphasis: {
                scale: false,
                focus: 'self',
            },
        };
        return [res];
    }
}

export type PieData = {
    value: number,
    name: string,
    extraMsg?: string,
}[];

function getPieData(dataMsg: DataMsg): PieData | undefined {
    const { attrValues, metrFields, values } = dataMsg;
    const res: PieData = [];
    for (let i = 0; i < metrFields.length; i++) {
        attrValues.forEach((a, j) => {
            const value = (values[i][j] ? values[i][j] : 0) as number;
            if (metrFields.length <= 1) {
                res.push({
                    value,
                    name: a,
                });
            } else {
                res.push({
                    value,
                    name: metrFields[i],
                    extraMsg: a,
                });
            }
        })
    }
    return res;
}

function getPieColor(metrLen: number, theme: PannelTheme): string[] {
    const defaultColors = themeObjs[theme].color;
    if (metrLen > 1) {
        return defaultColors.slice(0, metrLen);
    } else {
        return defaultColors;
    }
}
