const USER_KEY = 'USER_KEY';
const USER_TIME = 'USER_TIME';
const EXPIRES_IN = 1000 * 3600 * 24 * 7;


// 获取用户登录记录
function getUserStorage() {
  const startTime = localStorage.getItem(USER_TIME);
  // 清理过期用户登录记录
  if (Date.now() - EXPIRES_IN > startTime) {
    removeUserStorage();
    return {};
  }
  return JSON.parse(localStorage.getItem(USER_KEY));
}

// 创建用户登录记录
function setUserStorage(data) {
  localStorage.setItem(USER_TIME, Date.now());
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

// 删除用户登录记录
function removeUserStorage() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_TIME);
}

export {
  getUserStorage,
  setUserStorage,
  removeUserStorage
}
