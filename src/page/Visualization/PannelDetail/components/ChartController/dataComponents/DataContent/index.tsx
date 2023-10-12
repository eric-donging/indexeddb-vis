import React from "react";
import { ChartType } from "../../../../../charts/types";
import FieldsWrapper from "../FieldsWrapper";
import { DataConfig, DataItemConfig, dataRenderConfigs } from "../../../../../charts/dataConfigs";
import { FieldInWrap } from "../../types";


interface IProps {
    type: ChartType
    dataConfig: DataConfig[]
    /**
     * 冗余字段，为了不同图表的每一项wrap key值不同
     */
    selectChartId?: string
    /**
     * 有一个wrapper要添加字段
     * @returns 
     */
    onAddField?: (configIdx: number, newField: FieldInWrap) => void

    onDeleteField?: (configIdx: number, fieldName: string) => void

    onEditField?: (configIdx: number, fieldName: string, adjustObj: object) => void
}

const DataContent: React.FC<IProps> = (props) => {
    const { type, dataConfig, selectChartId, onAddField, onDeleteField, onEditField } = props;
    const itemConfig: DataItemConfig[] = dataRenderConfigs[type];
    const dataConfigRenderList = itemConfig.map((c, idx) => {
        const handleAddField = (newField: FieldInWrap) => {
            onAddField && onAddField(idx, newField);
        };

        const handleDeleteField = (fieldName: string) => {
            onDeleteField && onDeleteField(idx, fieldName);
        };

        const handleEditField = (fieldName: string, adjustObj: object) => {
            onEditField && onEditField(idx, fieldName, adjustObj);
        };

        return <FieldsWrapper
            key={`${idx}-${selectChartId}`}
            title={c.title} limit={c.limit}
            type={c.type} fields={dataConfig[idx].fields} allow={c.allow}
            onAddField={handleAddField}
            onDeleteField={handleDeleteField}
            onEditField={handleEditField}
        />
    });
    return <div>
        {dataConfigRenderList}
    </div>
};

export default React.memo(DataContent);
