
import { PannelInfo } from "../page/Visualization/ManagePannel";
import { PannelTheme } from "../types";
import { addPannelDetailInfo, deletePannelDetailInfoById } from "./pannelDetailStorage";

const setString1 = `@@pannel`;

/**
 * 将仪表盘信息本地化存储，如果id重复，进行更新操作
 * @param info 仪表盘信息
 */
function addPannelInfo(info: PannelInfo) {
    const infos = localStorage.getItem(setString1);
    let infoArr: PannelInfo[];
    if (infos) {
        infoArr = JSON.parse(infos);
    } else {
        infoArr = [];
    }
    const idx = infoArr.findIndex(i => i.id === info.id);
    if (idx < 0) {
        // 仪表盘新建
        infoArr.push(info);

        // 仪表盘具体信息也需要新建
        addPannelDetailInfo({
            id: info.id,
            datasetIds: [],
            layouts: {
                sm: [],
                xs: []
            },
            theme: PannelTheme.Walden,
            chartConfigs: [],
        });
    } else {
        // 仪表盘修改
        infoArr[idx] = info;
    }
    localStorage.setItem(setString1, JSON.stringify(infoArr));
}

/**
 * 获得本地化存储的仪表盘信息
 * @returns 
 */
function getPannelInfos(): PannelInfo[] {
    const str = localStorage.getItem(setString1);
    let infos: PannelInfo[];
    if (!str) {
        infos = [];
    } else {
        infos = JSON.parse(str);
    }
    return infos;
}

/**
 * 根据id返回本地化存储的仪表盘
 * @returns 
 */
function getPannelInfoById(id: string): PannelInfo | undefined {
    const str = localStorage.getItem(setString1);
    let infos: PannelInfo[];
    if (!str) {
        return undefined;
    } else {
        infos = JSON.parse(str);
        return infos.find(info => info.id === id);
    }
}

/**
 * 根据id删除本地化存储的仪表盘
 * @param id 
 * @returns 
 */
function deletePannelInfoById(id: string): Boolean {
    try {
        const arr = getPannelInfos();
        const newArr = arr.filter(i => i.id !== id);
        localStorage.removeItem(setString1);
        localStorage.setItem(setString1, JSON.stringify(newArr));

        // 仪表盘具体信息也需要删除
        const res = deletePannelDetailInfoById(id);
        if (!res) return false;

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export {
    addPannelInfo,
    getPannelInfos,
    getPannelInfoById,
    deletePannelInfoById,
}
