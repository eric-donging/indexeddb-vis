import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import ControlDB from './components/ControlDB';
import ControlTable from './components/ControlTable';
import MyLayout from '../../components/MyLayout';


interface IProps extends RouteComponentProps {
}

const DataBase: React.FC<IProps> = (props) => {
    return (
        <MyLayout {...props} style={{ display: "flex" }}>
            <>
                <ControlDB {...props} style={{ marginRight: '2px' }} />
                <ControlTable {...props}
                    defaultSize={{ width: '200px', height: '100%' }}
                    minWidth={140}
                    maxWidth={380} />
            </>
        </MyLayout>
    )
};

export default DataBase;
