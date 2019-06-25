import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

class UpdateCategory extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  }

  validator = (rule, value, callback) => {
    if (!value) callback('分类名称不能为空');
    if (value === this.props.categoryName) callback('名称重复');
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <Form.Item>
          {getFieldDecorator(
              'categoryName',
              {
                initiaValue: this.props.categoryName,
                rules: [{validator: this.validator}]
              }
            )(
              <Input/>
            )
          }
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateCategory);