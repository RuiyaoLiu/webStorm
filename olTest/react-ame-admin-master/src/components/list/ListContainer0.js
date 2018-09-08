import React from 'react';
import reqwest from 'reqwest';
import {Table,Divider,Popconfirm,Form,Input,InputNumber} from 'antd';
//###############################################
const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };
    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}
//################################################
export default class ListContainer extends React.Component {
    constructor(props){
        super(props);
        this.columns=[{
            title: 'id',
            dataIndex: 'id',
            width:"20%",
        }, {
            title: 'name',
            dataIndex: 'name',
            width:"20%",
            render: text => <a href="javascript:;">{text}</a>,
            editable:true
        }, {
            title: 'job',
            dataIndex: 'job',
            width:"20%",
            editable:true
        },{
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                const editable = this.isEditing(record);
                return (
                    <div>
                        {editable ? (
                            <span>
                                  <EditableContext.Consumer>
                                    {form => (
                                        <a
                                            href="javascript:;"
                                            onClick={() => this.save(form, record.id)}
                                            style={{ marginRight: 8 }}
                                        >
                                            Save
                                        </a>
                                    )}
                                  </EditableContext.Consumer>
                                  <Popconfirm
                                      title="Sure to cancel?"
                                      onConfirm={() => this.cancel(record.id)}
                                  >
                                    <a>Cancel</a>
                                  </Popconfirm>
                                </span>
                        ) : (
                            <span>
                            <a onClick={() => this.edit(record.id)}>Edit</a>
                            <Divider type={"vertical"}/>
                            <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.id)}
                            >
                            <a>delete</a>
                            </Popconfirm>
                            </span>
                        )}
                    </div>
                );
            },
        }];
        this.state={
            data: [],
            pagination: {},
            loading: false,
            editingKey: ''
        };
    }
    //####################START##################
    isEditing = (record) => {
        return record.id === this.state.editingKey;
    };
    edit(key) {
        this.setState({ editingKey: key });
    }
    save(form, key) {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            //数据库操作
            this.handleUpdate(row,key);
            //前端操作
            const newData = [...this.state.data];
            const index = newData.findIndex(item => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                this.setState({ data: newData, editingKey: '' });
            } else {
                newData.push(row);
                this.setState({ data: newData, editingKey: '' });
            }
        });
    }
    cancel = () => {
        this.setState({ editingKey: '' });
    };
    //#############END#######################
    handleDelete = (key) => {
        this.delete({
            id:key
        });
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.id !== key)});
    }
    handleUpdate = (row,key) => {
        this.update({
            id:key,
            name:row.name,
            job:row.job
        });
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.id !== key)});
    }
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

    //################操作开始###################
    //删除条目
    delete = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/user/delete/',
            method: 'get',
            data: {
                ...params
            },
            type: 'json',
        }).then((data) => {
            //alert("hahahaha");
            //pagination.total = 250;
            this.setState({loading:false});
            return "success";
        });
    }
    //更新条目
    update = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/user/update/',
            method: 'get',
            data: {
                ...params
            },
            type: 'json',
        }).then((data) => {
            //alert("hahahaha");
            //pagination.total = 250;
            this.setState({loading:false});
            return "success";
        });
    }
    //获取信息网页列表信息
    fetch = (params = {}) => {
        this.setState({ loading: true });
        reqwest({
            url: 'ssmDemo2/user/list',
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
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'id' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <Table
                components={components}
                columns={columns}
                bordered
                dataSource={this.state.data}
                title={() => '管线信息列表'}
                pagination={this.state.pagination}
                loading={this.state.loading}
                onChange={this.handleTableChange}
                scroll={{ x:"100%",y: 600}}
                size={"small"}
            />
        );
    }
}