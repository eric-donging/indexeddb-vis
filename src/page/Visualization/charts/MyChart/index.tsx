import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ReactECharts, { EChartsOption } from "echarts-for-react";
import { LoadingOutlined } from '@ant-design/icons';
import { omit } from "lodash";
import { DataConfig, dataConfigToData, DataMsg, isDataConfigOver } from "../dataConfigs";
import { styleConfigToEChartsConfig } from "../styleConfigs";
import { ChartType, StyleConfigObj } from "../types";
import styles from "./index.module.css";
import { styleConfigCtx } from "../../PannelDetail";
import "./themes";  // 导入主题配置
import themeObjs from "./themes";
import Card from "./Card";
import { PannelTheme } from "../../../../types";

interface IProps {
    /**
     * 若传入主题，则这个优先
     */
    priorTheme?: PannelTheme
    type: ChartType
    dataConfig: DataConfig[]
    styleConfig: Partial<StyleConfigObj>
}

const MyChart: React.FC<IProps> = (props) => {
    console.log('chart渲染了');
    const { priorTheme, type, dataConfig, styleConfig } = props;

    let { theme } = useContext(styleConfigCtx);
    if (priorTheme) {
        theme = priorTheme;
    }
    // console.log(theme);

    const [isShowChart, setIsShowChart] = useState(false);
    const [isShowLoading, setIsShowLoading] = useState(false);
    const [option, setOption] = useState<EChartsOption>({});

    const [chartData, setChartData] = useState<false | DataMsg>(false);

    /**
     * 图表标题改变时父级容器的内容，不应该重新渲染图表
     */
    const styleConfigWithoutTitle = useMemo(() => {
        return omit(styleConfig, ["chartTitle"]);
    }, [styleConfig]);

    useEffect(() => {
        (async () => {
            // 判断该图表数据配置是否完成
            const dataBool = isDataConfigOver[type](dataConfig);
            if (dataBool) {
                setIsShowChart(true);
                setIsShowLoading(true);
                // 配置图表所需数据
                const data = await dataConfigToData[type](dataConfig);
                if (!data) {  // 数据有问题

                } else {
                    const option = styleConfigToEChartsConfig[type](styleConfig, data, theme);
                    setOption(option);
                    setChartData(data);
                    setIsShowLoading(false);
                }
            } else {
                setIsShowChart(false);
            }
        })();
        return () => {
            console.log('组件卸载了')
        }
    }, [JSON.stringify(dataConfig), type]);

    useEffect(() => {
        console.log('effect')
        if (chartData) {
            const option = styleConfigToEChartsConfig[type](styleConfig, chartData, theme);
            // console.log('setOp', chartData.values.length);
            setOption(option);
        }
    }, [JSON.stringify(styleConfigWithoutTitle), type, theme]);

    const renderContent = useCallback(() => {
        if (!isShowChart) {
            return (<div className={styles.tip} style={{
                color: themeObjs[theme].title.textStyle.color,
            }}>
                图表数据未配置完成，请继续完成配置。
            </div>);
        } else {
            if (isShowLoading) {
                return <LoadingOutlined className={styles.loading} />
            } else {
                if (type === ChartType.Card) {
                    return (<Card option={option} theme={theme} />);
                }
                return (<ReactECharts option={option}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                    theme={theme}
                />);
            }
        }
    }, [isShowChart, isShowLoading, option, theme, type]);

    return (
        <div className={styles.chartWrap}>
            {/* <ReactECharts option={{}} /> */}
            {renderContent()}
        </div>
    );
};

export default React.memo(MyChart);

