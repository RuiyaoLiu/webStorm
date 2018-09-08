import React from 'react';
import reqwest from 'reqwest';
import {Table} from 'antd';

const columns = [{
    title: 'us_id',
    dataIndex: 'us_id',
    width:100,
    fixed:'left'
}, {
    title: 'ds_id',
    dataIndex: 'ds_id',
    width:100,
    fixed:'left'
}, {
    title: 'material',
    dataIndex: 'material',
    width:100,
    fixed:'left'
} ,{
    title: 'diameter',
    dataIndex: 'diameter',
    width:150,
} ,{
    title: 'feature_p',
    dataIndex: 'feature_P',
    width:150
},{
    title: 'appendant',
    dataIndex: 'appendant',
    width:150,
},{
    title: 'us_x',
    dataIndex: 'us_x',
    width:150,
},{
    title: 'us_y',
    dataIndex: 'us_y',
    width:150,
},{
    title: 'ds_x',
    dataIndex: 'ds_x',
    width:150,
}
,{
    title: 'ds_y',
    dataIndex: 'ds_y',
    width:150,
}
,{
    title: 'us_el',
    dataIndex: 'us_el',
    width:150,
},{
    title: 'us_il',
    dataIndex: 'us_il',
    width:150,
},{
    title: 'us_dept',
    dataIndex: 'us_dept',
    width:150,
},{
    title: 'ds_el',
    dataIndex: 'ds_el',
    width:150,
},{
    title: 'ds_il',
    dataIndex: 'ds_il',
    width:150,
},{
    title: 'ds_dept',
    dataIndex: 'ds_dept',
    width:150,
},{
    title: 'blocking',
    dataIndex: 'blocking',
    width:150,
},{
    title: 'type',
    dataIndex: 'type',
    width:150,
},{
    title: 'is_',
    dataIndex: 'is_',
    width:150,
    fixed:'right'
}
];
export default class ListContainer extends React.Component {
    state = {
        data: [],
        pagination: {},
        loading: false,
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
        });
    }

    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/line2/list',
            method: 'get',
            data: {
                page:1,
                results:20,
                ...params
            },
            type: 'json',
        }).then((data) => {
            const pagination = { ...this.state.pagination };
            // Read total count from server
            pagination.total = data.total;
            pagination.pageSize=20;
            //pagination.total = 250;
            this.setState({
                loading: false,
                data: data.data,
                pagination,
            });
        });
    }
    componentDidMount() {
        this.fetch();
    }
    render() {
        return (
                <Table
                    columns={columns}
                    bordered
                    dataSource={this.state.data}
                    title={() => '管线信息列表'}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    scroll={{ x:'160%',y:540}}
                    size={"small"}
                />
        );
    }
}