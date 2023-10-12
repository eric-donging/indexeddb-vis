import { EChartsOption } from "echarts-for-react";
import { PannelTheme } from "../../../../types";
import { DataMsg } from "../dataConfigs";
import { CardStyleConfigObj, StyleConfigRenderTypes } from "../types";
import { getTitleInitObj } from "./common";
import themeObjs from "../MyChart/themes";

/**
 * 应该渲染的样式配置类型
 */
export const styleConfigRenderItems: StyleConfigRenderTypes[] = [
    StyleConfigRenderTypes.ChartTitle, StyleConfigRenderTypes.CardTarget,
    StyleConfigRenderTypes.CardFontSize
];

/**
 * 获得指标卡初始化样式配置
 * 注意：此配置不是echarts的配置，而是和ChartsController渲染各表单所需的样式
 * @param title 
 * @returns 
 */
export function getInitStyleConfig(title: string, theme: PannelTheme): CardStyleConfigObj {
    const themeConfig = themeObjs[theme];
    const mainColor = themeConfig.title.textStyle.color;
    const viceColor = themeConfig.title.subtextStyle.color;

    const commonObj = {
        centerShow: true,
        centerColor: viceColor,
        prefix: '',
        priColor: viceColor,
        suffix: '',
        sufColor: viceColor,
    };

    return {
        // 图表标题
        chartTitle: getTitleInitObj(title),

        cardTarget1: commonObj,
        cardTarget2: {
            ...commonObj,
            centerColor: mainColor,
        },
        cardTarget3: commonObj,

        cardFontSize: {
            open: true,
            mainSize: 48,
            viceSize: 18,
        }
    }
};

/**
 * 当仪表盘主题改变时，styleConfig的所有颜色值跟着改变
 * @param oldStyleConfig 
 * @param theme 
 */
export function getStyleConfigAfterUpdateTheme(oldStyleConfig: CardStyleConfigObj, theme: PannelTheme): CardStyleConfigObj {
    const themeConfig = themeObjs[theme];
    const mainColor = themeConfig.title.textStyle.color;
    const viceColor = themeConfig.title.subtextStyle.color;

    for (let i = 0; i < 3; i++) {
        (oldStyleConfig as any)["cardTarget" + (i + 1)].centerColor = viceColor;
        (oldStyleConfig as any)["cardTarget" + (i + 1)].priColor = viceColor;
        (oldStyleConfig as any)["cardTarget" + (i + 1)].sufColor = viceColor;
        if (i === 1) (oldStyleConfig as any)["cardTarget" + (i + 1)].centerColor = mainColor;
    }

    return oldStyleConfig;
}

/**
 * 图表样式配置到echarts配置
 * @param styleConfig 
 * @returns 
 */
export function styleConfigToEChartsConfig(styleConfig: CardStyleConfigObj, dataMsg: DataMsg): EChartsOption {
    return {
        ...styleConfig,
        centerData: dataMsg.values,
    };
}
