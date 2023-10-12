import React, { useCallback, useContext } from "react";
import { Switch, Select } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { isFormEventType, isLabelPositon, isPieLabelPosition, sizeArr } from "../util";
import { styleConfigCtx } from "../../../..";
import { ChartType, LabelPosition, PieLabelPosition } from "../../../../../charts/types";

export type MyEvent = React.FormEvent | LabelPosition | PieLabelPosition | number | null | boolean;

interface IProps {
    // label: LabelObj
    // onChange?: (newObj: LabelObj) => void
}

const positionOptions = Object.keys(LabelPosition).map(pos => {
    return <Select.Option key={pos} value={(LabelPosition as any)[pos]} className={commonStyles.fs12}>{(LabelPosition as any)[pos]}</Select.Option>;
});
const fontSizeOptions = sizeArr.map(size => {
    return <Select.Option key={size} value={size} className={commonStyles.fs12}>{size}</Select.Option>;
});
const piePosOptions = Object.keys(PieLabelPosition).map(pos => {
    return <Select.Option key={pos} value={(PieLabelPosition as any)[pos]} className={commonStyles.fs12}>{(PieLabelPosition as any)[pos]}</Select.Option>;
});

const ControlLabel: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, chartType, changeStyleConfig } = useContext(styleConfigCtx);
    const { label } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ label: { ...label!, show: e } });
        } else if (isLabelPositon(e)) {
            changeStyleConfig && changeStyleConfig({ label: { ...label!, position: e } });
        } else if (isPieLabelPosition(e)) {
            const changeColor = e === PieLabelPosition.Inside ? "#ffffff" : "#000000";
            changeStyleConfig && changeStyleConfig({ label: { ...label!, position: e, color: changeColor } });
        }
        else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ label: { ...label!, fontSize: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ label: { ...label!, color } });
        }
    }, [changeStyleConfig, label]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>数据标签</span>
            <Switch checked={label!.show} size="small" onChange={handleChange} />
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            {chartType === ChartType.Radar ? null : <div className={commonStyles.item}>
                <div className={commonStyles.tip}>位置</div>
                <Select
                    size='small'
                    value={label!.position as PieLabelPosition}
                    className={commonStyles.select}
                    onChange={handleChange}
                    disabled={!label!.show}
                >
                    {chartType === ChartType.Pie ? piePosOptions : positionOptions}
                </Select>
            </div>}
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>字体大小</div>
                <Select
                    size='small'
                    value={label!.fontSize}
                    className={commonStyles.select}
                    onChange={handleChange}
                    disabled={!label!.show}
                >
                    {fontSizeOptions}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>文本颜色</div>
                <input type="color" className={cn(commonStyles.color, label!.show ? '' : commonStyles.disColor)}
                    value={label!.color} onChange={handleChange}
                    disabled={!label!.show}
                />
            </div>
        </div>
    </div >);
};

export default React.memo(ControlLabel);
