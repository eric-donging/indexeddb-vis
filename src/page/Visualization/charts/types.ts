import { BarType } from "./styleConfigs/bar";
import { LineType } from "./styleConfigs/line"

export enum ChartType {
    Table = "icon-biaoge",
    Card = "icon-zhibiaoka",
    Line = "icon-zhexiantu",
    Bar = "icon-zhuzhuangtu",
    RowBar = "icon-tiaozhuangtu",
    Pie = "icon-bingtu",
    Scatter = "icon-sandiantu",
    Funnel = "icon-loudoutu",
    Radar = "icon-leidatu",
    Sankey = "icon-sangjitu-copy",
    Cloud = "icon-ciyun",
    // Parallel = "icon-pinghangzuobiaoxi"
}

/**
 * 样式配置的类型，对应渲染的一块
 */
export enum StyleConfigRenderTypes {
    ChartTitle = "图表标题",
    ContentLineStyle = "折线样式",
    BarStyle = "柱形样式",
    PieStyle = "饼图样式",
    RadarStyle = "雷达图样式",
    Label = "数据标签",
    XAxis = "X 轴",
    YAxis = "Y 轴",
    RadarAxis = "坐标轴",
    Legend = "图例",
    CardTarget = "指标",
    CardFontSize = "固定字体大小",
}

export enum LineStyleType {
    Solid = "实线",
    Dashed = "虚线",
    Dotted = "点",
}
export const LineStyleObjToValue = {
    [LineStyleType.Solid]: "solid",
    [LineStyleType.Dashed]: "dashed",
    [LineStyleType.Dotted]: "dotted",
};
export enum RotateType {
    Horizontal = "水平",
    Vertical = "垂直",
    Inclined = "倾斜",

}
export const RotateObjToValue = {
    [RotateType.Horizontal]: 0,
    [RotateType.Vertical]: 90,
    [RotateType.Inclined]: 45,
}
export enum LegendPosition {
    Top = "上方",
    Right = "右方",
    Bottom = "下方",
    Left = "左方",
}
export enum LabelPosition {
    Top = "上",
    Bottom = "下",
    Left = "左",
    Right = "右",
    Center = "中",
}
export const LabelObjToValue = {
    [LabelPosition.Top]: "top",
    [LabelPosition.Bottom]: "bottom",
    [LabelPosition.Left]: "left",
    [LabelPosition.Right]: "right",
    [LabelPosition.Center]: "inside",
}
export enum PieLabelPosition {
    Inside = "内部",
    Outside = "外部",
}
export const PieObjToValue = {
    [PieLabelPosition.Inside]: "inside",
    [PieLabelPosition.Outside]: "outside",
}
export enum RadarType {
    Polygon = "多边形",
    Circle = "圆形",
}
export const RadarObjToValue = {
    [RadarType.Polygon]: "polygon",
    [RadarType.Circle]: "circle",
}


// 写一下样式配置每一项的类型
export interface ChartTitleObj {
    show: boolean
    name: string
}

export interface ContentLineStyleObj {
    lineWidth: number
    lineType: LineType
}

export interface BarStyleObj {
    barType: BarType
}

export interface PieStyleObj {
    size: [number, number]
}

export interface RadarStyleObj {
    shape: RadarType
    size: number
    showDot: boolean
    showShadow: boolean
}

export interface LabelObj {
    show: boolean
    position: LabelPosition | PieLabelPosition
    fontSize: number
    color: string
}

interface Axis {
    lineShow: boolean
    lineColor: string
    lineWidth: number
    lineType: LineStyleType // solid、dashed、dotted

    labelShow: boolean
    labelFontSize: number
    labelColor: string
    labelRotate: RotateType  // -90 ~ 90
}

export interface XAxisObj extends Axis { }

export interface YAxisObj extends Axis {
    titleShow: boolean
    titleFontSize: number
    titleColor: string
    max: string | number
    min: string | number
    splitShow: boolean
    splitType: LineStyleType
    splitWidth: number
    splitColor: string
}

export interface RadarAxisObj {
    labelShow: boolean
    labelFontSize: number
    labelColor: string
    labelRotate: RotateType  // -90 ~ 90

    splitNumber: number
    splitType: LineStyleType
    splitWidth: number
    splitColor: string
    splitAreaShow: boolean
}

export interface LegendObj {
    show: boolean
    position: LegendPosition
    pages: boolean
    fontSize: number
    color: string
}

export interface CardTargetObj {
    centerShow: boolean
    centerColor: string
    prefix: string
    priColor: string
    suffix: string
    sufColor: string
}
export interface CardFontSizeObj {
    open: boolean
    mainSize: number
    viceSize: number
}

export interface StyleConfigObj {
    chartTitle: ChartTitleObj
    contentLineStyle: ContentLineStyleObj
    barStyle: BarStyleObj
    pieStyle: PieStyleObj
    radarStyle: RadarStyleObj
    label: LabelObj
    legend: LegendObj
    xAxis: XAxisObj
    yAxis: YAxisObj
    radarAxis: RadarAxisObj
    cardTarget1: CardTargetObj
    cardTarget2: CardTargetObj
    cardTarget3: CardTargetObj
    cardFontSize: CardFontSizeObj
}

export type AllObjType = ChartTitleObj | ContentLineStyleObj | BarStyleObj | PieStyleObj | RadarStyleObj | LabelObj | LegendObj
    | XAxisObj | YAxisObj | RadarAxisObj | CardTargetObj | CardFontSizeObj;

// 之后还要修改
export type LineStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "contentLineStyle" | "label" | "xAxis" | "yAxis" | "legend">]: StyleConfigObj[prop]
};
export type BarStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "barStyle" | "label" | "xAxis" | "yAxis" | "legend">]: StyleConfigObj[prop]
};
export type RowBarStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "barStyle" | "label" | "legend">]: StyleConfigObj[prop]
} & {
    xAxis: YAxisObj
    yAxis: XAxisObj
};
export type PieStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "pieStyle" | "label" | "legend">]: StyleConfigObj[prop]
};
export type RadarStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "radarStyle" | "label" | "radarAxis" | "legend">]: StyleConfigObj[prop]
};
export type CardStyleConfigObj = {
    [prop in Extract<keyof StyleConfigObj, "chartTitle" | "cardFontSize">]: StyleConfigObj[prop]
} & {
    cardTarget1: StyleConfigObj["cardTarget1"],
    cardTarget2: StyleConfigObj["cardTarget2"],
    cardTarget3: StyleConfigObj["cardTarget3"],
};
