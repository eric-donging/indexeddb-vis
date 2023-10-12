import React, { useCallback, useContext, useRef } from "react";
import { useSize } from "ahooks";
import { Tooltip } from "antd";
import cn from "classnames";
import { ReloadOutlined, MoreOutlined, LoadingOutlined } from '@ant-design/icons';
import GridLayout, { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styles from "./index.module.css";
import { ChartType } from "../../../charts/types";
import { ChartConfigInfo, styleConfigCtx } from "../..";
import MyChart from "../../../charts/MyChart";
import themeObjs, { getBackgroudStyleByTheme } from "../../../charts/MyChart/themes";
import { PannelTheme } from "../../../../../types";

export type Layouts = {
    sm: GridLayout.Layout[]
    xs: GridLayout.Layout[]
}

interface IProps {
    /**
     * 是否是用来预览的
     */
    isPreview?: boolean
    previewTheme?: PannelTheme,

    /**
     * 现有图表的布局、大小
     */
    layouts: Layouts
    /**
     * 现有图表的配置
     * 里面有key: 对应布局配置里的 i 
     */
    chartConfigs: ChartConfigInfo[]
    /**
     * 当前选中图表的id（key），undefined表示没有图表被选中
     */
    selectId?: string
    /**
     * 点击图表或者仪表盘空白区域，即改变被选中的图表id
     * @param newId 
     * @returns 
     */
    onChangeSelectId?: (newId: string | undefined, chartType: ChartType | undefined, datasetId: string | undefined) => void
    /**
     * 删除图表
     * @param id 
     * @returns 
     */
    onDeleteChart?: (id: string) => void
    /**
     * 
     * @returns 
     */
    onLayoutsChange?: (newLayouts: Layouts) => void
}

const PannelContent: React.FC<IProps> = (props) => {
    const { isPreview = false, previewTheme, layouts, chartConfigs, selectId,
        onChangeSelectId, onDeleteChart, onLayoutsChange } = props;

    const resizeRef = useRef<HTMLDivElement>(null);
    const size = useSize(resizeRef);

    const handleClick = useCallback(() => {
        onChangeSelectId && onChangeSelectId(undefined, undefined, undefined);
    }, [onChangeSelectId]);

    const handleLayoutChange = useCallback((currentLayout: GridLayout.Layout[], allLayouts: Layouts) => {
        if (currentLayout === allLayouts.sm) {  // 同一个对象，正好判断当前什么屏幕（天无绝人之路）
            // 当前是大屏幕
            for (let i = 0; i < currentLayout.length; i++) {
                const lay = currentLayout[i];
                allLayouts.xs[i].h = lay.h;
                if (lay.w < 2) allLayouts.xs[i].w = lay.w;
            }
        } else {
            // 当前是小屏幕
            for (let i = 0; i < currentLayout.length; i++) {
                const lay = currentLayout[i];
                allLayouts.sm[i].h = lay.h;
            }
        }
        onLayoutsChange && onLayoutsChange(allLayouts);
    }, [onLayoutsChange]);

    let { theme } = useContext(styleConfigCtx);
    // 预览使用组件，主题要传递
    if (isPreview) {
        theme = previewTheme!;
    }
    console.log('content', theme)

    const getGridItem = useCallback((): JSX.Element[] => {
        const res: JSX.Element[] = [];
        const lgLayout = layouts.sm;
        for (const l of lgLayout) {
            const chartConfig = chartConfigs.find(c => c.key === l.i);
            if (!chartConfig) {
                // 图表配置找不到不渲染
                continue;
            }

            const delCotent = (<div className={styles.del} onClick={(e) => {
                onDeleteChart && onDeleteChart(l.i);
                // 一定要阻止冒泡，否则之后有相当于点击一下表格，设置ChartController是否被点击，这样父组件改为false失效
                e.stopPropagation();
            }}>删除</div>);

            const titleAndIconColor: React.CSSProperties = {
                color: themeObjs[theme].title.textStyle.color,
            };

            res.push(
                <div
                    key={l.i}
                    className={cn(styles.gridItem, l.i === selectId ? styles.active : styles.common)}
                    style={{ background: themeObjs[theme].backgroundColor }}
                    onClick={(e) => {
                        onChangeSelectId && onChangeSelectId(l.i, chartConfig.type, chartConfig.datasetId);
                        e.stopPropagation();
                    }}
                >
                    <header>
                        <div style={titleAndIconColor}>{chartConfig.styleConfig.chartTitle?.show ? chartConfig.styleConfig.chartTitle?.name : null}</div>
                        <LoadingOutlined className={styles.icon} style={{ visibility: 'hidden', ...titleAndIconColor }} />
                        <div>
                            {isPreview ? null : <>
                                <ReloadOutlined style={titleAndIconColor} className={styles.icon} />
                                <Tooltip title={delCotent} placement='bottom' color='#fff' showArrow={false} trigger="click">
                                    <MoreOutlined style={{ ...titleAndIconColor, marginLeft: '2px' }} className={styles.icon} />
                                </Tooltip>
                            </>}
                        </div>
                    </header>

                    {/* 需要明确给下面div指定css中的宽高，好让图表撑满容器 */}
                    <div>
                        <MyChart
                            priorTheme={isPreview ? theme : undefined}
                            type={chartConfig.type}
                            dataConfig={chartConfig.dataConfig}
                            styleConfig={chartConfig.styleConfig} />
                    </div>
                </div>
            );
        }
        return res;
    }, [chartConfigs, isPreview, layouts.sm, onChangeSelectId, onDeleteChart, selectId, theme]);

    return (
        <div
            ref={resizeRef}
            className={styles.container}
            onClick={handleClick}
            style={getBackgroudStyleByTheme(theme)}
        >
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                rowHeight={35}
                breakpoints={{ sm: 768, xs: 480 }}
                cols={{ sm: 12, xs: 2 }}
                width={size ? size.width : 0}
                onLayoutChange={handleLayoutChange}
                isDraggable={isPreview ? false : true}
                isResizable={isPreview ? false : true}
            >
                {getGridItem()}
            </ResponsiveGridLayout>
        </div>
    );
};

export default React.memo(PannelContent);
