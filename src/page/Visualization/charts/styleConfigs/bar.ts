import { EChartsOption } from "echarts-for-react";
import { DataMsg } from "../dataConfigs";
import { BarStyleConfigObj, LabelObjToValue, LabelPosition, StyleConfigRenderTypes } from "../types";
import { transpose } from "../utils";
import { getTitleInitObj, getLabelInitObj, getXAxisInitObj, getYAxisInitObj, getLegendInitObj, getEChartsLogicYAxis, getEChartsGrid, getEChartsLegend, getEChartsLogicXAxis, getEChartsTooltip } from "./common";
import themeObjs from "../MyChart/themes";
import { PannelTheme } from "../../../../types";

export enum BarType {
    Group = "分组",
    Stack = "堆叠",
    PercentStack = "百分比堆叠",
}

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.BarStyle,
    StyleConfigRenderTypes.Label, StyleConfigRenderTypes.XAxis,
    StyleConfigRenderTypes.YAxis, StyleConfigRenderTypes.Legend
];

/**
 * 获得柱状图初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): BarStyleConfigObj {
    const themeConfig = themeObjs[theme];
    return {
        // 图表标题
        chartTitle: getTitleInitObj(title),

        // 柱形样式
        barStyle: {
            barType: BarType.Group,
        },

        // 数据标签
        label: getLabelInitObj(themeConfig.graph.label.color, LabelPosition.Center),

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
export function styleConfigToEChartsConfig(styleConfig: BarStyleConfigObj, dataMsg: DataMsg): EChartsOption {
    const { attrValues, metrFields, values } = dataMsg;
    const { barStyle, label, xAxis, yAxis, legend } = styleConfig;

    const calcYAxis = getEChartsLogicYAxis(yAxis, metrFields);

    return {
        tooltip: getEChartsTooltip(),
        xAxis: getEChartsLogicXAxis(xAxis, attrValues),
        yAxis: calcYAxis,
        legend: getEChartsLegend(legend, metrFields),
        grid: getEChartsGrid(calcYAxis.nameGap, legend.position, legend.show, yAxis.titleShow),
        series: getBarSeries(),
    };

    function getBarSeries(): any[] {
        const tr = transpose(values);
        const calcValues: number[][] = [];
        for (const c of tr) {
            console.log(c);
            const total = c.reduce(((a, b) => a + b));
            calcValues.push(c.map(n => n / total));
        }

        const trCalcValues = transpose(calcValues);

        return values.map((value, idx) => {
            const res: any = {
                name: metrFields[idx],  // 对应legend
                data: value,
                type: 'bar',
                stack: null,  // 不一开始声明，堆叠变分组莫名奇妙属性变化，option变化，图表就是不变
                label: {
                    show: label.show,
                    position: LabelObjToValue[label.position as LabelPosition],
                    fontSize: label.fontSize,
                    color: label.color,
                    formatter: null,
                },

            };
            if (barStyle.barType !== BarType.Group) {
                res.stack = "total";
                if (barStyle.barType === BarType.PercentStack) {
                    res.data = trCalcValues[idx];
                    res.label.formatter = function (res: any) {
                        if (res.value) {
                            return (res.value * 100).toFixed(2) + '%'
                        } else {
                            return 0;
                        }
                    };
                }
            }

            return res;
        });
    }
}
