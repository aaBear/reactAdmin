import React, { Component } from 'react';
import { Card, Button, Icon, Table, Pagination } from 'antd';

import MyBtn from '../../components/my-btn'

import './index.less';

export default class Category extends Component {
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
    // 表身
    const data = [
      {
        key: '1',
        name: '手机',
        operate: '',
      },
      {
        key: '2',
        name: '电脑',
        operate: '',
      },
      {
        key: '3',
        name: '平板',
        operate: '',
      },
      {
        key: '4',
        name: '鼠标',
        operate: '',
      },
      {
        key: '5',
        name: '键盘',
        operate: '',
      },
      {
        key: '6',
        name: '耳机',
        operate: '',
      },
      {
        key: '7',
        name: '笔记本',
        operate: '',
      },
      {
        key: '8',
        name: '音响',
        operate: '',
      },
      {
        key: '9',
        name: '麦克风',
        operate: '',
      },
      {
        key: '10',
        name: '座机',
        operate: '',
      },
    ];

    return (
      <div>
        <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus" />添加品类</Button>}>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: 3,
              pageSizeOptions: ['3', '6', '9', '12'],
            }}
          />
        </Card>
      </div>
    )
  }
}