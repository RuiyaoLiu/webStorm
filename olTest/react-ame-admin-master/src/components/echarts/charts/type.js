import { Chart, Tooltip, Axis, Legend, Pie, Coord ,Bar} from 'viser-react';
import * as React from 'react';
import {Divider, Row,Col,BackTop}from 'antd';
import reqwest from "reqwest";
import("../../../css/slfDesign.css");
const DataSet = require('@antv/data-set');
export default class Type extends React.Component {
    state = {
        area:this.props.area,
        areareal:null,
        data: null,
        sourceData:null,
        scale:null
    };
    fetch = (params = {}) => {
        console.log(params);
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/line2/type',
            method: 'get',
            data: {
                area:params
            },
            type: 'json',
        }).then((data1) => {
            const scale1 = [{
                dataKey: 'percent',
                min: 0,
                formatter: '.0%',
            }];
            var dv = new DataSet.View().source(data1);
            dv.transform({
                type: 'percent',
                field: 'count',
                dimension: 'item',
                as: 'percent'
            });
            var data2 = dv.rows;
            this.setState({
                scale:scale1,
                data:data2,
                sourceData:data1
            })
        });
    }

    onss=()=>{
        var area0=null;
        switch(this.state.area){
            case "quanqu":
                area0= '全区';
                break;
            case "bantian":
                area0= '坂田';
                break;
            case "nanwan":
                area0= '南湾';
                break;
            case "buji":
                area0= '布吉';
                break;
            case "pinghu":
                area0= '平湖';
                break;
            case "henggang":
                area0= '横岗';
                break;
            case "longcheng":
                area0= '龙城';
                break;
            case "longgang":
                area0= '龙岗';
                break;
            case "pingdi":
                area0= '坪地';
                break;
        }
        this.setState({
            areareal:area0
        })
    }
    componentWillMount(){
        this.onss();
        this.fetch(this.props.area);
    }
    render() {
        return (
            <div>
                <Divider orientation="left"><h1>{this.state.areareal}</h1></Divider>
                <Row className="border">
                    <Col span={8}>
                        <h2 align="center">柱状图</h2>
                        <Chart forceFit height={400} data={this.state.sourceData} scale={this.state.scale}>
                            <Tooltip />
                            <Axis />
                            <Bar position="item*count" />
                        </Chart>
                    </Col>
                    <Col span={12}>
                        <h2 align="center">比例图</h2>
                        <Chart forceFit height={400} data={this.state.data} scale={this.state.scale} align={"center"}>
                            <Tooltip showTitle={false} />
                            <Axis />
                            <Legend dataKey="item" />
                            <Coord type="theta" />
                            <Pie
                                position="percent"
                                color="item"
                                style={{ stroke: '#fff', lineWidth: 1 }}
                                label={['percent', {
                                    offset: -40,
                                    textStyle: {
                                        rotate: 0,
                                        textAlign: 'center',
                                        shadowBlur: 2,
                                        shadowColor: 'rgba(0, 0, 0, .45)'
                                    }
                                }]}
                            />
                        </Chart>
                    </Col>
                </Row>
            </div>
        );
    }
}










