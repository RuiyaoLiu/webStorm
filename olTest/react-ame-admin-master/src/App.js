import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Breadcrumb } from 'antd';
import { changeBreadCrumbData, getCurrentBreadCrumbData } from "./redux/actions/Common";
import { URL_POST_PLATFORM_LOGOUT } from './utils/ConstantUtil'

import './App.css';
import logo from './styles/imgs/logo.png';
const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
  state = {
    collapsed: false,
    menus: [
      { key: 'list', value: 'List', children:
              [{ key: 'guanxian', value: '管线'},{ key: 'jiedian', value: '节点'}]},
      { key: 'map', value: 'Map', children: [{ key: 'baidu', value: 'Baidu' }, { key: 'google', value: 'Google' }] },
      { key: 'echarts', value: '可视化分析', children: [{ key: 'samples1', value: '管线长度' },{ key: 'samples2', value: '管线数量' },{ key: 'samples3', value: '管线类型' }] },
      { key: 'auth', value: 'Auth', children: [{ key: 'platform', value: 'Platform' }] },
      { key: 'setting', value: 'Setting' }
    ],
    openKeys: ['list'],
  }
  rootSubmenuKeys = ['list', 'map', 'echarts','setting']
  onOpenChange = (openKeys) => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys });
      } else {
          this.setState({
              openKeys: latestOpenKey ? [latestOpenKey] : [],
          });
      }
  }

  render() {
    const { collapsed, menus } = this.state;
    const { currentCrumb } = this.props;
    let obj = JSON.parse(sessionStorage.getItem("currentCrumb")) || currentCrumb;

    return (
      <Layout className="ant-layout-has-sider container">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <img alt="logo" src={logo} />
            <span className={'title' + (collapsed ? ' logo_collapsed' : '')}>ADMIN</span>
          </div>
          <Menu theme="dark" mode="inline"
            defaultOpenKeys={(obj && obj.openKeys) || []}
            selectedKeys={(obj && obj.selectedKeys) || []}
            onClick={this.onClick}
            onOpenChange={this.onOpenChange}
            openKeys={this.state.openKeys}
          >
            <Menu.SubMenu key="list" title={<span><Icon type='table' /><span>信息列表</span></span>}>
                <Menu.Item key="guanxian"><Link to={'/list/guanxian'}>管线</Link></Menu.Item>
                <Menu.Item key="jiedian"><Link to={'/list/jiedian'}>节点</Link></Menu.Item>
            </Menu.SubMenu>


            <Menu.SubMenu key="map" title={<span><Icon type='global' /><span>地图展示</span></span>}>
              <Menu.Item key="Y"><Link to={'/map/baidu'}>管线</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="echarts" title={<span><Icon type='area-chart' /><span>可视化分析</span></span>}>
              <Menu.Item key="samples1"><Link to={'/echarts/lineCount'}>管线长度</Link></Menu.Item>
              <Menu.Item key="samples2"><Link to={'/echarts/lineLength'}>管线数量</Link></Menu.Item>
              <Menu.Item key="samples3"><Link to={'/echarts/lineType'}>管线类型</Link></Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="setting">
              <Link to={'/setting'}>
                <Icon type="setting" />
                <span>Setting</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0}}>
            <Icon className="trigger" type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            <div style={{ float: 'right', marginRight: 16, display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 50, height: 50, lineHeight: '50px', textAlign: 'center', fontSize: 16, color: '#FFFFFF', float: 'left', borderRadius: '50%', background: 'silver' }}>
                CS
                {/* <img src='' style={{ width: 50, height: 50, borderRadius: '50%'}} /> */}
              </div>

              <span style={{ width: 16, display: 'inline-block' }}></span>

              <form action={URL_POST_PLATFORM_LOGOUT} name="logform" style={{ display: 'inline-block' }}>
                <Icon type='logout' onClick={this.logout.bind(this)} />
              </form>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0', color: '#000000' }} separator=">">
              <Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item>
              {this.constructBreadCrumb(menus, (obj && obj.keyPath))}
            </Breadcrumb>
            <div style={{ padding: 5, background: '', width:'88.5%',minHeight: 280,overflow:'auto' ,position: 'fixed',maxHeight:'88%'}}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center',position:'fixed',height:1,bottom:0,width:'100%'}}>@RuiyaoLiu</Footer>
        </Layout>
      </Layout>
    )
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  onClick = ({ item, key, keyPath }) => {
    keyPath = keyPath && keyPath.reverse();

    const crumb = {
      keyPath: keyPath,
      openKeys: keyPath.filter((item) => {
        return !(item === key)
      }),
      selectedKeys: [key]
    }

    this.props.changeBreadCrumbData(crumb);
  }

  logout = () => {
    console.log('logout');
  }

  constructBreadCrumb = (menus, keyPath, links = []) => {
    keyPath && keyPath.forEach((key, index) => {
      menus = menus.filter((menu) => {
        return menu.key === key
      });
      if (menus.length) {
        links.push(menus[0].value);
        if (menus[0].children) {
          this.constructBreadCrumb(menus[0].children, keyPath.slice(index + 1), links);
        }
      }
    })
    if (links.length) {
      return links.map((link, index) => {
        return (<Breadcrumb.Item key={index}> {link} </Breadcrumb.Item>)
      })
    }
  }
}

function mapStateToProps(state) {
  return {
    currentCrumb: state.handleBreadCrumb.currentCrumb,
    state: state
  }
}

export default connect(mapStateToProps, { changeBreadCrumbData, getCurrentBreadCrumbData })(App)
