import React, { useCallback, CSSProperties } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './index.module.css';

interface IProps {
    style?: CSSProperties,
    className?: string
    isExpand?: boolean,
    onExpand?: () => void,
    onCollapse?: () => void,
}

const PanelExpand: React.FC<IProps> = (props) => {
    const { style = {}, className: cn = '', isExpand = true, onExpand, onCollapse } = props;

    const handleClick = useCallback(() => {
        if (isExpand) {
            onCollapse && onCollapse();
        } else {
            onExpand && onExpand();
        }
    }, [isExpand, onExpand, onCollapse]);

    return (
        <div
            className={`${styles.expand} ${cn}`}
            style={style}
            onClick={handleClick}
        >
            {
                isExpand ?
                    <LeftOutlined className={styles.icon} /> :
                    <RightOutlined className={styles.icon} />
            }
        </div >
    )
}

export default React.memo(PanelExpand);