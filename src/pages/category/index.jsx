import React, { Component } from 'react';
import { Card, Button, Icon, Table } from 'antd';

import MyBtn from '../../components/my-btn';
import { reqCategory } from '../../api';

import './index.less';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
  }

  async componentDidMount() {
    // 请求商品(表身)信息并更新
    const result = await reqCategory('0');
    if (result) this.setState({categories: result});
    
  }

  render() {
    // 表头
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        className: 'category-operate',
        // 改变当前列显示
        render: text => {
          return (
            <div>
              <MyBtn>修改名称</MyBtn>
              <MyBtn>查看子类</MyBtn>
            </div>
          )
        }
      }
    ];
    

    return (
      <div>
        <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus" />添加品类</Button>}>
          <Table
            columns={columns}
            dataSource={this.state.categories}
            rowKey="_id"
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: 3,
              pageSizeOptions: ['3', '6', '9', '12']
            }}
          />
        </Card>
      </div>
    )
  }
}