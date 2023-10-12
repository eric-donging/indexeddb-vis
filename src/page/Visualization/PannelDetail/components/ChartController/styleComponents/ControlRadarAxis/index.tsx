import React, { useCallback, useContext } from "react";
import { Switch, Select, InputNumber } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { LineStyleType, RotateType } from "../../../../../charts/types";
import { useCollapse } from "../hooks";
import { isFormEventType, isLineStyleType, isRotateType, sizeArr } from "../util";
import { styleConfigCtx } from "../../../..";
import { LineType } from "../../../../../charts/styleConfigs/line";

export type LineEvent = React.FormEvent | boolean | LineType | number | string | null;
export type LabelEvent = React.FormEvent | boolean | number | RotateType;

interface IProps {
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

const ControlRadarAxis: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { radarAxis } = styleConfig!;

    const handleLabelChange = useCallback((e: LabelEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, labelShow: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, labelFontSize: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, labelColor: color } });
        } else if (isRotateType(e)) {
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, labelRotate: e } });
        }
    }, [radarAxis, changeStyleConfig]);

    const handleCountChange = useCallback((e: number | null) => {
        if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, splitNumber: e } });
        }
    }, [changeStyleConfig, radarAxis]);

    const handleLineChange = useCallback((e: LineEvent) => {
        if (typeof e === "boolean") {
            console.log(e);
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, splitAreaShow: e } });
        } else if (isLineStyleType(e)) {
            console.log(e);
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, splitType: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, splitWidth: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ radarAxis: { ...radarAxis!, splitColor: color } });
        }
    }, [radarAxis, changeStyleConfig]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>坐标轴</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>轴标签</div>
                <Switch checked={radarAxis!.labelShow} size="small" onChange={handleLabelChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>字体大小</div>
                <Select
                    size='small'
                    value={radarAxis!.labelFontSize}
                    className={commonStyles.select}
                    onChange={handleLabelChange}
                    disabled={!radarAxis!.labelShow}
                >
                    {getLabelFontOptions()}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>文本颜色</div>
                <input type="color" value={radarAxis!.labelColor} disabled={!radarAxis!.labelShow}
                    className={cn(commonStyles.color, radarAxis!.labelShow ? '' : commonStyles.disColor)} onChange={handleLabelChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>旋转</div>
                <Select
                    size='small'
                    value={radarAxis!.labelRotate}
                    className={commonStyles.select}
                    onChange={handleLabelChange}
                    disabled={!radarAxis!.labelShow}
                >
                    {rotateOptions}
                </Select>
            </div>

            <div className={cn(commonStyles.item, commonStyles.mt10)}>
                <div className={commonStyles.tip}>网格线</div>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>轴段数</div>
                <InputNumber className={commonStyles.inputNum} size="small"
                    value={radarAxis!.splitNumber} onChange={handleCountChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>样式</div>
                <Select
                    size='small'
                    value={radarAxis!.splitType}
                    className={commonStyles.select}
                    onChange={handleLineChange}
                >
                    {getLineStyleOptions()}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>线宽</div>
                <InputNumber className={commonStyles.inputNum} size="small" min={1} addonAfter="px"
                    value={radarAxis!.splitWidth} onChange={handleLineChange} />

            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>颜色</div>
                <input type="color" value={radarAxis!.splitColor} onChange={handleLineChange}
                    className={cn(commonStyles.color)} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>显示底带色</div>
                <Switch checked={radarAxis!.splitAreaShow} size="small" onChange={handleLineChange} />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlRadarAxis);
