import React, { useCallback, useContext } from "react";
import { Switch, Select } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { LegendPosition } from "../../../../../charts/types";
import { useCollapse } from "../hooks";
import { isFormEventType, isLegendPositon, sizeArr } from "../util";
import { styleConfigCtx } from "../../../..";

export type MyEvent = React.FormEvent | number | null | boolean | LegendPosition;

interface IProps {
    // legend: LegendObj
    // onChange?: (newObj: LegendObj) => void
}

const fontSizeOptions = sizeArr.map(size => {
    return <Select.Option key={size} value={size} className={commonStyles.fs12}>{size}</Select.Option>;
});
const legendOptions = Object.keys(LegendPosition).map(l => {
    return <Select.Option key={l} value={(LegendPosition as any)[l]} className={commonStyles.fs12}>{(LegendPosition as any)[l]}</Select.Option>;
});

const ControlLegend: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { legend } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ legend: { ...legend!, show: e } });
        } else if (isLegendPositon(e)) {
            changeStyleConfig && changeStyleConfig({ legend: { ...legend!, position: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ legend: { ...legend!, fontSize: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ legend: { ...legend!, color } });
        }
    }, [changeStyleConfig, legend]);

    const handleChange2 = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ legend: { ...legend!, pages: e } });
        }
    }, [changeStyleConfig, legend]);


    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>图例</span>
            <Switch checked={legend!.show} size="small" onChange={handleChange} />
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>位置</div>
                <Select
                    size='small'
                    value={legend!.position}
                    className={commonStyles.select}
                    onChange={handleChange}
                    disabled={!legend!.show}
                >
                    {legendOptions}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>翻页</div>
                <Switch checked={legend!.pages} size="small" disabled={!legend!.show} onChange={handleChange2} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>字体大小</div>
                <Select
                    size='small'
                    value={legend!.fontSize}
                    className={commonStyles.select}
                    onChange={handleChange}
                    disabled={!legend!.show}
                >
                    {fontSizeOptions}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>文本颜色</div>
                <input type="color" className={cn(commonStyles.color, legend!.show ? '' : commonStyles.disColor)}
                    value={legend!.color} onChange={handleChange} disabled={!legend!.show}
                />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlLegend);
