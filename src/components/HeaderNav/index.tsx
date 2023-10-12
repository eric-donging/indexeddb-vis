import React from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { pathInfos, defaultPathInfo } from '../../configs/routerConfig';
import { getFirstPath } from '../../utils/pathOperate';

interface IProps extends RouteComponentProps {
    height?: number,
}

const items: MenuProps['items'] = pathInfos.map(info => ({
    key: info.pathName,
    label: info.title
}));

const HeaderNav: React.FC<IProps> = (props) => {
    const { height = 50, history, location } = props;
    let pathName = getFirstPath(location.pathname);
    if (pathName === '') pathName = defaultPathInfo.pathName;
    return (
        <>
            <Menu
                style={{
                    lineHeight: `${height}px`,
                    userSelect: "none"
                }}
                onClick={(info) => {
                    console.log(info.key)
                    history?.push('/' + info.key);
                }}
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[pathName]}
                items={items} />
        </>
    )
};

export default React.memo(HeaderNav);
