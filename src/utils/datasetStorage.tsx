import { DatasetInfo } from "../page/Dataset/ManageSet";

const setString = `@@dataset`;

/**
 * 将数据集信息本地化存储，如果id重复，进行更新操作
 * @param info 数据集信息
 */
function addDatasetInfo(info: DatasetInfo) {
    const infos = localStorage.getItem(setString);
    let infoArr: DatasetInfo[];
    if (infos) {
        infoArr = JSON.parse(infos);
    } else {
        infoArr = [];
    }
    const idx = infoArr.findIndex(i => i.key === info.key);
    if (idx < 0) {
        infoArr.push(info);
    } else {
        infoArr[idx] = info;
    }
    localStorage.setItem(setString, JSON.stringify(infoArr));
}

/**
 * 获得本地化存储的数据集信息
 * @returns 
 */
function getDatasetInfos(): DatasetInfo[] {
    const str = localStorage.getItem(setString);
    let infos: DatasetInfo[];
    if (!str) {
        infos = [];
    } else {
        infos = JSON.parse(str);
    }
    return infos;
}

/**
 * 根据id返回本地化存储的数据集
 * @returns 
 */
function getDatasetInfoById(id: string): DatasetInfo | undefined {
    const str = localStorage.getItem(setString);
    let infos: DatasetInfo[];
    if (!str) {
        return undefined;
    } else {
        infos = JSON.parse(str);
        return infos.find(info => info.id === id);
    }
}

/**
 * 根据id删除本地化存储的数据集
 * @param id 
 * @returns 
 */
function deleteDatesetInfoById(id: string): Boolean {
    try {
        const arr = getDatasetInfos();
        const newArr = arr.filter(i => i.id !== id);
        localStorage.removeItem(setString);
        localStorage.setItem(setString, JSON.stringify(newArr));
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

export {
    addDatasetInfo,
    getDatasetInfos,
    getDatasetInfoById,
    deleteDatesetInfoById,
}
