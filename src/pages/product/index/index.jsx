import React, { Component } from 'react';
import { Card, Select, Input, Button, Icon, Table } from 'antd';

import MyBtn from '../../../components/my-btn';
import { reqProducts } from '../../../api';

import './index.less';

const { Option } = Select;

export default class Indext extends Component {
  state = {
    products: [],
    total: 0,
    loading: true
  }

  // 显示列表
  getProducts = async (pageNum, pageSize) => {
    this.setState({loading: true});
    const result = await reqProducts(pageNum, pageSize);
    if (result) {
      this.setState({
        total: result.total,
        products: result.list,
        loading: false
      })
    }
  }


  componentDidMount() {
    // 初始化显示列表
    this.getProducts(1, 3);
  }

  // 跳转到产品页，添加
  toAppProduct = () => {
    this.props.history.push('/product/update');
  }

  // 跳转到产品页，修改
  toUpdateProduct = (product) => {
    return () => {
      this.props.history.push('/product/update', product);
    }
  }

  render() {

    const { products, total, loading } = this.state;
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name'
      },
      {
        title: '商品描述',
        dataIndex: 'desc'
      },
      {
        title: '价格',
        dataIndex: 'price'
      },
      {
        title: '状态',
        dataIndex: 'status',
        className: 'product-status',
        render: (status) => {
          return status === 1 
            ? <div><Button type="primary">上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary">下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        title: '商品名称',
        className: 'product-status',
        render: (product) => {
          return (
            <div>
              <MyBtn>详情</MyBtn>
              <MyBtn onClick={this.toUpdateProduct(product)}>修改</MyBtn>
            </div>
          )
        }
      }
    ]
    

    return (
      <Card 
        title={
          <div>
            <Select defaultValue={0}>
              <Option key={0} value={0}>根据商品名称</Option>
              <Option key={1} value={1}>根据商品描述</Option>
            </Select>
            <Input className="search-input" placeholder="关键字"/>
            <Button type="primary">搜索</Button>
          </div>
        }
        extra={<Button type="primary" onClick={this.toAppProduct}><Icon type="plus"/>添加产品</Button>}
      >
        <Table
          columns={columns}
          dataSource={products}
          bordered
          rowKey="_id"
          loading={loading}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['3', '6', '9', '12',],
            defaultPageSize: 3,
            total,
            onChange: this.getProducts,
            onShowSizeChange: this.getProducts
          }}
        >

        </Table>
      </Card>
    )
  }
}