import React, { useRef } from "react";
import qs from "query-string";
import { RouteComponentProps } from "react-router-dom";
import styles from "./index.module.css";
import { getPannelInfoById } from "../../utils/pannelStorage";
import { getPannelDetailInfoById } from "../../utils/pannelDetailStorage";
import themeObjs, { getBackgroudStyleByTheme } from "../Visualization/charts/MyChart/themes";
import PannelContent from "../Visualization/PannelDetail/components/PannelContent";

interface IProps extends RouteComponentProps { }

const PannelPreview: React.FC<IProps> = (props) => {
    const pannelId = useRef(qs.parse(props.location.search).id as string).current;

    // 基础信息获得
    const info = getPannelInfoById(pannelId);
    const detailInfoRef = useRef(getPannelDetailInfoById(pannelId));

    const theme = detailInfoRef.current?.theme;
    let bgColor: React.CSSProperties = { background: "transparent" };
    if (theme) {
        bgColor = getBackgroudStyleByTheme(theme);
    }
    // const themeObj = themeObjs[theme];

    if (!info || !detailInfoRef.current || !theme) {
        return (<h1>该仪表盘已不存在</h1>);
    }
    return (
        <div style={{ ...bgColor }} className={styles.container}>
            <header style={{ color: themeObjs[theme].title.textStyle.color }} >{info.name}</header>

            <div>
                <PannelContent
                    isPreview previewTheme={theme}
                    layouts={detailInfoRef.current.layouts}
                    chartConfigs={detailInfoRef.current.chartConfigs} />
            </div>
        </div>
    );
};

export default PannelPreview;
