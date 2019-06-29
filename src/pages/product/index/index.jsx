import React, { Component } from 'react';
import { Card, Select, Input, Button, Icon, Table, message } from 'antd';

import MyBtn from '../../../components/my-btn';
import { reqProducts, reqSearch, reqUpdateStatus } from '../../../api';

import './index.less';

const { Option } = Select;

export default class Index extends Component {
  state = {
    products: [],
    total: 0,
    loading: true,
    searchType: 'productName',
    searchContent: '',
    pageSize: 3,
    pageNum: 1
  }

  // 显示列表
  getProducts = async (pageNum, pageSize) => {
    this.setState({loading: true});

    const { searchContent, searchType } = this.state;
    let promise = null;
    if (this.isSearch && searchContent) {
      promise = reqSearch({searchType, searchContent, pageSize, pageNum});
    } else {
      promise = reqProducts(pageNum, pageSize);
    }

    const result = await promise;
    if (result) {
      this.setState({
        total: result.total,
        products: result.list,
        loading: false,
        pageNum,
        pageSize
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
  toProduct = (path, product) => {
    return () => {
      this.props.history.push(path, product);
    }
  }

  // 收集关键字
  handleChange = (stateName) => {
    return (e) => {
      let value = '';
      if (stateName === 'searchType') {
        value = e;
      } else {
        value = e.target.value;
        // 搜索内容为空则不搜索
        if (!value) this.isSearch = false;
      }
      this.setState({[stateName]: value});
    }
  }

  // 搜索
  search = () => {
    const { searchContent, pageSize, pageNum } = this.state;
    if (searchContent) {

      this.isSearch = true;
      this.getProducts(pageNum, pageSize);
    } else {
      message.warn('搜索内容不能为空', 2);
    }
  }


  uppateProductStatus = (product) => {
    return async () => {
      const status = 3 - product.status;
      const productId = product._id;
      const result = await reqUpdateStatus(productId, status)
      if (result) {
        message.success('更新商品状态成功', 2);
        this.setState({
          products: this.state.products.map((item) => {
            if (item._id === productId) {
              return {...item, status};
            }
            return item;
          })
        })
        
      }
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
        className: 'product-status',
        render: (product) => {
          return product.status === 1 
            ? <div><Button type="primary" onClick={this.uppateProductStatus(product)}>上架</Button> &nbsp;&nbsp;&nbsp;&nbsp;已下架</div>
            : <div><Button type="primary" onClick={this.uppateProductStatus(product)}>下架</Button> &nbsp;&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        title: '商品名称',
        className: 'product-status',
        render: (product) => {
          return (
            <div>
              <MyBtn onClick={this.toProduct('/product/detail', product)}>详情</MyBtn>
              <MyBtn onClick={this.toProduct('/product/update', product)}>修改</MyBtn>
            </div>
          )
        }
      }
    ]
    

    return (
      <Card 
        title={
          <div>
            <Select defaultValue="productName" onChange={this.handleChange('searchType')}>
              <Option key={0} value="productName">根据商品名称</Option>
              <Option key={1} value="productDesc">根据商品描述</Option>
            </Select>
            <Input className="search-input" onChange={this.handleChange('searchContent')} placeholder="关键字"/>
            <Button type="primary" onClick={this.search}>搜索</Button>
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