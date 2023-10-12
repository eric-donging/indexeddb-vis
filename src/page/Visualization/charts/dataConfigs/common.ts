import Enumerable from "linq";
import { getDatasetInfoById } from "../../../../utils/datasetStorage";
import { FieldInAttribute, FieldInGroup, FieldInMetric, FieldWrapType } from "../../PannelDetail/components/ChartController/types";
import { DataConfig, DataItemConfig, DataMsg } from "./index";
import dbOperateIns from "../../../../utils/dbOperate";
import delay from "../../../../utils/delay";
import { AggregateWay, AttributeSortWay, MetricSortWay } from "../../PannelDetail/components/ChartController/dataComponents/ChartFieldItem";

export type CommonDataConfig = [
    {
        type: FieldWrapType.Attribute,
        fields: FieldInAttribute[]
    },
    {
        type: FieldWrapType.Metric,
        fields: FieldInMetric[]
    },
    {
        type: FieldWrapType.Group,
        fields: FieldInGroup[]
    }
];

/**
 * 数据配置渲染的Wrapper配置
 */
export const commonDataRenderConfig: DataItemConfig[] = [
    { title: "X轴", limit: 1, type: FieldWrapType.Attribute, allow: "all" },
    { title: "Y轴", limit: -1, type: FieldWrapType.Metric, allow: "all" },
    { title: "分组", limit: 1, type: FieldWrapType.Attribute, allow: "all" },
];

/**
 * 本地化存储折线图初始化数据配置
 */
export const commonInitDataConfig: CommonDataConfig = [
    { type: FieldWrapType.Attribute, fields: [] },
    { type: FieldWrapType.Metric, fields: [] },
    { type: FieldWrapType.Group, fields: [] },
];

/**
 * 数据配置是否可以渲染出图表
 */
export function isDataConfigOver(configs: DataConfig[], reverse: boolean = false): boolean {
    const idx1 = reverse ? 1 : 0;
    const idx2 = reverse ? 0 : 1;
    if (configs[idx1].fields.length > 0 && configs[idx2].fields.length > 0) {
        return true;
    }
    return false;
}

/**
 * 数据配置到折线图需要的数据
 * @param configs 
 * @returns 
 */
export async function dataConfigToData(configs: DataConfig[], reverse: boolean = false): Promise<DataMsg | false> {
    // await delay();

    // console.log('lineDataConfig', configs);
    const idx0 = reverse ? 1 : 0;
    const idx1 = reverse ? 0 : 1;

    const datasetId = configs[idx0].fields[0].datasetId;
    const info = getDatasetInfoById(datasetId);
    if (!info) {  // 找不到数据集返回false
        return false;
    }

    await dbOperateIns.init();
    const { error, data } = await dbOperateIns.executeSQL(info.dbName, info.sql);
    if (error) {  // sql查询错误返回false
        return false;
    }

    const metricLen = configs[idx1].fields.length;
    const attrF = configs[idx0].fields[0].field.fieldName;

    const attrSortWay = configs[idx0].fields[0].sortWay as AttributeSortWay;  // 维度排序方式

    // 维度值数组
    let attrValues: string[] = Enumerable.from<any>(data).select((el, idx) => {
        return el[attrF];
    }).distinct((el) => {
        if (Object.is(el, null) || Object.is(el, undefined)) {
            return '';
        }
        return el;
    }).toArray();

    // 根据维度的排序方式确定x轴字段
    sortAttrValues(attrSortWay, attrValues);

    // 根据度量的排序方式确定x轴字段
    if (attrSortWay === AttributeSortWay.Default) {  // 后续度量的排序可影响attrValues
        for (let i = 0; i < metricLen; i++) {
            const metrF = configs[idx1].fields[i].field.fieldName;
            const metrSortWay: MetricSortWay = configs[idx1].fields[i].sortWay as MetricSortWay;
            const metrAggregate = (configs[idx1].fields[i] as FieldInMetric).aggregateWay;
            const res: string[] = [];
            if (metrSortWay !== MetricSortWay.Default) {
                const temp = Enumerable.from<any>(data)
                    .groupBy<string, string, any>(
                        (e) => e[attrF],
                        (e) => e[metrF], (key, group) => {
                            return { [attrF]: key, [metrF]: aggregateData(metrAggregate, group) }  // 先默认sum聚合
                        });
                if (metrSortWay === MetricSortWay.Asc) {
                    temp.orderBy(e => e[metrF]).forEach(e => {
                        res.push(e[attrF]);
                    });
                } else {
                    temp.orderByDescending(e => e[metrF]).forEach(e => {
                        res.push(e[attrF]);
                    });
                }
                attrValues = res;
                break;
            }
        }
    }

    const metrFields: string[] = [];
    const values: (number | undefined)[][] = [];

    const groupField = configs[2]?.fields[0];
    // console.log('group', groupField);

    if (!groupField) {
        for (let i = 0; i < metricLen; i++) {
            const metrF = configs[idx1].fields[i].field.fieldName;
            const metrFPlus = metrF + '$';  // 避免维度度量两个字段相同
            const metrAggregate = (configs[idx1].fields[i] as FieldInMetric).aggregateWay;

            // console.log(attrF, metrF);
            const valueArr: (number | undefined)[] = new Array(attrValues.length).fill(undefined);;
            Enumerable.from<any>(data)
                .groupBy<string, string, any>(
                    (e) => e[attrF],
                    (e) => e[metrF], (key, group) => {
                        return { [attrF]: key, [metrFPlus]: aggregateData(metrAggregate, group) }  // 先默认sum聚合
                    })
                .forEach(d => {
                    const idx = attrValues.indexOf(d[attrF]);
                    console.log(d);
                    if (idx >= 0) {
                        valueArr[idx] = d[metrFPlus];
                    }
                });
            metrFields.push(metrF);
            values.push(valueArr);
            console.log(valueArr);
        }
    } else {
        // 有分组
        const groupName = groupField.field.fieldName;
        const groupValues = Enumerable.from<any>(data).select((el, idx) => {
            return el[groupName];
        }).distinct((el) => {
            if (Object.is(el, null) || Object.is(el, undefined)) {
                return '';
            }
            return el;
        }).toArray();

        const groupSortWay = configs[2].fields[0].sortWay as AttributeSortWay;  // 维度排序方式
        sortAttrValues(groupSortWay, groupValues);

        for (const groupValue of groupValues) {
            for (let i = 0; i < metricLen; i++) {
                const metrF = configs[idx1].fields[i].field.fieldName;
                const metrFPlus = metrF + '$';  // 避免维度度量两个字段相同
                const metrAggregate = (configs[idx1].fields[i] as FieldInMetric).aggregateWay;

                const valueArr: (number | undefined)[] = new Array(attrValues.length).fill(undefined);

                Enumerable.from<any>(data)
                    .where(e => e[groupName] === groupValue)
                    .groupBy<string, string, any>(
                        (e) => e[attrF],
                        (e) => e[metrF], (key, group) => {
                            return { [attrF]: key, [metrFPlus]: aggregateData(metrAggregate, group) }  // 先默认sum聚合
                        })
                    .forEach(d => {
                        const idx = attrValues.indexOf(d[attrF]);
                        if (idx >= 0) {
                            valueArr[idx] = d[metrFPlus];
                        }
                    });
                metrFields.push(`${groupValue}: ${metrF}`);
                values.push(valueArr);
            }
        }

    }

    return {
        attrValues,
        metrFields,
        values,
    }
}

// 传入group和维度聚合方式，返回结果
export function aggregateData(aggregateWay: AggregateWay, group: Enumerable.IEnumerable<string>): number {
    switch (aggregateWay) {
        case AggregateWay.Avg:
            return group.average();
        case AggregateWay.Count:
            return group.count();
        case AggregateWay.DistinctCount:
            return group.distinct().count();
        case AggregateWay.Max:
            return group.max();
        case AggregateWay.Min:
            return group.min();
        case AggregateWay.Sum:
            return group.sum();
        default:
            return group.sum();
    }
}
// 传入维度值数组，对维度值数组排序
export function sortAttrValues(sortWay: AttributeSortWay, arr: string[]) {
    if (sortWay === AttributeSortWay.Asc) {
        arr.sort();
    } else if (sortWay === AttributeSortWay.Desc) {
        arr.sort().reverse();
    }
}
