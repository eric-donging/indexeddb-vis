import React, { useCallback, useState } from "react";
import { Select, Tooltip } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import styles from "./index.module.css";
import { MyClassIcon } from "../../../../../components/MyIcon";
import { PannelTheme } from "../../../../../types";

const themeOptions = Object.keys(PannelTheme).map(theme => {
    return <Select.Option key={theme} value={(PannelTheme as any)[theme]}>{(PannelTheme as any)[theme]}</Select.Option>;
});

interface IPorps {
    title: string
    theme: PannelTheme,

    /**
     * 点击返回的箭头
     */
    onBack?: () => void
    /**
     * 主题发生变化
     * @param newTheme 
     * @returns 
     */
    onChangeTheme?: (newTheme: PannelTheme) => void
    /**
     * 点击预览
     */
    onPreview?: () => void
    /**
     * 点击分享 
     */
    onShare?: () => void
    /**
     * 全屏的状态发生改变
     * @param newStatus 
     */
    onChangeFullStatus?: (newStatus: boolean) => void
}

const OperateHeader: React.FC<IPorps> = (props) => {
    // 是否全屏的状态
    const [fullStatus, setFullStatus] = useState(false);

    const changeFullStatus = useCallback(() => {
        setFullStatus(prev => {
            props.onChangeFullStatus && props.onChangeFullStatus(!prev);
            return !prev;
        })
    }, [props]);

    const handleThemeChange = useCallback((e: PannelTheme) => {
        props.onChangeTheme && props.onChangeTheme(e);
    }, [props]);

    const content1 = (<div className={styles.iconText}>预览</div>);
    const content2 = (<div className={styles.iconText}>分享仪表盘盘</div>);
    const content3 = (<div className={styles.iconText}>进入专注模式，全屏超大操作空间</div>);
    const content4 = (<div className={styles.iconText}>退出专注模式</div>);

    return <header className={styles.head}>
        <div>
            <span onClick={props.onBack}>
                <LeftOutlined />
            </span>
            <span>{props.title}</span>
        </div>

        <div>
            <Select
                className={styles.select}
                defaultValue={props.theme}
                style={{ width: 160 }}
                onChange={handleThemeChange}
            >
                {themeOptions}
            </Select>

            <Tooltip title={content1} color="#fff" placement="bottom">
                <div onClick={props.onPreview}><MyClassIcon type="icon-yulan" className={styles.icon} /></div>
            </Tooltip>
            <Tooltip title={content2} color="#fff" placement="bottom">
                <div onClick={props.onShare}><MyClassIcon type="icon-fenxiang" className={styles.icon} /></div>
            </Tooltip>
            {
                fullStatus ? <Tooltip title={content4} color="#fff" placement="left">
                    <div onClick={changeFullStatus}>
                        <MyClassIcon type="icon-quanpingsuoxiao" className={styles.icon} />
                    </div>
                </Tooltip> : <Tooltip title={content3} color="#fff" placement="left">
                    <div onClick={changeFullStatus}>
                        <MyClassIcon type="icon-quanpingfangda" className={styles.icon} />
                    </div>
                </Tooltip>
            }
        </div>
    </header >
};

export default React.memo(OperateHeader);
