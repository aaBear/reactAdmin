import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';

import logo from './logo.png';
import './index.less';
import { reqLogin } from '../../api';

// 缓存
const Item = Form.Item;


class Login extends Component {
  // 登录函数
  login = (e) => {
    e.preventDefault();
    // 进行校验
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        const { username, password } = values;
        const result = await reqLogin(username, password)
        if (result) {  // 登录成功跳转主页
          this.props.history.replace('/');
        } else {  // 登录失败清空密码
          this.props.form.resetFields(['password']);
        }
      } else {
        console.log('登录表单校验失败：', error);
      }
    })
  }
  
  // 校验逻辑
  validator = (rule, value, callback) => {
    const name = rule.fullField === 'username' ? '用户名' : '密码';
    if (!value) {
      callback(`${name}不能为空`);
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback(`${name}只能包含字母和数字`);
    } else if (value.length < 3) {
      callback(`${name}长度不能小于3位`);
    } else if (value.length > 8) {
      callback(`${name}长度不能大于8位`);
    } else {
      callback();
    }
  }

  render() {
    // 获取表单校验方法
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="login">
          <header className="login-header">
              <img src={logo} alt="logo"/>
              <h1>React后台管理系统</h1>
          </header>
          <section className="login-content">
            <h2>用户登陆</h2>
            <Form onSubmit={this.login} className="login-form">
              <Item>
                {getFieldDecorator(
                    'username',
                    {rules: [{validator: this.validator}]}
                  )(
                    <Input className="login-input" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" autoComplete="off" />
                  )
                } 
              </Item>
              <Item>
                {getFieldDecorator(
                    'password',
                    {rules: [{validator: this.validator}]}
                  )(
                    <Input className="login-input" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码" type="password" />
                  )
                }
              </Item>
              <Item>
                <Button className="login-btn" type="primary" htmlType="submit">登陆</Button>
              </Item>
            </Form>
          </section>
      </div>
    )
  }
}

// 高阶组件增加Form属性，用于表单校验
export default Form.create()(Login);