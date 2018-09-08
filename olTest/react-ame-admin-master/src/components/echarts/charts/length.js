import { Chart, Tooltip, Axis, Legend, Bar,StackBar } from 'viser-react';
import * as React from 'react';
import {Divider}from 'antd';
import reqwest from "reqwest";
import("../../../css/slfDesign.css");
const DataSet = require('@antv/data-set');
export default class Length extends React.Component {
    state = {
        data: [],
    };
    fetch = (params = {}) => {
        console.log(params);
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/line2/length',
            method: 'get',
            data: {
                page:1,
                results:20,
                ...params
            },
            type: 'json',
        }).then((data1) => {
            const dv = new DataSet.View().source(data1);
            dv.transform({
                type: 'fold',
                fields: ['0', '1', '2', '3', '4','5','6','7'],
                key: '月份',
                value: '月均降雨量',
            });
            var data2 = dv.rows;
            this.setState({
                data:data2
            })
        });
    }
    componentDidMount(){
        this.fetch();
    }

    render() {
        return (
            <div>
                <div> <Divider><h1>对比图</h1></Divider></div>
            <div className="border">
                <Chart forceFit height={400} data={this.state.data}>
                    <Tooltip />
                    <Axis />
                    <Legend />
                    <Bar position="月份*月均降雨量" color="name" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
                </Chart>
            </div>
                <div><Divider><h1>层叠图</h1></Divider></div>
            <div className="border">
                <Chart forceFit height={400} data={this.state.data}>
                    <Tooltip />
                    <Axis />
                    <Legend />
                    <StackBar position="月份*月均降雨量" color="name" adjust={[{ type: 'stack', marginRatio: 1 / 32 }]}/>
                </Chart>
            </div>
            </div>
        );
    }
}