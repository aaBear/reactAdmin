import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';

import MyBtn from '../../../components/my-btn';
import { reqCategory, reqAddProducts, reqUpdateProducts } from '../../../api';
import RichTextEditor from './rich-text-editor';

import './index.less';

const { Item } = Form;

class Update extends Component {

  state = {
    options: []
  }

  // 获取组件实例对象
  richTextRef = React.createRef();

  // 获取分类数据
  getCategories = async (parentId) => {
    const result = await reqCategory(parentId);
    
    if (result) {
      // 一级分类
      if (parentId === '0') {
        this.setState({
          options: result.map((item) => {
            return {
              value: item._id,
              label: item.name,
              isLeaf: false,
            }
          })
        })
      } else {
        // 二级分类
        this.setState({
          options: this.state.options.map((item) => {
            if (item.value === parentId) {
              item.children = result.map((item) => {
                return {
                  value: item._id,
                  label: item.name,
                  isLeaf: false,
                }
              })
            }
            return item
          })
        })
      }

      
    }
  }

  componentDidMount() {
    this.getCategories('0');
    const product = this.props.location.state;
    let categoriesId = [];
    // 判断一级还是二级分类，并添加至数组中
    if (product) {
      if (product.pCategoryId !== '0') {
        categoriesId.push(product.pCategoryId);
        // 请求二级分类
        this.getCategories(product.pCategoryId)
      }
      categoriesId.push(product.categoryId);
    }
    this.categoriesId = categoriesId;
  }

  // 加载二级分类数据
  loadData = async selectedOptions => {
    // 获取数据最后一项
    const targetOption = selectedOptions[selectedOptions.length - 1];
    
    targetOption.loading = true;

    // 发送请求二级数据
    const result = await reqCategory(targetOption.value);
    if (result) {
      targetOption.loading = false;
      targetOption.children = result.map((item) => {
        return {
          label: item.name,
          value: item._id
        }
      })
      
      this.setState({
        options: [...this.state.options]
      });
    }

  };

  // 提交添加请求
  addProduct = (e) => {
    e.preventDefault();
    
    // 校验表单，收集数据
    this.props.form.validateFields(async (errors, values) => {
      if (!errors) {
        // 获取富文本编辑器的实例对象，取文本内容并转为html格式
        const { editorState } = this.richTextRef.current.state;
        const detail = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        
        const { name, desc, price, categoriesId } = values;
        let pCategoryId = '0';
        let categoryId = '';

        if (categoriesId.length === 1) {
          categoryId = categoriesId[0];
        } else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }
        
        let promise = null
        const product = this.props.location.state;
        const options = {name, desc, price, categoryId, pCategoryId, detail};
        // 发请求
        if (product) {
          // 修改
          options._id = product._id;
          promise = reqUpdateProducts(options);
        } else {
          // 添加
          promise = reqAddProducts(options);
        }
        const result = await promise;
        if (result) {
          this.props.history.push('/product/index');
        }
      }
    })
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
    const product = this.props.location.state;
    

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };


    return (

      <Card title={<div><MyBtn onClick={this.goBack}><Icon type="rollback" /></MyBtn>&nbsp;添加商品</div>}>
        <Form {...formItemLayout} onSubmit={this.addProduct}>
          <Item label="商品名称">
            {
              getFieldDecorator(
                'name',
                {
                  rules: [{required: true, message: '商品名称不能为空'}],
                  initialValue: product ? product.name : ''
                }
              )(
                <Input placeholder="请输入商品名称"/>
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator(
                'desc',
                {
                  rules: [{required: true, message: '商品描述不能为空'}],
                  initialValue: product ? product.desc : ''
                }
              )(
                <Input placeholder="请输入商品描述"/>
              )
            }
          </Item>
          <Item label="选择分类" wrapperCol={{span: 5}}>
            {
              getFieldDecorator(
                'categoriesId',
                {
                  rules: [{required: true, message: '选择分类不能为空'}],
                  initialValue: this.categoriesId
                }
              )(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                  changeOnSelect
                  placeholder="请选择分类"
                />
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator(
                'price',
                {
                  rules: [{required: true, message: '商品价格不能为空'}],
                  initialValue: product ? product.price : ''
                }
              )(
                <InputNumber
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/￥\s?|(,*)/g, '')}
                  className="input-price"
                />
              )
            }
          </Item>
          <Item label="商品图片">
            <RichTextEditor/>
          </Item>
          <Item label="商品详情" wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.richTextRef} detail={product ? product.detail : ''}/>
          </Item>
          <Item>
            <Button type="primary" className="add-product-btn" htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(Update);