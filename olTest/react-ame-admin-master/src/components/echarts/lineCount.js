import React from 'react';
import Counts from './charts/count';
import {Row,Col} from 'antd';
export default class SamplesContainer1 extends React.Component {
    render() {
        return (
            <Col span={24} align={"center"}>
               <Counts></Counts>
            </Col>
        )
    }
}