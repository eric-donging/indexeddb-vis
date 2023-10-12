import React, { useCallback, useContext } from "react";
import { Switch, Select, InputNumber } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import { valueType } from "antd/es/statistic/utils";
import commonStyles from "../common.module.css";
import { ChartType, LineStyleType, RotateType, XAxisObj, YAxisObj } from "../../../../../charts/types";
import { useCollapse } from "../hooks";
import { isFormEventType, isLineStyleType, isRotateType, sizeArr } from "../util";
import { styleConfigCtx } from "../../../..";
import { LineType } from "../../../../../charts/styleConfigs/line";

export type MyEvent = React.FormEvent | number | null | boolean | string;
export type LineEvent = React.FormEvent | boolean | LineType | number | string | null;
export type LabelEvent = React.FormEvent | boolean | number | RotateType;
export type SplitEvent = React.FormEvent | boolean | number | LineStyleType | null;
export type MaxType = null | undefined | valueType;
export type MinType = MaxType;
export type TitleType = React.FormEvent | boolean | number;

interface IProps {
    type: "X" | "Y"
    // axis: XAxisObj | YAxisObj
    // onChange?: (newObj: XAxisObj | YAxisObj) => void
}

const getLabelFontOptions = () => sizeArr.map(size => {
    return <Select.Option key={size} value={size} className={commonStyles.fs12}>{size}</Select.Option>;
});
const getLineStyleOptions = () => Object.keys(LineStyleType).map(type => {
    return <Select.Option key={type} value={(LineStyleType as any)[type]} className={commonStyles.fs12}>{(LineStyleType as any)[type]}</Select.Option>;
});
const rotateOptions = Object.keys(RotateType).map((r) => {
    return <Select.Option key={r} value={(RotateType as any)[r]} className={commonStyles.fs12}>{(RotateType as any)[r]}</Select.Option>;
});

const ControlAxis: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, chartType, changeStyleConfig } = useContext(styleConfigCtx);
    let axis: XAxisObj | YAxisObj;
    let editPropName: string;
    let isShowPlusContent: boolean;
    if (props.type === "X") {
        if (chartType === ChartType.RowBar) {
            axis = styleConfig!.xAxis as YAxisObj;
            isShowPlusContent = true;
        }
        else {
            axis = styleConfig!.xAxis as XAxisObj;
            isShowPlusContent = false;
        }
        editPropName = "xAxis";
    }
    else {
        if (chartType === ChartType.RowBar) {
            axis = styleConfig!.yAxis as XAxisObj;
            isShowPlusContent = false;
        }
        else {
            axis = styleConfig!.yAxis as YAxisObj;
            isShowPlusContent = true;
        }
        editPropName = "yAxis";
    }

    const handleLineChange = useCallback((e: LineEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, lineShow: e } });
        } else if (isLineStyleType(e)) {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, lineType: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, lineWidth: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, lineColor: color } });
        }
    }, [axis, changeStyleConfig, editPropName]);

    const handleLabelChange = useCallback((e: LabelEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, labelShow: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, labelFontSize: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, labelColor: color } });
        } else if (isRotateType(e)) {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, labelRotate: e } });
        }
    }, [axis, changeStyleConfig, editPropName]);

    const handleSplitChange = useCallback((e: SplitEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, splitShow: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, splitWidth: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, splitColor: color } });
        } else if (isLineStyleType(e)) {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, splitType: e } });
        }
    }, [axis, changeStyleConfig, editPropName]);

    const handleMax = useCallback((e: MaxType) => {
        if (typeof e === "number")
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, max: e } });
        else if (Object.is(e, null))
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, max: "" } });
    }, [axis, changeStyleConfig, editPropName]);

    const handleMin = useCallback((e: MinType) => {
        if (typeof e === "number")
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, min: e } });
        else if (Object.is(e, null))
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, min: "" } });
    }, [axis, changeStyleConfig, editPropName]);

    const handleTitleChange = useCallback((e: TitleType) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, titleShow: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, titleFontSize: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...axis!, titleColor: color } });
        }
    }, [axis, changeStyleConfig, editPropName]);


    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>{`${props.type}轴`}</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            {isShowPlusContent ? (<>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>标题</div>
                    <Switch checked={(axis as YAxisObj).titleShow} size="small" onChange={handleTitleChange} />
                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>字体大小</div>
                    <Select
                        size='small'
                        value={(axis as YAxisObj).titleFontSize}
                        className={commonStyles.select}
                        onChange={handleTitleChange}
                        disabled={!(axis as YAxisObj).titleShow}
                    >
                        {getLabelFontOptions()}
                    </Select>
                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>文本颜色</div>
                    <input type="color" value={(axis as YAxisObj).titleColor} onChange={handleTitleChange}
                        disabled={!(axis as YAxisObj).titleShow}
                        className={cn(commonStyles.color, (axis as YAxisObj).titleShow ? '' : commonStyles.disColor)} />
                </div>

                <div className={cn(commonStyles.item, commonStyles.mt10)}>
                    <div className={commonStyles.tip}>最大值</div>
                    <InputNumber className={commonStyles.inputNum} size="small"
                        value={(axis as YAxisObj).max} onChange={handleMax} />
                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>最小值</div>
                    <InputNumber className={commonStyles.inputNum} size="small"
                        value={(axis as YAxisObj).min} onChange={handleMin} />
                </div>
            </>) : null}

            <div className={cn(commonStyles.item, isShowPlusContent ? commonStyles.mt10 : "")}>
                <div className={commonStyles.tip}>坐标轴</div>
                <Switch checked={axis.lineShow} size="small" onChange={handleLineChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>样式</div>
                <Select
                    size='small'
                    value={axis.lineType}
                    className={commonStyles.select}
                    onChange={handleLineChange}
                    disabled={!axis.lineShow}
                >
                    {getLineStyleOptions()}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>线宽</div>
                <InputNumber className={commonStyles.inputNum} size="small" min={1} addonAfter="px"
                    disabled={!axis.lineShow} value={axis.lineWidth} onChange={handleLineChange} />

            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>颜色</div>
                <input type="color" value={axis.lineColor} onChange={handleLineChange} disabled={!axis.lineShow}
                    className={cn(commonStyles.color, axis.lineShow ? '' : commonStyles.disColor)} />
            </div>

            <div className={cn(commonStyles.item, commonStyles.mt10)}>
                <div className={commonStyles.tip}>轴标签</div>
                <Switch checked={axis.labelShow} size="small" onChange={handleLabelChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>字体大小</div>
                <Select
                    size='small'
                    value={axis.labelFontSize}
                    className={commonStyles.select}
                    onChange={handleLabelChange}
                    disabled={!axis.labelShow}
                >
                    {getLabelFontOptions()}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>文本颜色</div>
                <input type="color" value={axis.labelColor} disabled={!axis.labelShow}
                    className={cn(commonStyles.color, axis.labelShow ? '' : commonStyles.disColor)} onChange={handleLabelChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>旋转</div>
                <Select
                    size='small'
                    value={axis.labelRotate}
                    className={commonStyles.select}
                    onChange={handleLabelChange}
                    disabled={!axis.labelShow}
                >
                    {rotateOptions}
                </Select>
            </div>

            {isShowPlusContent ? (<>
                <div className={cn(commonStyles.item, commonStyles.mt10)}>
                    <div className={commonStyles.tip}>网格线</div>
                    <Switch checked={(axis as YAxisObj).splitShow} size="small" onChange={handleSplitChange} />
                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>样式</div>
                    <Select
                        size='small'
                        value={(axis as YAxisObj).splitType}
                        className={commonStyles.select}
                        onChange={handleSplitChange}
                        disabled={!(axis as YAxisObj).splitShow}
                    >
                        {getLineStyleOptions()}
                    </Select>
                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>线宽</div>
                    <InputNumber className={commonStyles.inputNum} size="small" min={1} addonAfter="px"
                        value={(axis as YAxisObj).splitWidth} onChange={handleSplitChange}
                        disabled={!(axis as YAxisObj).splitShow}
                    />

                </div>
                <div className={commonStyles.item}>
                    <div className={commonStyles.tip}>颜色</div>
                    <input type="color" value={(axis as YAxisObj).splitColor} onChange={handleSplitChange} disabled={!(axis as YAxisObj).splitShow}
                        className={cn(commonStyles.color, (axis as YAxisObj).splitShow ? '' : commonStyles.disColor)} />
                </div>
            </>) : null}
        </div>
    </div>);
};

export default React.memo(ControlAxis);
