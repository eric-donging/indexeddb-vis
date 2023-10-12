import { Field } from "../../../../Dataset/ManageSet";
import { AggregateWay, AttributeSortWay, MetricSortWay } from "./dataComponents/ChartFieldItem";

export enum FieldWrapType {
    Attribute = "维度",
    Metric = "度量",
    Group = "分组",
}

/**
 * 字段设置
 */
export interface FieldSet {
    /**
     * 别名
     */
    alias: string
    description: string
}

/**
 * 在类型是维度的FieldsWrapper，每个字段的信息
 */
export interface FieldInAttribute {
    /**
     * 字段名和类型信息
     */
    field: Field
    /**
     * 属于的数据集id
     */
    datasetId: string
    fieldSet: FieldSet
    sortWay: AttributeSortWay
}

/**
 * 在类型是度量的FieldsWrapper，每个字段的信息
 */
export interface FieldInMetric {
    /**
     * 字段名和类型信息
     */
    field: Field
    /**
     * 属于的数据集id
     */
    datasetId: string
    fieldSet: FieldSet
    aggregateWay: AggregateWay
    sortWay: MetricSortWay
}

/**
 * 在类型是维度的FieldsWrapper，每个字段的信息
 */
export interface FieldInGroup {
    /**
     * 字段名和类型信息
     */
    field: Field
    /**
     * 属于的数据集id
     */
    datasetId: string
    fieldSet: FieldSet
    sortWay: AttributeSortWay
}

export type FieldInWrap = FieldInAttribute | FieldInMetric | FieldInGroup
