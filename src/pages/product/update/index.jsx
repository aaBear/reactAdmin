import React, { Component } from 'react';
import { Card, Icon, Form, Input, Button, Cascader, InputNumber  } from 'antd';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw } from 'draft-js';

import MyBtn from '../../../components/my-btn';
import { reqCategory, reqAddProducts } from '../../../api';
import RichTextEditor from './rich-text-editor';

import './index.less';

const { Item } = Form;

class Update extends Component {

  state = {
    options: []
  }

  // 获取组件实例对象
  richTextRef = React.createRef();

  async componentDidMount() {
    // 加载一级分类数据
    const result = await reqCategory('0');
    if (result) {
      this.setState({
        options: result.map((item) => {
          return {
            value: item._id,
            label: item.name,
            isLeaf: false
          }
        })
      })
    }
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
        
        // 发请求
        const result = await reqAddProducts({name, desc, price, categoryId, pCategoryId, detail});
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
                {rules: [{required: true, message: '商品名称不能为空'}]}
              )(
                <Input placeholder="请输入商品名称"/>
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator(
                'desc',
                {rules: [{required: true, message: '商品描述不能为空'}]}
              )(
                <Input placeholder="请输入商品描述"/>
              )
            }
          </Item>
          <Item label="选择分类" wrapperCol={{span: 5}}>
            {
              getFieldDecorator(
                'categoriesId',
                {rules: [{required: true, message: '选择分类不能为空'}]}
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
                {rules: [{required: true, message: '商品价格不能为空'}]}
              )(
                <InputNumber
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/￥\s?|(,*)/g, '')}
                  className="input-price"
                />
              )
            }
            
          </Item>
          <Item label="商品详情" wrapperCol={{span: 20}}>
            <RichTextEditor ref={this.richTextRef}/>
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