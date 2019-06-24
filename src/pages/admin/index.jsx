import React, {Component} from 'react';
import { Layout } from 'antd';
import { Route, Redirect, Switch } from 'react-router-dom';

import LeftNav from '../../components/left-nav';
import HeaderMain from '../../components/header-main';
import { getUserStorage } from '../../utils/storage-tools';
import { reqValidateUer } from '../../api/index';
import Home from '../home';
import Category from '../category';
import Product from '../product';
import User from '../user';
import Role from '../role';
import Bar from '../bar';
import Line from '../line';
import Pie from '../pie';


const { Header, Content, Footer, Sider } = Layout;



export default class Admin extends Component {
  state = {
    // false:展开 true:隐藏
    collapsed: false
  }

  // 导航条左侧收缩
  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  // 校验用户是否已登录过
  async componentWillMount() {
    const user = getUserStorage();
    if (user || user._id) {
      const result = await reqValidateUer(user._id);
      if (result) return;
    }
    this.props.history.replace('/login');
  }

  render() {
    const { collapsed } = this.state;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <LeftNav collapsed={collapsed} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0, minHeight: 100 }}>
            <HeaderMain/>            
          </Header>
          <Content style={{ margin: '25px 16px' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Switch>
                <Route path="/home" component={Home}/>
                <Route path="/products/category" component={Category}/>
                <Route path="/products/product" component={Product}/>
                <Route path="/user" component={User}/>
                <Route path="/role" component={Role}/>
                <Route path="/charts/bar" component={Bar}/>
                <Route path="/charts/line" component={Line}/>
                <Route path="/charts/pie" component={Pie}/>
                <Redirect to="/home"/>
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            推荐使用谷歌浏览器，可以获得更佳页面操作体验
          </Footer>
        </Layout>
      </Layout>
    )
  }
}