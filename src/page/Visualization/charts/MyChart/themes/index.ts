import * as echarts from "echarts";
import vintageConfig from "./vintage";
import westerosConfig from "./westeros";
import wonderlandConfig from "./wonderland";
import waldenConfig from "./walden";
import darkConfig from "./dark";
import chalkConfig from "./chalk";
import purplePassionConfig from "./purplePassion";
import { PannelTheme } from "../../../../../types";

echarts.registerTheme(PannelTheme.Vintage, vintageConfig);
echarts.registerTheme(PannelTheme.Westeros, westerosConfig);
echarts.registerTheme(PannelTheme.Wonderland, wonderlandConfig);
echarts.registerTheme(PannelTheme.Walden, waldenConfig);
echarts.registerTheme(PannelTheme.Dark, darkConfig);
echarts.registerTheme(PannelTheme.Chalk, chalkConfig);
echarts.registerTheme(PannelTheme.PurplePassion, purplePassionConfig);

const themeObjs: any = {
    [PannelTheme.Vintage]: vintageConfig,
    [PannelTheme.Westeros]: westerosConfig,
    [PannelTheme.Wonderland]: wonderlandConfig,
    [PannelTheme.Walden]: waldenConfig,
    [PannelTheme.Dark]: darkConfig,
    [PannelTheme.Chalk]: chalkConfig,
    [PannelTheme.PurplePassion]: purplePassionConfig,
}

export default themeObjs;

export function getBackgroudStyleByTheme(theme: PannelTheme): React.CSSProperties {
    const res: any = {};
    if (theme === PannelTheme.Dark) {
        res.background = "#505050";
    } else if (theme === PannelTheme.Chalk) {
        // res.background = "#405164";
        res.background = "#455669";
    } else if (theme === PannelTheme.PurplePassion) {
        res.background = "rgb(80,81,100)";
    }
    return res;
}
