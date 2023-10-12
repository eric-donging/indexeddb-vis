import { CSSProperties } from 'react';
import { match } from 'react-router';
import * as H from 'history';

export interface MyRouteComponentProps {
    history?: H.History
    location?: H.Location
    match?: match
}

export interface ClassAndStyle {
    className?: string
    style?: CSSProperties
}

/**
 * sql类型枚举
 */
export enum FieldType {
    string = 'string',
    number = 'number',
    dateTime = 'date_time',
    object = 'object',
    array = 'array',
    boolean = 'boolean'
}

/**
 * 数据库表每一个字段对应的信息
 */
export interface ColInfo {
    key: string
    colName: string
    type: FieldType | ''
    isNull: boolean
    isPrimary: boolean
    default?: any
    autoIncrement?: boolean
}

/**
 * 拖拽的类型
 */
export const DragItemTypes = {
    SetField: Symbol("set-field"),
    ChartField: Symbol("chart-field"),
}

/**
 * 仪表盘主题
 */
export enum PannelTheme {
    Walden = "图表默认主题",
    Vintage = "vintage主题",
    Westeros = "westeros主题",
    Wonderland = "wonderland主题",
    Dark = "dark主题",
    Chalk = "chalk主题",
    PurplePassion = "purple-passion主题",
}