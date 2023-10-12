import React, { useCallback, useContext } from "react";
import { Switch, InputNumber } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";

export type MyEvent = boolean | number | null;

interface IProps {
}

const ControlCardFont: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { cardFontSize } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ cardFontSize: { ...cardFontSize!, open: e } });
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ cardFontSize: { ...cardFontSize!, mainSize: e } });
        }
    }, [cardFontSize, changeStyleConfig]);

    const handleChange2 = useCallback((e: MyEvent) => {
        if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ cardFontSize: { ...cardFontSize!, viceSize: e } });
        }
    }, [cardFontSize, changeStyleConfig]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>固定字体大小</span>
            <Switch checked={cardFontSize!.open} size="small" onChange={handleChange} />
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.longTip}>主体字体大小</div>
                <InputNumber className={commonStyles.inputNum} size="small"
                    disabled={!cardFontSize!.open} min={0}
                    value={cardFontSize!.mainSize} onChange={handleChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.longTip}>辅助字体大小</div>
                <InputNumber className={commonStyles.inputNum} size="small"
                    disabled={!cardFontSize!.open} min={0}
                    value={cardFontSize!.viceSize} onChange={handleChange2} />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlCardFont);
