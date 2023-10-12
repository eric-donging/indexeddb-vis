import { PannelTheme } from "../../../../types";
import themeObjs from "../MyChart/themes";
import { BarStyleConfigObj, ChartTitleObj, LabelObj, LabelPosition, LegendObj, LegendPosition, LineStyleConfigObj, LineStyleObjToValue, LineStyleType, PieLabelPosition, RotateObjToValue, RotateType, XAxisObj, YAxisObj } from "../types";
import { bigNumberFormatter } from "../utils";

// 关于样式初始化配置的几个方法
export function getTitleInitObj(title: string): ChartTitleObj {
    return {
        show: true,
        name: title,
    };
}

export function getLabelInitObj(color: string, initPosition: LabelPosition | PieLabelPosition = LabelPosition.Right): LabelObj {
    return {
        show: false,
        position: initPosition,
        fontSize: 12,
        color,
    };
}

export function getXAxisInitObj(lineColor: string, labelColor: string): XAxisObj {
    return {
        lineShow: true,
        lineColor,
        lineWidth: 1,
        lineType: LineStyleType.Solid,  // solid、dashed、dotted

        labelShow: true,
        labelFontSize: 12,
        labelColor,
        labelRotate: RotateType.Horizontal,  // -90 ~ 90
    };
}

export function getYAxisInitObj(lineColor: string, labelColor: string, splitColor: string): YAxisObj {
    return {
        titleShow: true,
        titleFontSize: 12,
        titleColor: labelColor,

        max: "",
        min: "",

        ...getXAxisInitObj(lineColor, labelColor),

        splitShow: true,
        splitType: LineStyleType.Dashed,
        splitWidth: 1,
        splitColor,
    };
}

export function getLegendInitObj(color: string): LegendObj {
    return {
        show: true,
        position: LegendPosition.Right,
        pages: true,
        fontSize: 12,
        color,
    };
}

// 关于获得echarts配置的几个方法
export function getEChartsTooltip(isPie: boolean = false, total?: number) {
    return {
        trigger: isPie ? 'item' : 'axis',
        formatter: isPie ? formatterFuncWithPie : formatterFunc
    };

    function formatterFunc(params: any) {
        let res = `<span style="font-size: 12px;">${params[0].name}</span> <br/>`
        for (const item of params) {
            if (item.value || item.value === 0) {
                res += `<div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="background: ${item.color}; 
                                        height: 8px; width: 8px; border-radius: 50%;
                                        display: inline-block; margin-right: 8px;
                                "></span>
                                <span style="font-size: 12px;" >${item.seriesName}</span>
                            </div>
                            <span style="font-size: 12px; margin-left: 20px" >${item.value}</span>
                        </div>`;
            }
        }
        return res;
    }
    function formatterFuncWithPie(param: any) {
        console.log(param)
        return `<div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="background: ${param.color}; 
                        height: 8px; width: 8px; border-radius: 50%;
                        display: inline-block; margin-right: 8px;
                "></span>
                <span style="font-size: 12px;" >${param.data.extraMsg ? param.data.extraMsg + "：" : ""}${param.data.name}</span>
            </div>
            <span style="font-size: 12px; margin-left: 20px" >${param.data.value}（${(param.data.value / total! * 100).toFixed(2)}%）</span>
        </div>`;
    }
}

export function getEChartsLogicXAxis(logicXAxis: XAxisObj, attrValues: string[]) {
    return {
        type: 'category',  // 固定写死
        data: attrValues,  // 维度的值
        axisLine: {  // 坐标轴线配置
            show: logicXAxis.lineShow,
            lineStyle: {
                color: logicXAxis.lineColor,
                width: logicXAxis.lineWidth,
                type: LineStyleObjToValue[logicXAxis.lineType],  // solid、dashed、dotted
            }
        },
        axisTick: {  // 刻度是否展现
            show: logicXAxis.lineShow
        },

        axisLabel: {  // 坐标轴标签配置
            show: logicXAxis.labelShow,
            fontSize: logicXAxis.labelFontSize,
            color: logicXAxis.labelColor,
            rotate: RotateObjToValue[logicXAxis.labelRotate],  // -90 ~ 90
        },
    };
}

export function getEChartsLogicYAxis(logicYAxis: YAxisObj, metrFields: string[]) {
    const calcLogicYAxis: any = {
        type: 'value',

        name: metrFields.join('/'),
        nameTextStyle: {
            color: logicYAxis.titleShow ? logicYAxis.titleColor : 'transparent',
            fontSize: logicYAxis.titleFontSize
        },
        nameLocation: 'middle',
        nameGap: 40,  // 放中间、与y轴有间隔，间隔40（后面grid的left与之有关）

        axisLine: {  // 坐标轴线配置
            show: logicYAxis.lineShow,
            lineStyle: {
                color: logicYAxis.lineColor,
                width: logicYAxis.lineWidth,
                type: LineStyleObjToValue[logicYAxis.lineType],  // solid、dashed、dotted
            }
        },
        axisTick: {  // 刻度是否展现
            show: logicYAxis.lineShow
        },

        axisLabel: {  // 坐标轴标签配置
            show: logicYAxis.labelShow,
            fontSize: logicYAxis.labelFontSize,
            color: logicYAxis.labelColor,
            rotate: RotateObjToValue[logicYAxis.labelRotate],  // -90 ~ 90
            formatter: bigNumberFormatter,
        },

        splitLine: {  // 栅格线
            show: logicYAxis.splitShow,
            lineStyle: {
                color: logicYAxis.splitColor,
                type: LineStyleObjToValue[logicYAxis.splitType],
                width: logicYAxis.splitWidth,
            },
        }
    };
    if (logicYAxis.max) calcLogicYAxis.max = logicYAxis.max;
    if (logicYAxis.min) calcLogicYAxis.min = logicYAxis.min;

    return calcLogicYAxis;
}

export function getEChartsLegend(legend: LegendObj, data: string[], icon: string | null = null, isNotCenter: boolean = false) {
    console.log(data);
    const res: any = {
        show: legend.show,
        data: data,
        ...calcPostion(legend.position, isNotCenter),
        textStyle: {
            fontSize: legend.fontSize,
            color: legend.color,
        },
        type: legend.pages ? "scroll" : "plain",
        formatter: function (name: string) {
            return name.length > 9 ? name.substring(0, 7) + "..." : name;
        },
        align: 'left',  // 图标在左，文字在右
        pageTextStyle: {
            color: legend.color
        }
    };
    if (icon) {
        if (icon === "myLine") {
            res.icon = "roundRect";
            res.itemHeight = 3;
            res.itemWidth = 20;
        } else {
            res.icon = icon;
        }
    }
    return res;
}
export function calcPostion(position: LegendPosition, isNotCenter: boolean) {
    if (position === LegendPosition.Left) {
        return {
            orient: 'vertical',  // vertical、horizontal
            left: 'left',  // left、center、right
            top: isNotCenter ? 'top' : 'middle',  // top、middle、bottom
        };
    } else if (position === LegendPosition.Right) {
        return {
            orient: 'vertical',
            left: 'right',
            top: isNotCenter ? 'top' : 'middle',
        };
    } else if (position === LegendPosition.Top) {
        return {
            orient: 'horizontal',
            left: isNotCenter ? 'left' : 'center',
            top: 'top',
        };
    } else {
        return {
            orient: 'horizontal',
            left: isNotCenter ? 'left' : 'center',
            top: 'bottom',
        };
    }
}

/**
 * 适合折线图
 */
export function getEChartsGrid(nameGap: number, position: LegendPosition, isLegendShow: boolean, isYTitleShow: boolean) {
    /**
     * 设置图表与容器四个方向的距离，考虑到legend的位置
     * 默认除了左侧外，值都为2%，左侧默认40（考虑yAxis.nameGap）
     * legend在哪个方向，相应的值就变成下面的数，其中left的128 = 88 + yAxis.nameGap
     */
    const res: any = {
        left: isYTitleShow ? nameGap : "4%",
        right: "4%",
        top: "4%",
        bottom: "4%",
        containLabel: true,
    }
    if (!isLegendShow) {
        return res;
    }
    else if (position === LegendPosition.Left) {
        if (isYTitleShow) res.left = nameGap + 88;
        else res.left = 88;
    } else if (position === LegendPosition.Right) {
        res.right = 88;
    } else if (position === LegendPosition.Top) {
        res.top = 44;
    } else {
        res.bottom = 40;
    }
    return res;
}

/**
 * 方方正正，饼图、雷达图四周都一致的grid
 */
export function getSquareEChartsGrid(position: LegendPosition, isLegendShow: boolean) {
    const res: any = {
        left: "4%",
        right: "4%",
        top: "4%",
        bottom: "4%",
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
        res.bottom = 44;
    }
    return res;
}


/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 * @param oldStyleConfig 
 * @param theme 
 */
export function getStyleConfigAfterUpdateTheme(oldStyleConfig: LineStyleConfigObj| BarStyleConfigObj, theme: PannelTheme): LineStyleConfigObj| BarStyleConfigObj {
    const themeConfig = themeObjs[theme];
    oldStyleConfig.label.color = themeConfig.graph.label.color;
    oldStyleConfig.xAxis.lineColor = themeConfig.categoryAxis.axisLine.lineStyle.color;
    oldStyleConfig.xAxis.labelColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.yAxis.lineColor = themeConfig.categoryAxis.axisLine.lineStyle.color;
    oldStyleConfig.yAxis.labelColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.yAxis.titleColor = themeConfig.categoryAxis.axisLabel.color;
    oldStyleConfig.yAxis.splitColor = themeConfig.categoryAxis.splitLine.lineStyle.color;
    oldStyleConfig.legend.color = themeConfig.legend.textStyle.color;
    return oldStyleConfig;
}
