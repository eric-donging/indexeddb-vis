import React, { useCallback, useContext } from "react";
import { InputNumber, Radio, RadioChangeEvent, Tooltip } from 'antd';
import cn from "classnames";
import { CaretDownOutlined } from '@ant-design/icons';
import commonStyles from "../common.module.css";
import { useCollapse } from "../hooks";
import { MyClassIcon } from "../../../../../../../components/MyIcon";
import { LineType } from "../../../../../charts/styleConfigs/line";
import { styleConfigCtx } from "../../../..";

export type MyEvent = RadioChangeEvent | number | null;

interface IProps {
    // contentLineStyle: ContentLineStyleObj
    // onChange?: (newObj: ContentLineStyleObj) => void
}

const radios = Object.keys(LineType).map(t => {
    const v = (LineType as any)[t];

    let type: any = "";
    let weight = 0;
    let text = "";
    if (v === LineType.normal) {
        type = "icon-jibenzhexiantu";
        weight = 580;
        text = "折线";
    } else if (v === LineType.smooth) {
        type = "icon-fsux_tubiao_fenbuquxiantu";
        weight = 470;
        text = "圆滑曲线";
    } else {
        type = "icon-zhexian";
        weight = 600;
        text = "阶梯曲线";
    }
    const content = (<div className={commonStyles.addText}>{text}</div>);
    return (
        <Tooltip title={content} placement='bottom' color='#fff' key={t}>
            <Radio.Button value={v} className={commonStyles.radio}>
                <MyClassIcon type={type} style={{ fontWeight: weight }} />
            </Radio.Button>
        </Tooltip>);
});

const ControlLine: React.FC<IProps> = (props) => {
    const [isCollapse, handleIconClick] = useCollapse();

    const { styleConfig, changeStyleConfig } = useContext(styleConfigCtx);
    const { contentLineStyle } = styleConfig!;

    const handleChange = useCallback((e: MyEvent) => {
        if (Object.is(null, e)) {
            return;
        } else if (typeof e === "number") {
            changeStyleConfig && changeStyleConfig({ contentLineStyle: { ...contentLineStyle!, lineWidth: e } });
        } else {
            const type = e!.target.value;
            changeStyleConfig && changeStyleConfig({ contentLineStyle: { ...contentLineStyle!, lineType: type } });
        }
    }, [changeStyleConfig, contentLineStyle]);

    return (<div className={commonStyles.container}>
        <div className={commonStyles.head}>
            <CaretDownOutlined
                className={cn(commonStyles.icon, isCollapse ? commonStyles.collapse : '')}
                onClick={handleIconClick}
            />
            <span className={commonStyles.title}>折线样式</span>
        </div>
        <div className={cn(commonStyles.content, isCollapse ? commonStyles.hidden : '')}>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>线宽</div>
                <InputNumber className={commonStyles.inputNum} size="small" min={1} addonAfter="px"
                    value={contentLineStyle!.lineWidth} onChange={handleChange} />

            </div>
            <div className={commonStyles.item}>
                <div className={commonStyles.tip}>线型</div>
                <Radio.Group className={commonStyles.radioGroup} size="small" value={contentLineStyle!.lineType} onChange={handleChange} >
                    {radios}
                </Radio.Group>
            </div>
        </div>
    </div>);
};

export default React.memo(ControlLine);
