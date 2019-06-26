import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

// 登录接口
const reqLogin = (username, password) => ajax('/login', {username, password}, 'post');

// 自动登录校验接口
const reqValidateUer = (id) => ajax('/validate/user', {id}, 'post');

// 天气接口
const reqWeather = () => {
  let cancel = null;
  const promise = new Promise((resolve, reject) => {
    cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2', {}, (err, data) => {
      try {
        if (!err) {
          const { dayPictureUrl, weather } = data.results[0].weather_data[0];
          resolve({
            weatherImg: dayPictureUrl,
            weather
          });
        } else {
          message.error('请求天气信息失败', 2);
          resolve();
        }
      } catch {
        message.error('请求天气信息失败', 2);
          resolve();
      }
    })
  })
  return {
    promise,
    cancel
  }
}

// 商品数据接口
const reqCategory = (parentId) => ajax('/manage/category/list', {parentId});

// 添加分类接口
const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'post');

// 修改分类接口
const reqUpdateCategory = (categoryName, categoryId) => ajax('/manage/category/update', {categoryName, categoryId}, 'post');

export {
  reqLogin,
  reqValidateUer,
  reqWeather,
  reqCategory,
  reqAddCategory,
  reqUpdateCategory
}




