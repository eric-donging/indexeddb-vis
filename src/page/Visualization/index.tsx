import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import MyLayout from '../../components/MyLayout';
import { PathNames } from '../../configs/routerConfig';
import ManagePannel from './ManagePannel';
import PannelDetail from './PannelDetail';

interface IProps extends RouteComponentProps { }

const Visualization: React.FC<IProps> = (props) => {
    // const style: CSSProperties = (props.location.pathname) === `/${PathNames.visualDetail}` ?
    //     { display: "flex" } : { overflow: "auto" };

    return (
        <MyLayout {...props} style={{ overflow: "auto" }}>
            <Switch>
                <Route path={`/${PathNames.visualDetail}`} component={PannelDetail} />
                <Route path={`/${PathNames.visual}`} component={ManagePannel} />
            </Switch>
        </MyLayout>
    );
}

export default Visualization;
