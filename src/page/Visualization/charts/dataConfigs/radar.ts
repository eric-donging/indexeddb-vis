import { DataItemConfig } from "./index";
import { CommonDataConfig, commonDataRenderConfig, commonInitDataConfig } from "./common";

export type RadarDataConfig = CommonDataConfig;

/**
 * 数据配置渲染的Wrapper配置
 */
export const dataRenderConfig: DataItemConfig[] = commonDataRenderConfig;

/**
 * 本地化存储折线图初始化数据配置
 */
export const radarInitDataConfig: RadarDataConfig = commonInitDataConfig;

export { isDataConfigOver, dataConfigToData } from "./common";
