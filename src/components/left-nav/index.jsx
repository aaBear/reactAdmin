import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';

import menuList from '../../config/menuconfig';

import logo from '../../assets/images/logo.png';
import './index.less';

const { Item, SubMenu } = Menu;

class LeftNav extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired
  }

  // 创建一级菜单
  createMenu = (menu) => {
    return (
      <Item key={menu.key}>
        <Link to={menu.key}>
          <Icon type={menu.icon} />
          <span>{menu.title}</span>
        </Link>
      </Item>
    )
  }

  componentWillMount() {
    let { pathname } = this.props.location;

    if (/^\/product\//.test(pathname)) pathname = pathname.slice(0, 8);


    let toHome = true;
    // 生成导航条菜单
    this.menus = menuList.map((menu) => {
      const children = menu.children;
      if (children) {
        // 二级菜单
        return (
          <SubMenu 
            key={menu.key}
            title={
              <span>
                <Icon type={menu.icon} />
                <span>{menu.title}</span>
              </span>
            }
          >
            { 
              children.map((child) => {
                if (child.key === pathname ) {
                  // 二级菜单时需展开一级菜单
                  // 初始化展开的菜单
                  this.openKey = menu.key;
                  toHome = false;
                }
                return this.createMenu(child);
              })
            }
          </SubMenu>
        )
      } else {
        if (menu.key === pathname) toHome = false;
        // 一级菜单
        return this.createMenu(menu);
      }
    })
    
    // 初始化选中的菜单
    this.selectedKey = toHome ? '/home' : pathname;
  }

  render() {
    const { collapsed } = this.props;
    return (
      <div>
        <Link className="left-nav-logo" to="/home">
          <img src={logo} alt="logo"/>
          <h1 style={{display: collapsed ? 'none' : 'block'}}>硅谷后台</h1>
        </Link>
        <Menu theme="dark" defaultSelectedKeys={[this.selectedKey]} defaultOpenKeys={[this.openKey]} mode="inline">
          { this.menus }
        </Menu>
      </div>
    )
  }
}

// 高阶组件，给非路由组件添加路由组件的三大属性(history/location/match)
export default withRouter(LeftNav);