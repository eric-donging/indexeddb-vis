import React, { useCallback, useContext } from "react";
import { Switch, Input } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { styleConfigCtx } from "../../../..";
import { isFormEventType } from "../util";

export type MyEvent = React.FormEvent | boolean | number | null;

interface IProps {
    order: number
}

const text = ["头部", "主体", "尾部"];

const ControlCardTarget: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const editPropName = "cardTarget" + props.order;
    const cardTarget = (styleConfig! as any)[editPropName];


    const handleChange = useCallback((e: MyEvent) => {
        if (typeof e === "boolean") {
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget, centerShow: e } });
        } else if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget!, centerColor: color } });
        }
    }, [cardTarget, changeStyleConfig, editPropName]);

    const handleChange1 = useCallback((e: MyEvent) => {
        if (isFormEventType(e)) {
            const text = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget!, prefix: text } });
        }
    }, [cardTarget, changeStyleConfig, editPropName]);

    const handleChange2 = useCallback((e: MyEvent) => {
        if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget!, priColor: color } });
        }
    }, [cardTarget, changeStyleConfig, editPropName]);

    const handleChange3 = useCallback((e: MyEvent) => {
        if (isFormEventType(e)) {
            const text = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget!, suffix: text } });
        }
    }, [cardTarget, changeStyleConfig, editPropName]);

    const handleChange4 = useCallback((e: MyEvent) => {
        if (isFormEventType(e)) {
            const color = (e.target as HTMLInputElement).value;
            changeStyleConfig && changeStyleConfig({ [editPropName]: { ...cardTarget!, sufColor: color } });
        }
    }, [cardTarget, changeStyleConfig, editPropName]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>{text[props.order - 1] + "指标"}</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.longTip}>数值</div>
                <Switch checked={cardTarget!.centerShow} size="small" onChange={handleChange} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>颜色</div>
                <input type="color" className={cn(commonStyles.color, cardTarget!.centerShow ? '' : commonStyles.disColor)}
                    value={cardTarget!.centerColor} onChange={handleChange}
                    disabled={!cardTarget!.centerShow}
                />
            </div>

            <div className={cn(commonStyles.item, commonStyles.mt10)}>
                <div className={commonStyles.tip}>前缀</div>
                <Input className={commonStyles.input} value={cardTarget!.prefix} onChange={handleChange1} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>颜色</div>
                <input type="color" className={commonStyles.color}
                    value={cardTarget!.priColor} onChange={handleChange2}
                />
            </div>

            <div className={cn(commonStyles.item, commonStyles.mt10)}>
                <div className={commonStyles.tip}>后缀</div>
                <Input className={commonStyles.input} value={cardTarget!.suffix} onChange={handleChange3} />
            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>颜色</div>
                <input type="color" className={commonStyles.color}
                    value={cardTarget!.sufColor} onChange={handleChange4}
                />
            </div>
        </div>
    </div>);
};

export default React.memo(ControlCardTarget);
