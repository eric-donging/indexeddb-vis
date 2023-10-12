import React, { useCallback, useContext } from "react";
import { Slider } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";

export type MyEvent = [number, number];

interface IProps {
}

const ControlPie: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { pieStyle } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        changeStyleConfig && changeStyleConfig({ pieStyle: { ...pieStyle!, size: e } });
    }, [pieStyle, changeStyleConfig]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>饼图样式</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>大小</div>
                <Slider className={commonStyles.slider} range value={pieStyle!.size} onChange={handleChange} />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlPie);
