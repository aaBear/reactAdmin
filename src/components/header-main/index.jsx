import React, { Component } from 'react';
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';

import MyBtn from '../my-btn';
import { getUserStorage, removeUserStorage } from '../../utils/storage-tools';
import { reqWeather } from '../../api';
import menuList from '../../config/menuconfig';

import './index.less';

const { confirm } = Modal;

class HeaderMain extends Component {
  state = {
    sysTime: Date.now(),
    weather: '晴',
    weatherImg: 'http://api.map.baidu.com/images/weather/day/qing.png'
  }

  

  componentWillMount() {
    this.username = getUserStorage().username;
    this.title = this.getTitle(this.props);
  }

  async componentDidMount() {
    // 更新时间
    setInterval(() => {
      this.setState({
        sysTime: Date.now()
      })
    }, 1000);

    // 更新天气
    const result = await reqWeather();
    if (result) this.setState(result);
  }

  componentWillReceiveProps(nextProps) {
    this.title = this.getTitle(nextProps)
  }

  // 用户注销
  logo = () => {
    confirm({
      okText: '确定',
      cancelText: '取消',
      title: '您确定要注销账户吗',
      onOk: () => {
        removeUserStorage();
        this.props.history.replace('/login');
      }
    });
  }

  // 获取菜单title
  getTitle = (nextProps) => {
    const { pathname } = nextProps.location;
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      if (menu.children) {
        for (let j = 0; j < menu.children.length; j++) {
          const child = menu.children[j];
          if (child.key === pathname) return child.title;
        }
      } else {
        if (menu.key === pathname) return menu.title;
      }
    }
  }

  render() {
    const { sysTime, weather, weatherImg } = this.state;

    return (
      <div>
        <div className="header-main-top">
          <span>欢迎 {this.username}</span>
          <MyBtn onClick={this.logo}>退出</MyBtn>
        </div>
        <div className="header-main-bottom">
          <span className="header-main-left">{this.title}</span>
          <div className="header-main-right">
            <span>{dayjs(sysTime).format('YYYY-MM-DD HH:mm:ss')}</span>
            <img src={weatherImg} alt="weatherImg" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(HeaderMain);