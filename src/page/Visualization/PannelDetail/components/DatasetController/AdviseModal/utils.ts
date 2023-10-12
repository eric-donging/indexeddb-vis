import { Advice } from "@antv/ava";
import { ChartType } from "../../../../charts/types";
import { DataConfig } from "../../../../charts/dataConfigs";
import { Field } from "../../../../../Dataset/ManageSet";
import { FieldWrapType } from "../../ChartController/types";
import { AggregateWay, AttributeSortWay, MetricSortWay } from "../../ChartController/dataComponents/ChartFieldItem";

/**
 * 可以推荐哪些图表
 */
export const canAdviseCharts = {
    include: ["line_chart", "bar_chart", "percent_stacked_bar_chart", "column_chart", "percent_stacked_column_chart",
        "pie_chart", "scatter_plot", "funnel_chart", "radar_chart", "sankey_diagram", "wordcloud"]
};

/**
 * 从数组中挑选m个元素，获得全部组合
 * @param arr 数组
 * @param m 选m个元素
 * @returns 
 */
export function combine<T>(arr: T[], m: number): T[][] {
    const result: T[][] = [];
    const dfs = (start: number, temp: T[]) => {
        if (temp.length === m) {
            result.push(temp.slice());
            return;
        }
        for (let i = start; i < arr.length; i++) {
            temp.push(arr[i]);
            dfs(i + 1, temp);
            temp.pop();
        }
    };
    for (let i = 1; i <= arr.length; i++) {
        dfs(0, []);
    }
    return result;
}

/**
 * ava类型转换成项目类型
 * @param type 
 * @returns 
 */
export function mapType(type: string): ChartType {
    switch (type) {
        case "line_chart":
            return ChartType.Line;
        case "bar_chart":
            return ChartType.Bar;
        case "percent_stacked_bar_chart":
            return ChartType.Bar;
        case "column_chart":
            return ChartType.RowBar;
        case "percent_stacked_column_chart":
            return ChartType.RowBar;
        case "pie_chart":
            return ChartType.Pie;
        case "scatter_plot":
            return ChartType.Scatter;
        case "funnel_chart":
            return ChartType.Funnel;
        case "radar_chart":
            return ChartType.Radar;
        case "sankey_diagram":
            return ChartType.Sankey;
        case "wordcloud":
            return ChartType.Cloud;
        default:
            return ChartType.Line;
    }
}

/**
 * 获得推荐图表的数据配置
 * @param type 
 * @param adviseInfo 
 * @param fieldsInfo 
 * @returns 
 */
export function getAdviseDataConfig(type: ChartType, adviseInfo: Advice, fieldsInfo: Field[], datasetId: string): any {
    const commonObj = {
        datasetId: datasetId,
        fieldSet: {
            alias: '',
            description: ''
        },
    }

    const x = adviseInfo.spec?.encode.x;
    const y = adviseInfo.spec?.encode.y;
    const color = adviseInfo.spec?.encode.color;
    const xField = fieldsInfo.find(info => info.fieldName === x);
    const yField = fieldsInfo.find(info => info.fieldName === y);
    const colorField = fieldsInfo.find(info => info.fieldName === color);

    switch (type) {
        case ChartType.Bar:
        case ChartType.Line:
        case ChartType.Radar:
            return [
                { type: FieldWrapType.Attribute, fields: [{ ...commonObj, sortWay: AttributeSortWay.Default, field: xField! }] },
                { type: FieldWrapType.Metric, fields: [{ ...commonObj, aggregateWay: AggregateWay.Sum, sortWay: MetricSortWay.Default, field: yField! }] },
                { type: FieldWrapType.Group, fields: colorField ? [{ ...commonObj, sortWay: AttributeSortWay.Default, field: colorField }] : [] },
            ];
        case ChartType.RowBar:
            return [
                { type: FieldWrapType.Metric, fields: [{ ...commonObj, aggregateWay: AggregateWay.Sum, sortWay: MetricSortWay.Default, field: yField! }] },
                { type: FieldWrapType.Attribute, fields: [{ ...commonObj, sortWay: AttributeSortWay.Default, field: xField! }] },
                { type: FieldWrapType.Group, fields: colorField ? [{ ...commonObj, sortWay: AttributeSortWay.Default, field: colorField }] : [] },
            ];
        case ChartType.Pie:
            return [
                { type: FieldWrapType.Group, fields: [{ ...commonObj, sortWay: AttributeSortWay.Default, field: colorField }] },
                { type: FieldWrapType.Metric, fields: [{ ...commonObj, aggregateWay: AggregateWay.Sum, sortWay: MetricSortWay.Default, field: yField! }] },
            ];
        default:
            return [];
    }
}
