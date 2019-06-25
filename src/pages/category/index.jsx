import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from 'antd';

import MyBtn from '../../components/my-btn';
import { reqCategory, reqAddCategory, reqUpdateCategory } from '../../api';
import AddCategory from './add-category';
import UpdateCategory from './update-category';


import './index.less';

export default class Category extends Component {
  state = {
    categories: [], // 一级分类列表
    addVisible: false,
    updateVisible: false,
  }

  category = {};

  async componentDidMount() {
    // 请求商品(表身)信息并更新
    const result = await reqCategory('0');
    if (result) this.setState({categories: result});
    
  }

  // 切换弹窗
  toggleDisplay = (stateName, stateStatus) => {
    return () => {
      this.setState({
        [stateName]: stateStatus
      })
    }
  }

  // 提交添加请求
  addCategory = () => {
    const { form } = this.addCategoryForm.props;
    // 表单校验
    form.validateFields(async (errors, values) => {
      if (!errors) {
        const { categoryName, parentId } = values;
        // 发送添加请求
        const result = await reqAddCategory(categoryName, parentId);
        if (result) {
          message.success('添加成功', 2);
          // 清空输入框内容
          form.resetFields(['categoryName', 'parentId']);

          // 关闭弹窗
          const options = {addVisible: false};
          // 展示添加后的数据
          if (result.parentId === '0') options.categories = [...this.state.categories, result];
          // 统一更新
          this.setState(options);

        } else {
          message.error('网络异常，请重试', 2);
        }
      }
    })
  }

  endUpdateCategory = () => {
    // 清空表单
    this.updateCategoryForm.props.form.resetFields(['categoryName']);
    this.setState({
      updateVisible: false
    })
  }

  // 保存
  saveCategory = (category) => {
    return () => {
      this.category = category;

      this.setState({
        updateVisible: true
      })
    }
  }

  updateCategory = () => {
    const { form } = this.updateCategoryForm.props;
    form.validateFields(async (errors, values) => {
      if (!errors) {
        const { categoryName } = values;
        const categoryId = this.category._id
        const result = await reqUpdateCategory(categoryName, categoryId);
        if (result) {
          // 深拷贝数组，避免修改原数据
          const categories = this.state.categories.map((category) => {
            let { _id, name, parentId } = category;
            // 修改对应id的名称
            if (_id === categoryId) {
              name = categoryName;
              return {
                _id,
                name,
                parentId
              }
            }
            // 没有修改的数据直接返回
            return category;
          })

          message.success('更新成功', 2);

          form.resetFields(['categoryName']);
          this.setState({
            updateVisible: false,
            categories
          })
        }
      }
    })
  }

  render() {
    const { categories, addVisible, updateVisible } = this.state;

    // 表头
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        className: 'category-operate',
        // 改变当前列显示
        render: category => {
          return (
            <div>
              <MyBtn onClick={this.saveCategory(category)}>修改名称</MyBtn>
              <MyBtn>查看子类</MyBtn>
            </div>
          )
        }
      }
    ];

    return (
      <div>
        <Card title="一级分类列表" extra={<Button type="primary" onClick={this.toggleDisplay('addVisible', true)}><Icon type="plus" />添加品类</Button>}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="_id"
            bordered
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              defaultPageSize: 3,
              pageSizeOptions: ['3', '6', '9', '12']
            }}
          />
          <Modal
            title="添加分类"
            visible={addVisible}
            onOk={this.addCategory}
            onCancel={this.toggleDisplay('addVisible', false)}
            okText="确认"
            cancelText="取消"
          >
            <AddCategory categories={categories} wrappedComponentRef={(form) => this.addCategoryForm = form}/>
          </Modal>

          <Modal
            title="修改分类"
            visible={updateVisible}
            onOk={this.updateCategory}
            onCancel={this.endUpdateCategory}
            okText="确认"
            cancelText="取消"
          >
            <UpdateCategory categoryName={this.category.name} wrappedComponentRef={(form) => this.updateCategoryForm = form}/>
          </Modal>
        </Card>
      </div>
    )
  }
}