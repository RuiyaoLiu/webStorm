import React from 'react';
import Length from './charts/length';
import {Row,Col} from 'antd';
export default class SamplesContainer2 extends React.Component {
    render() {
        return (
            <Col span={24} align={"center"}>
               <Length></Length>
            </Col>
        )
    }
}