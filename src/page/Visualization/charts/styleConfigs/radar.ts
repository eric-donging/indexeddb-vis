import { EChartsOption } from "echarts-for-react";
import { DataMsg } from "../dataConfigs";
import { RadarStyleConfigObj, StyleConfigRenderTypes, RotateType, LineStyleType, RotateObjToValue, RadarType, RadarObjToValue, LineStyleObjToValue } from "../types";
import { bigNumberFormatter, findMax, getCeilNum } from "../utils";
import { getEChartsLegend, getLabelInitObj, getLegendInitObj, getSquareEChartsGrid, getTitleInitObj } from "./common";
import themeObjs from "../MyChart/themes";
import { PannelTheme } from "../../../../types";

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.RadarStyle,
    StyleConfigRenderTypes.Label, StyleConfigRenderTypes.RadarAxis,
    StyleConfigRenderTypes.Legend
];

/**
 * 获得雷达图初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): RadarStyleConfigObj {
    const themeConfig = themeObjs[theme];
    return {
        // 图表标题
        chartTitle: getTitleInitObj(title),

        // 雷达图样式
        radarStyle: {
            shape: RadarType.Polygon,
            size: 90,
            showDot: true,
            showShadow: false,
        },

        // 数据标签
        label: getLabelInitObj(themeConfig.graph.label.color),

        radarAxis: {
            labelShow: true,
            labelFontSize: 12,
            labelColor: "#8c8c8c",
            labelRotate: RotateType.Horizontal, // -90 ~ 90

            splitNumber: 5,
            splitType: LineStyleType.Dashed,
            splitWidth: 1,
            splitColor: "#e0e6f1",
            splitAreaShow: true,
        },

        legend: getLegendInitObj(themeConfig.legend.textStyle.color),
    }
};

/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 * @param oldStyleConfig 
 * @param theme 
 */
export function getStyleConfigAfterUpdateTheme(oldStyleConfig: RadarStyleConfigObj, theme: PannelTheme): RadarStyleConfigObj {
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
export function styleConfigToEChartsConfig(styleConfig: RadarStyleConfigObj, dataMsg: DataMsg): EChartsOption {
    const { attrValues, metrFields, values } = dataMsg;
    const { radarStyle, label, radarAxis, legend } = styleConfig;

    const maxValue = getCeilNum(findMax(values));
    const indicator = attrValues.map((a, i) => {
        const res: any = {
            name: a,
            max: maxValue,
        };
        if (i === 0) {
            res.axisLabel = {
                show: true,
                fontSize: radarAxis.labelFontSize,
                color: radarAxis.labelColor,
                rotate: RotateObjToValue[radarAxis.labelRotate],
                formatter: bigNumberFormatter,
            }
        }
        return res;
    })

    return {
        tooltip: {
            trigger: "item",
            formatter: function formatterFunc(params: any) {
                let res = `<span style="font-size: 12px;">${params.data.name}</span> <br/>`
                for (let i = 0; i < attrValues.length; i++) {
                    res += `<div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="background: ${params.color}; 
                                            height: 8px; width: 8px; border-radius: 50%;
                                            display: inline-block; margin-right: 8px;
                                    "></span>
                                    <span style="font-size: 12px;" >${attrValues[i]}</span>
                                </div>
                                <span style="font-size: 12px; margin-left: 20px" >${params.data.value[i]}</span>
                            </div>`;

                }
                // const res = '1'
                return res;
            }
        },
        legend: getEChartsLegend(legend, metrFields, "myLine", true),
        grid: getSquareEChartsGrid(legend.position, legend.show),
        radar: {
            shape: RadarObjToValue[radarStyle.shape],
            radius: radarStyle.size * 0.85 + "%",
            axisNameGap: 8,  // 这俩包括grid后续再看看效果修改
            indicator: indicator,
            axisLine: {
                lineStyle: {
                    type: "dashed",
                }
            },
            splitNumber: radarAxis.splitNumber,
            splitLine: {
                lineStyle: {
                    type: LineStyleObjToValue[radarAxis.splitType],
                    color: radarAxis.splitColor,
                    width: radarAxis.splitWidth,
                }
            },
            splitArea: {
                show: radarAxis.splitAreaShow,
            },
        },
        series: [
            {
                type: 'radar',
                label: {
                    show: label.show,
                    fontSize: label.fontSize,
                    color: label.color,
                },
                symbolSize: radarStyle.showDot ? 6 : 0,  // 8
                areaStyle: radarStyle.showShadow ? {} : null,  // null
                data: values.map((v, i) => {
                    return {
                        value: v,
                        name: metrFields[i],
                    };
                }),
            }
        ],
    };
}
