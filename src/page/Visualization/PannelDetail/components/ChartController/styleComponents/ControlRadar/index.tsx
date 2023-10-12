import React, { useCallback, useContext } from "react";
import { Select, Slider, Switch } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";
import { isRadarType } from "../util";
import { RadarType } from "../../../../../charts/types";

export type MyEvent = number | RadarType | boolean;
export type MyEvent2 = boolean;

interface IProps {
}

const radarOptions = Object.keys(RadarType).map(t => {
    return <Select.Option key={t} value={(RadarType as any)[t]} className={commonStyles.fs12}>{(RadarType as any)[t]}</Select.Option>;
});

const ControlRadar: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { radarStyle } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (isRadarType(e)) {
            changeStyleConfig && changeStyleConfig({ radarStyle: { ...radarStyle!, shape: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ radarStyle: { ...radarStyle!, size: e } });
        } else if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ radarStyle: { ...radarStyle!, showDot: e } });
        }
    }, [changeStyleConfig, radarStyle]);
    const handleChange2 = useCallback((e: MyEvent2) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ radarStyle: { ...radarStyle!, showShadow: e } });
        }
    }, [changeStyleConfig, radarStyle]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>雷达图样式</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>形状</div>
                <Select
                    size='small'
                    value={radarStyle!.shape}
                    className={commonStyles.select}
                    onChange={handleChange}
                >
                    {radarOptions}
                </Select>
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>大小</div>
                <Slider className={commonStyles.slider} value={radarStyle!.size} onChange={handleChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>显示辅助点</div>
                <Switch checked={radarStyle!.showDot} size="small" onChange={handleChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>显示面积</div>
                <Switch checked={radarStyle!.showShadow} size="small" onChange={handleChange2} />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlRadar);
