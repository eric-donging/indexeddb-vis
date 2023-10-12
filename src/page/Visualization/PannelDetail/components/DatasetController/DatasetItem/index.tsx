import React, { useCallback, useState } from "react";
import { Menu, Popover } from "antd";
import { DownOutlined } from '@ant-design/icons';
import cn from "classnames";
import { ClassAndStyle } from "../../../../../../types";
import { DatasetInfo } from "../../../../../Dataset/ManageSet";
import styles from "./index.module.css";
/**
 * 本文件里要使用数据集表里面的类型设置样式、以及元素生成的方法类型，暂时这么引入，最好把相同的地方封装组件
 */
import styles2 from "../../../../../Dataset/DatasetDetail/DatasetTable/index.module.css";
import { getItem } from "../../../../../Dataset/DatasetDetail/DatasetTable";

interface IProps extends ClassAndStyle {
    info: DatasetInfo | undefined,
    onClick?: (info: DatasetInfo) => void
    onAdvise?: () => void
}

const items = [
    getItem('编辑', 'edit', null, undefined, styles.menu),
    getItem('重命名', 'rename', null, undefined, styles2.subMenu),
    getItem('图表推荐', 'advise', null, undefined, styles2.subMenu),
    getItem('从仪表盘移除', 'delete', null, undefined, styles2.subMenu),
];

const DatasetItem: React.FC<IProps> = (props) => {
    const { className: cName = '', info, onClick, onAdvise } = props;

    const handleClick = useCallback(() => {
        onClick && onClick(info!);
    }, [info, onClick]);

    const [poverOpen, setPoverOpen] = useState(false);
    const handleOpenChange = useCallback((newOpen: boolean) => {
        setPoverOpen(newOpen);
    }, []);


    const handleOp = useCallback((e: any) => {
        const key: string = e.key;
        switch (key) {
            case "edit":
                console.log("edit");
                break;
            case "rename":
                console.log("rename");

                break;
            case "advise":
                console.log("advise");
                setPoverOpen(false);
                onAdvise && onAdvise();
                break;
            case "delete":
                console.log("delete");
                break;
            default:
                break;
        }
    }, [onAdvise]);

    return (
        <>
            <li
                className={`${cName} ${styles.container}`}
                onClick={handleClick}
            >
                <span>{info!.name}</span>
                <Popover
                    className={styles.isShow}
                    trigger="click"
                    open={poverOpen}
                    content={
                        <Menu
                            items={items}
                            className={cn(styles2.menu, styles.menu)}
                            onClick={handleOp}
                            selectedKeys={[]}
                        />
                    }
                    overlayInnerStyle={{
                        padding: 0,
                    }}
                    onOpenChange={handleOpenChange}
                >
                    <DownOutlined style={{ cursor: "pointer", color: "#333" }} />
                </Popover>
            </li>
        </>
    );
};

export default React.memo(DatasetItem);
