import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

import logo from './logo.png';
import './index.less';

const Item = Form.Item;

class Login extends Component {

    login = (e) => {
        e.preventDefault();
    }
    
    render() {
        // const { getFieldDecorator } = this.props.form;
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
                            <Input className="login-input" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名"></Input>
                        </Item>
                        <Item>
                            <Input className="login-input" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="密码" type="password"></Input>
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

export default Login;