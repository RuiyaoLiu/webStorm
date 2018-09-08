import React from 'react';
import {Row,Col,Anchor} from 'antd';
import Type from'./charts/type';
import("../../css/slfDesign.css");
const { Link } = Anchor;
export default class SamplesContainer3 extends React.Component {
    render() {
        return (
            <Row >
                <Col span={22}>
                    <Row id="quanqu"><Type area="quanqu"></Type></Row>
                    <Row id={'bantian'}><Type area={"bantian"}></Type></Row>
                    <Row id={'buji'}><Type area={"buji"}></Type></Row>
                    <Row id={'nanwan'}><Type area={"nanwan"}></Type></Row>
                    <Row id={'pinghu'}><Type area={"pinghu"}></Type></Row>
                    <Row id={'henggang'}><Type area={"henggang"}></Type></Row>
                    <Row id={'longcheng'}><Type area={"longcheng"}></Type></Row>
                    <Row id={'longgang'}><Type area={"longgang"}></Type></Row>
                    <Row id={"pingdi"}><Type area={"pingdi"}></Type></Row>
                </Col>
                <Col span={2}>
                    <Row id={'rowList'}>
                        <ul id="demo-toc" >
                            <li title="基本使用"><a href="#quanqu" class="">全区</a></li>
                            <li title="三种大小"><a href="#bantian" class="">坂田</a></li>
                            <li title="基本使用"><a href="#buji" class="">布吉</a></li>
                            <li title="三种大小"><a href="#nanwan" class="">南湾</a></li>
                            <li title="基本使用"><a href="#pinghu" class="">平湖</a></li>
                            <li title="三种大小"><a href="#henggang" class="">横岗</a></li>
                            <li title="基本使用"><a href="#longcheng" class="">龙城</a></li>
                            <li title="三种大小"><a href="#longgang" class="">龙岗</a></li>
                            <li title="基本使用"><a href="#pingdi" class="">坪地</a></li>
                        </ul>
                    </Row>
                </Col>
            </Row>
        )
    }
}
