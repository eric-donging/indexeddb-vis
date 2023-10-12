export enum PathNames {
    data = 'data',
    dataset = 'dataset',
    datasetDetail = 'dataset/detail',
    visual = 'visual',
    visualDetail = 'visual/detail',
    visualPreview = 'visual/preview',
}

export const pathInfos: PathInfo[] = [
    { pathName: PathNames.data, title: '数据构建' },
    { pathName: PathNames.dataset, title: '数据集创建' },
    { pathName: PathNames.visual, title: '数据可视化' },
]

export const defaultPathInfo: PathInfo = pathInfos[0];

interface PathInfo {
    pathName: string,
    title: string,
}
