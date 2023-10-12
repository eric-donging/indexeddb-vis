import React, { useContext } from "react";
import { styleConfigCtx } from "../../../../index";
import { StyleConfigRenderTypes } from "../../../../../charts/types";
import { styleConfigRenderItems } from "../../../../../charts/styleConfigs/index";
import ControlTitle from "../ControlTitle";
import ControlLabel from "../ControlLabel";
import ControlAxis from "../ControlAxis";
import ControlLegend from "../ControlLegend";
import ControlLine from "../ControlLine";
import ControlBar from "../ControlBar";
import ControlPie from "../ControlPie";
import ControlRadar from "../ControlRadar";
import ControlRadarAxis from "../ControlRadarAxis";
import ControlCardFont from "../ControlCardFont";
import ControlCardTarget from "../ControlCardTarget";

const StylesWrapper: React.FC = () => {
    const ctx = useContext(styleConfigCtx);
    console.log(ctx);

    return <>
        {getRenderComps(styleConfigRenderItems[ctx.chartType!], ctx.chartId!)}
    </>
};

// 之后组件传入图表类型就不这么渲染了，先随便写写
function getRenderComps(renderItems: StyleConfigRenderTypes[], chartId: string): React.ReactNode[] {
    return renderItems.map((k, i) => {
        switch (k) {
            case StyleConfigRenderTypes.ChartTitle:
                return (<ControlTitle key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.Label:
                return (<ControlLabel key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.XAxis:
                return (<ControlAxis key={`${chartId}${i}`} type="X" />);
            case StyleConfigRenderTypes.YAxis:
                return (<ControlAxis key={`${chartId}${i}`} type="Y" />);
            case StyleConfigRenderTypes.Legend:
                return (<ControlLegend key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.ContentLineStyle:
                return (<ControlLine key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.BarStyle:
                return (<ControlBar key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.PieStyle:
                return (<ControlPie key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.RadarStyle:
                return (<ControlRadar key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.RadarAxis:
                return (<ControlRadarAxis key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.CardFontSize:
                return (<ControlCardFont key={`${chartId}${i}`} />);
            case StyleConfigRenderTypes.CardTarget:
                return (
                    <>
                        <ControlCardTarget key={`${chartId}${i}-0`} order={1} />
                        <ControlCardTarget key={`${chartId}${i}-1`} order={2} />
                        <ControlCardTarget key={`${chartId}${i}-2`} order={3} />
                    </>
                );
            default:
                return <p key={i}>123</p>;
        }
    });
}

export default React.memo(StylesWrapper);
