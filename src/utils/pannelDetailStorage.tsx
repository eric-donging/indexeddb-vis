import { PannelDetailInfo } from "../page/Visualization/PannelDetail";

const setString1 = `@@pannel&`;  // 后面补齐仪表盘id

/**
 * 新增、修改仪表盘具体信息本地化存储
 * @param info 仪表盘信息
 */
function addPannelDetailInfo(info: PannelDetailInfo) {
    localStorage.setItem(setString1 + info.id, JSON.stringify(info));
}

/**
 * 根据id获得本地化存储的仪表盘具体信息
 * @returns 
 */
function getPannelDetailInfoById(id: string): PannelDetailInfo | null {
    const str = localStorage.getItem(setString1 + id);
    let info: PannelDetailInfo | null;
    if (!str) {
        info = null;
    } else {
        info = JSON.parse(str);
    }
    return info;
}

/**
 * 根据id删除本地化存储仪表盘具体信息
 * @param id 
 * @returns 
 */
function deletePannelDetailInfoById(id: string): Boolean {
    try {
        localStorage.removeItem(setString1 + id);
        return true;
    }
    catch {
        return false;
    }
}

export {
    addPannelDetailInfo,
    getPannelDetailInfoById,
    deletePannelDetailInfoById,
}
