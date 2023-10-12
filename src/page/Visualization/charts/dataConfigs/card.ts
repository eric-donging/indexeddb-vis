import { DataConfig, DataItemConfig, DataMsg } from "./index";
import { aggregateData } from "./common";
import { FieldInMetric, FieldWrapType } from "../../PannelDetail/components/ChartController/types";
import { getDatasetInfoById } from "../../../../utils/datasetStorage";
import dbOperateIns from "../../../../utils/dbOperate";
import Enumerable from "linq";

export type CardDataConfig = [{
    type: FieldWrapType.Metric,
    fields: FieldInMetric[]
}];

/**
 * 数据配置渲染的Wrapper配置
 */
export const dataRenderConfig: DataItemConfig[] = [
    { title: "指标", limit: 3, type: FieldWrapType.Metric, allow: "all" },
];

/**
 * 本地化存储折线图初始化数据配置
 */
export const cardInitDataConfig: CardDataConfig = [
    { type: FieldWrapType.Metric, fields: [] },
];

export function isDataConfigOver(configs: DataConfig[]): boolean {
    if (configs[0].fields.length > 0) {
        return true;
    }
    return false;
}

export async function dataConfigToData(configs: DataConfig[]): Promise<DataMsg | false> {
    // await delay();

    // console.log('lineDataConfig', configs);

    const datasetId = configs[0].fields[0].datasetId;
    const info = getDatasetInfoById(datasetId);
    if (!info) {  // 找不到数据集返回false
        return false;
    }

    await dbOperateIns.init();
    const { error, data } = await dbOperateIns.executeSQL(info.dbName, info.sql);
    if (error) {  // sql查询错误返回false
        return false;
    }

    const metricLen = configs[0].fields.length;
    const cacheArr = [];
    let values: any;
    const metrFields: string[] = [];

    for (let i = 0; i < metricLen; i++) {
        const metrF = configs[0].fields[i].field.fieldName;
        const metrAggregate = (configs[0].fields[i] as FieldInMetric).aggregateWay;
        const group = Enumerable.from<any>(data)
            .select((el, idx) => {
                return el[metrF];
            });
        const value = aggregateData(metrAggregate, group);
        cacheArr.push(value);
        metrFields.push(metrF);
    }
    if (cacheArr.length === 1) {
        values = [undefined, cacheArr[0], undefined];
    } else if (cacheArr.length === 2) {
        values = [cacheArr[0], cacheArr[1], undefined];
    } else {
        values = cacheArr as any;
    }

    return {
        attrValues: [],
        metrFields,
        values,
    }
}
