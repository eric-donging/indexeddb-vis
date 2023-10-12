import { EChartsOption } from "echarts-for-react";
import { DataMsg } from "../dataConfigs";
import { RowBarStyleConfigObj, LabelObjToValue, LabelPosition, StyleConfigRenderTypes, LegendPosition } from "../types";
import { transpose } from "../utils";
import { BarType } from "./bar";
import { getTitleInitObj, getLabelInitObj, getXAxisInitObj, getYAxisInitObj, getLegendInitObj, getEChartsLogicYAxis, getEChartsLegend, getEChartsLogicXAxis, getEChartsTooltip } from "./common";
import themeObjs from "../MyChart/themes";
import { PannelTheme } from "../../../../types";

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.BarStyle,
    StyleConfigRenderTypes.Label, StyleConfigRenderTypes.XAxis,
    StyleConfigRenderTypes.YAxis, StyleConfigRenderTypes.Legend
];

/**
 * 获得条形图初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): RowBarStyleConfigObj {
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

        xAxis: getYAxisInitObj(themeConfig.categoryAxis.axisLine.lineStyle.color, themeConfig.categoryAxis.axisLabel.color, themeConfig.categoryAxis.splitLine.lineStyle.color),
        yAxis: getXAxisInitObj(themeConfig.categoryAxis.axisLine.lineStyle.color, themeConfig.categoryAxis.axisLabel.color),
        legend: getLegendInitObj(themeConfig.legend.textStyle.color),
    }
};

/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 * @param oldStyleConfig 
 * @param theme 
 */
export function getStyleConfigAfterUpdateTheme(oldStyleConfig: RowBarStyleConfigObj, theme: PannelTheme): RowBarStyleConfigObj {
    const themeConfig = themeObjs[theme];
    oldStyleConfig.label.color = themeConfig.graph.label.color;
    oldStyleConfig.yAxis.lineColor = themeConfig.categoryAxis.axisLine.lineStyle.color;
    oldStyleConfig.yAxis.labelColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.xAxis.lineColor = themeConfig.categoryAxis.axisLine.lineStyle.color;
    oldStyleConfig.xAxis.labelColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.xAxis.titleColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.xAxis.splitColor = themeConfig.categoryAxis.splitLine.lineStyle.color;
    oldStyleConfig.legend.color = themeConfig.legend.textStyle.color;
    return oldStyleConfig;
}

/**
 * 图表样式配置到echarts配置
 * @param styleConfig 
 * @returns 
 */
export function styleConfigToEChartsConfig(styleConfig: RowBarStyleConfigObj, dataMsg: DataMsg): EChartsOption {
    const { attrValues, metrFields, values } = dataMsg;
    const { barStyle, label, xAxis, yAxis, legend } = styleConfig;

    const calcXAxis = getEChartsLogicYAxis(xAxis, metrFields);

    return {
        tooltip: getEChartsTooltip(),
        xAxis: calcXAxis,
        yAxis: getEChartsLogicXAxis(yAxis, attrValues),
        legend: getEChartsLegend(legend, metrFields),
        grid: getEChartsGrid(calcXAxis.nameGap, legend.position, legend.show, xAxis.titleShow),
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

export function getEChartsGrid(nameGap: number, position: LegendPosition, isLegendShow: boolean, isXTitleShow: boolean) {
    const res: any = {
        left: "4%",
        right: "4%",
        top: "4%",
        bottom: isXTitleShow ? nameGap : "4%",
        containLabel: true,
    }
    if (!isLegendShow) {
        return res;
    }
    else if (position === LegendPosition.Left) {
        res.left = 88;
    } else if (position === LegendPosition.Right) {
        res.right = 88;
    } else if (position === LegendPosition.Top) {
        res.top = 44;
    } else {
        if (isXTitleShow) res.bottom = nameGap + 40;
        else res.bottom = 40;
    }
    return res;
}
