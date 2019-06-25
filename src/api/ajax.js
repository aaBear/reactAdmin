import axios from 'axios';
import { message } from 'antd';

/*
  处理请求
*/
export default function ajax(url, data = {}, method = 'get') {
  let reqParams = data;
  method = method.toLowerCase();
  // get请求的对象传参方式
  if (method === 'get') reqParams = {params: data};

  return axios[method](url, reqParams)
  .then((res) => {
    const { data } = res;
    if (data.status === 0) {
      return data.data || {};
    } else {
      message.error(data.msg, 2);
    }
  })
  .catch((err) => {
    message.error('网络异常，请刷新重试', 2);
  })
}

