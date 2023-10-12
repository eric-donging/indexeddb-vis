import React, { useCallback, useContext } from "react";
import { Switch, Input } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";

export type MyEvent = React.FormEvent | boolean;

interface IProps {
    // chartTitle: ChartTitleObj
    // onChange?: (newObj: ChartTitleObj) => void
}

const ControlTitle: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { chartTitle } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ chartTitle: { ...chartTitle!, show: e } });
        } else {
            const title = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ chartTitle: { ...chartTitle!, name: title } });
        }
    }, [changeStyleConfig, chartTitle]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>图表标题</span>
            <Switch checked={chartTitle!.show} size="small" onChange={handleChange} />
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>标题</div>
                <Input className={commonStyles.input} disabled={!chartTitle!.show} value={chartTitle!.name} onChange={handleChange} />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlTitle);
