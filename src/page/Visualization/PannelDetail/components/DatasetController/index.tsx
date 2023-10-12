import React, { useCallback, useState } from "react";
import { Resizable } from 're-resizable';
import { Tooltip } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import cn from "classnames";
import styles from "./index.module.css";
import { addDatasetInfo, getDatasetInfoById } from "../../../../../utils/datasetStorage";
import { DatasetInfo, DataType, Field, SetType, VisualType } from "../../../../Dataset/ManageSet";
import AddSetModal from "./AddSetModal";
import PanelExpand from "../../../../../components/PanelExpand";
import SetFieldItem from "./SetFieldItem";
import DatasetItem from "./DatasetItem";
import AdviseModal from "./AdviseModal";
import useModal from "../../../../../hooks/useModal";
import { ChartConfigInfo, PannelDetailInfo } from "../..";

interface IProps {
    /**
     * 选中的数据集id
     */
    selectedId: string | undefined
    /**
     * 仪表盘具体信息
     */
    detailInfo: PannelDetailInfo
    /**
     * 强制渲染仪表盘详情页
     * @param obj 
     * @returns 
     */
    updateFather: () => void
    /**
     * 改变选中的数据集id
     * @param newId 
     * @returns 
     */
    onChangeSeletedId?: (newId: string) => void
    /**
     * 新增数据集
     * @param newSetId 
     * @returns 
     */
    onAddSet?: (newSetId: string) => void
}

const DatasetController: React.FC<IProps> = (props) => {
    const { detailInfo, selectedId, updateFather, onChangeSeletedId, onAddSet } = props;
    const { datasetIds } = detailInfo;

    const [, forceUpdate] = useState({});

    // resize时阴影效果
    const [rightClass, setRightClass] = useState(styles.resizeRight);
    const [bottomClass, setBottomClass] = useState(styles.resizeBottom);
    const [topClass, setTopClass] = useState(styles.resizeTop);

    /**
     * 推荐图标时选中的字段
     */
    const [selectFields, setSelectFields] = useState<string[]>([]);

    /**
     * 维度或度量字段列表
     */
    const getMetricOrAttributeList = useCallback(
        (type: VisualType.Attribute | VisualType.Metric | "allSelect") => {
            const info = getDatasetInfoById(selectedId!);
            let list;
            if (!info) {
                list = null;
            } else {
                list = info.fields
                    .filter(field => {
                        if (type === "allSelect") return true;
                        return field.visualType === type;
                    })
                    .map(field => {

                        const handleTypeChange: MenuProps['onClick'] = (e) => {
                            const { keyPath: [v, k] } = e;
                            console.log(v, k);
                            const newFields = info.fields.map(f => {
                                if (f.fieldName === field.fieldName) {
                                    let newField: Field;
                                    if (k === SetType.VisualType) {
                                        newField = { ...f, visualType: v as VisualType };
                                    } else {
                                        newField = { ...f, dataType: v as DataType };
                                    }
                                    return newField;
                                }
                                return f;
                            });
                            const newInfo: DatasetInfo = { ...info, fields: newFields };
                            addDatasetInfo(newInfo);
                            forceUpdate({});
                        };

                        return (<SetFieldItem
                            key={`${selectedId}${field.fieldName}`}
                            field={field} handleTypeChange={handleTypeChange}
                            datasetId={selectedId!} type={type}
                            boxStat={type === "allSelect" ? selectFields.includes(field.fieldName) : undefined}
                            handleChangeBox={type === "allSelect" ? (newStat) => {
                                if (newStat) {
                                    setSelectFields([...selectFields, field.fieldName]);
                                } else {
                                    const idx = selectFields.indexOf(field.fieldName);
                                    if (idx >= 0) {
                                        setSelectFields([...selectFields.slice(0, idx), ...selectFields.slice(idx + 1)]);
                                    }
                                }
                            } : undefined}
                        />);
                    });
            }
            return (
                <ul className={cn(styles.list, type === "allSelect" ? styles.listWithCheckbox : "")}>
                    {list}
                </ul>
            );
        },
        [selectFields, selectedId],
    )

    const handleDatasetItemClick = useCallback((info: DatasetInfo) => {
        onChangeSeletedId && onChangeSeletedId(info.id);
        setSelectFields([]);
    }, [onChangeSeletedId]);

    // 推荐图表弹窗
    const { open: open2, handleOk: handleOk2, handleCancel: handleCancel2, showModal: showModal2 } = useModal();

    const handleAdvise = useCallback(() => {
        showModal2();
    }, [showModal2]);

    /**
     * 数据集名称列表元素
     */
    const getDatasetList = useCallback(
        () => {
            const list = datasetIds
                .map(id => getDatasetInfoById(id))
                .filter(info => info)
                .map((info, idx) => {
                    return <DatasetItem key={info?.key} info={info}
                        className={selectedId === info?.id ? styles.active : ''}
                        onClick={handleDatasetItemClick}
                        onAdvise={handleAdvise}
                    />;
                });
            return (
                <ul className={styles.list}>
                    {list}
                </ul>
            );
        },
        [datasetIds, selectedId, handleDatasetItemClick, handleAdvise],
    );


    // 提示内容
    const content = (<div className={styles.addText}>
        添加数据集
    </div>);
    const content2 = (<div className={styles.addText}>
        维度指看待事物的角度，如时间维度、其他分类角度等，维度字段的成员值通常可枚举，如饼图的分类字段通常为维度字段
    </div>);
    const content3 = (<div className={styles.addText}>
        度量指量化的指标，如网页浏览次数、网页浏览时长、成交金额等等，如折线图的Y轴字段通常为度量字段
    </div>);

    // 添加数据集的弹窗
    const { open, handleOk, handleCancel, showModal } = useModal();
    const handleAddSet = useCallback((newSetId: string) => {
        onAddSet && onAddSet(newSetId);
    }, [onAddSet]);


    // 侧边展开收缩图标控制
    const [isExpand, setIsExpand] = useState(true);
    const handleCollapse = useCallback(() => {
        setIsExpand(false);
    }, []);
    const handleExpand = useCallback(() => {
        setIsExpand(true);
    }, []);

    return (
        <div className={isExpand ? styles.container : styles.containerCollapse}>
            <PanelExpand
                className={isExpand ? styles.expand : styles.expandCollapse}
                isExpand={isExpand}
                onCollapse={handleCollapse}
                onExpand={handleExpand}
            />

            <Resizable
                className={isExpand ? styles.resizeContainer : styles.resizeCollapse}
                handleClasses={{ right: rightClass }}
                defaultSize={{ width: '140px', height: '100%' }}
                minWidth={160}
                maxWidth={640}
                enable={{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                onResizeStart={() => {
                    setRightClass(prve => styles.resizeRightDrag);
                }}
                onResizeStop={(e, direction, ref, d) => {
                    setRightClass(prev => styles.resizeRight);
                }}
            >
                <Resizable
                    className={styles.setWrap}
                    handleClasses={{ bottom: bottomClass }}
                    defaultSize={{ width: '100%', height: '110px' }}
                    minHeight={24}
                    maxHeight={800}
                    enable={{ top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                    onResizeStart={() => {
                        setBottomClass(prve => styles.resizeBottomDrag);
                    }}
                    onResizeStop={(e, direction, ref, d) => {
                        setBottomClass(prev => styles.resizeBottom);
                    }}
                >
                    <div className={styles.set}>
                        <div className={styles.title}>
                            <span>数据集</span>
                            <Tooltip title={content} placement='right' color='#fff'>
                                <PlusOutlined
                                    style={{ cursor: "pointer" }}
                                    onClick={showModal}
                                />
                            </Tooltip>
                        </div>
                        {getDatasetList()}
                    </div>
                </Resizable>

                {selectedId ? (<><div className={styles.metric}>  {/* 这里样式名把维度度量单词搞反了 */}
                    <div className={styles.title}>
                        <span>维度</span>
                        <Tooltip title={content2} placement='right' color='#fff'>
                            <QuestionCircleOutlined
                                style={{ cursor: "pointer" }}
                                onClick={showModal}
                            />
                        </Tooltip>
                    </div>
                    {getMetricOrAttributeList(VisualType.Attribute)}
                </div>

                    <Resizable
                        className={styles.attributeWrap}
                        handleClasses={{ top: topClass }}
                        defaultSize={{ width: '100%', height: '180px' }}
                        minHeight={24}
                        maxHeight={"100%"}
                        enable={{ top: true, right: false, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                        onResizeStart={() => {
                            setTopClass(prve => styles.resizeTopDrag);
                        }}
                        onResizeStop={(e, direction, ref, d) => {
                            setTopClass(prev => styles.resizeTop);
                        }}
                    >
                        <div className={styles.attribute}>
                            <div className={styles.title}>
                                <span>度量</span>
                                <Tooltip title={content3} placement='right' color='#fff'>
                                    <QuestionCircleOutlined
                                        style={{ cursor: "pointer" }}
                                        onClick={showModal}
                                    />
                                </Tooltip>
                            </div>
                            {getMetricOrAttributeList(VisualType.Metric)}
                        </div>
                    </Resizable></>) : null}


            </Resizable>

            {/* 添加数据集弹窗 */}
            <AddSetModal
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                onAddSet={handleAddSet}
            />

            {/* 推荐图表弹窗 */}
            <AdviseModal
                detailInfo={detailInfo}
                updateDetail={updateFather}
                open={open2}
                onOk={handleOk2}
                onCancel={handleCancel2}
                datasetId={selectedId}
                selectFields={selectFields}
                renderListFunc={getMetricOrAttributeList}
            />
        </div>
    );
};

export default React.memo(DatasetController);
