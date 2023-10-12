import React, { useCallback, useContext } from "react";
import { Select } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";
import { BarType } from "../../../../../charts/styleConfigs/bar";
import { isBarType } from "../util";
import { ChartType } from "../../../../../charts/types";

export type MyEvent = BarType;

interface IProps {
}

const barOptions = Object.keys(BarType).map(t => {
    return <Select.Option key={t} value={(BarType as any)[t]} className={commonStyles.fs12}>{(BarType as any)[t]}</Select.Option>;
});

const ControlLegend: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, chartType, changeStyleConfig } = useContext(styleConfigCtx);
    const { barStyle } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (isBarType(e)) {
            changeStyleConfig && changeStyleConfig({ barStyle: { ...barStyle!, barType: e } });
        }
    }, [barStyle, changeStyleConfig]);

    const text = chartType === ChartType.RowBar ? "条形样式" : "柱形样式";

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>{text}</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>{text}</div>
                <Select
                    size='small'
                    value={barStyle!.barType}
                    className={commonStyles.select}
                    onChange={handleChange}
                >
                    {barOptions}
                </Select>
            </div>
        </div>
    </div>);
};

export default React.memo(ControlLegend);
