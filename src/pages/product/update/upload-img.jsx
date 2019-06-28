import React, { Component } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../../api';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class UploadImg extends Component {
  state = {
    previewVisible: false,  // 预览状态
    previewImage: '',  // 预览图
    fileList: this.props.imgs.map((img, index) => {
      return {
        uid: -index,
        name: img,
        status: 'done',
        url: `http://localhost:5000/upload/${img}`
      }
    })
  };

  // 取消预览
  handleCancel = () => this.setState({ previewVisible: false });

  // 点击预览
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = async ({ file, fileList }) => {
    if (file.status === 'uploading') {
    } else if (file.status === 'done') {
      fileList[fileList.length - 1].name = file.response.data.name;
      fileList[fileList.length - 1].url = file.response.data.url;
      message.success('上传图片成功', 2);
    } else if (file.status === 'error') {
      message.success('上传图片失败', 2);
    } else {
      console.log(fileList)
      const id = this.props.id;
      const name = file.name;
      const result = await reqDeleteImg(name, id);
      if (result) {
        message.success('删除图片成功', 2);
      }
    }
    this.setState({ fileList });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          // 上传的服务器地址
          action="/manage/img/upload"
          listType="picture-card"
          // 展示图片文件
          fileList={fileList}
          // 预览回调
          onPreview={this.handlePreview}
          // 删除/上传回调
          onChange={this.handleChange}
          // 请求传参
          data={{
            id: this.props.id
          }}
          // 指定文件类型
          name="image"
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}