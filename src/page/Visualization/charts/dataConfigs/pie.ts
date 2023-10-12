import { DataItemConfig } from "./index";
import { FieldWrapType, FieldInMetric, FieldInGroup } from "../../PannelDetail/components/ChartController/types";

export type PieDataConfig = [
    {
        type: FieldWrapType.Group,
        fields: FieldInGroup[]
    },
    {
        type: FieldWrapType.Metric,
        fields: FieldInMetric[]
    },
];

/**
 * 数据配置渲染的Wrapper配置
 */
export const dataRenderConfig: DataItemConfig[] = [
    { title: "分组", limit: 1, type: FieldWrapType.Attribute, allow: "all" },
    { title: "数值", limit: -1, type: FieldWrapType.Metric, allow: "all" },
];

/**
 * 本地化存储折线图初始化数据配置
 */
export const pieInitDataConfig: PieDataConfig = [
    { type: FieldWrapType.Group, fields: [] },
    { type: FieldWrapType.Metric, fields: [] },
];

export { isDataConfigOver, dataConfigToData } from "./common";
