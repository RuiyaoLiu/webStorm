import React from 'react';
import { Drawer, Button } from 'antd';
class Uaa extends React.Component {
    render() {
        return (
            <div>
                <Drawer
                    title="Basic Drawer"
                    placement="right"
                    closable={false}
                    onClose={this.props.onClick}
                    visible={this.props.visible}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>
            </div>
        );
    }
}
export default Uaa;
