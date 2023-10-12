import React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import ManageSet from './ManageSet';
import DataSetDetail from './DatasetDetail';
import MyLayout from '../../components/MyLayout';
import { PathNames } from '../../configs/routerConfig';

interface IProps extends RouteComponentProps { }

const DataSet: React.FC<IProps> = (props) => {
    return (
        <MyLayout {...props} style={{ overflow: "auto" }}>
            <Switch>
                <Route path={`/${PathNames.datasetDetail}`} component={DataSetDetail} />
                <Route path={`/${PathNames.dataset}`} component={ManageSet} />
            </Switch>
        </MyLayout>
    )
};

export default DataSet;
