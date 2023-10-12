import React from 'react'
import { RouteComponentProps } from 'react-router-dom';
import MyLayout from '../../components/MyLayout';

interface IProps extends RouteComponentProps { }

const NotFound: React.FC<IProps> = (props) => {
    return (
        <MyLayout {...props} style={{ overflow: "auto" }}>
            <h1>Not Found</h1>
        </MyLayout>
    );
}

export default NotFound;
