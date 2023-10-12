import { DataConfig, DataItemConfig } from "./index";
import { isDataConfigOver as commonIsDataConfigOver, dataConfigToData as commonDataConfigToData } from "./common";
import { FieldInAttribute, FieldInGroup, FieldInMetric, FieldWrapType } from "../../PannelDetail/components/ChartController/types";

export type RowBarDataConfig = [
    {
        type: FieldWrapType.Metric,
        fields: FieldInMetric[]
    },
    {
        type: FieldWrapType.Attribute,
        fields: FieldInAttribute[]
    },
    {
        type: FieldWrapType.Group,
        fields: FieldInGroup[]
    }
];

/**
 * 数据配置渲染的Wrapper配置
 */
export const dataRenderConfig: DataItemConfig[] = [
    { title: "X轴", limit: -1, type: FieldWrapType.Metric, allow: "all" },
    { title: "Y轴", limit: 1, type: FieldWrapType.Attribute, allow: "all" },
    { title: "分组", limit: 1, type: FieldWrapType.Attribute, allow: "all" },
];

/**
 * 本地化存储折线图初始化数据配置
 */
export const rowBarInitDataConfig: RowBarDataConfig = [
    { type: FieldWrapType.Metric, fields: [] },
    { type: FieldWrapType.Attribute, fields: [] },
    { type: FieldWrapType.Group, fields: [] },
];

export function isDataConfigOver(configs: DataConfig[]) {
    return commonIsDataConfigOver(configs, true);
}

export function dataConfigToData(configs: DataConfig[]) {
    return commonDataConfigToData(configs, true);
}
