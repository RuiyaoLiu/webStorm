import { Chart, Tooltip, Axis, Legend, Bar,StackBar } from 'viser-react';
import * as React from 'react';
import reqwest from "reqwest";
const DataSet = require('@antv/data-set');

const sourceData = [
    { name: 'london', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
    { name: 'Berlin', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 },
    { name: 'beijing', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
    { name: 'zhengzhou', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 },
    { name: 'shanghai', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
    { name: 'shenzhen', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 },
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
    type: 'fold',
    fields: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'],
    key: '月份',
    value: '月均降雨量',
});
const data = dv.rows;

export default class Bars extends React.Component {
    fetch = (params = {}) => {
        console.log(params);
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/line2/list',
            method: 'get',
            data: {},
            type: 'json',
        }).then((data) => {
            this.setState({
                data: data.data,
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }

    render() {
        return (
            <div>
            <div>
                <Chart forceFit height={400} data={data}>
                    <Tooltip />
                    <Axis />
                    <Legend />
                    <Bar position="月份*月均降雨量" color="name" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
                </Chart>
            </div>
                <div><h1>层叠图</h1></div>
            <div>
                <Chart forceFit height={400} data={data}>
                    <Tooltip />
                    <Axis />
                    <Legend />
                    <StackBar position="月份*月均降雨量" color="name" />
                </Chart>
            </div>
            </div>
        );
    }
}