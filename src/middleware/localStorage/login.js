


const isUserLogin = () => {
  return getCacheToken() ? true : false;
}
const getCacheToken = () => {
  let userInfo = getCacheUserInfo();
  if (userInfo && userInfo.token) {
    return userInfo.token;
  }
  return null;
}

const getCacheRouterConfig = () => {
  let userInfo = getCacheUserInfo();
  if (userInfo && userInfo.data) {
    return userInfo.data;
  }
  return null;
}

const userLogout = (token) => {
  window.localStorage['_userInfo'] = null;
}

const setCacheUserInfo = (userInfo) => {
  if (!userInfo) {
    window.localStorage['_userInfo'] = null;
  } else {
    if (userInfo.token) {
      userInfo.token = decodeURIComponent(userInfo.token);
    }
    window.localStorage['_userInfo'] = JSON.stringify(userInfo);
  }
}

const getCacheUserInfo = () => {
  let userInfo = window.localStorage['_userInfo'];
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null
}

const setCacheAccountList = (list) => {
  if (!list) {
    window.localStorage['_accountList'] = null;
  } else {

    window.localStorage['_accountList'] = JSON.stringify(list);
  }
}

const getCacheAccountList = () => {
  let list = window.localStorage['_accountList'];
  if (list && list.length) {
    return JSON.parse(list);
  }
  return null
}

const getCacheShopName = () => {
  let userInfo = getCacheUserInfo();
  return userInfo && userInfo.shopName ? userInfo.shopName : ""
}


export {
  setCacheUserInfo,
  getCacheRouterConfig,
  getCacheToken,
  getCacheUserInfo,
  isUserLogin,
  userLogout,
  getCacheAccountList,
  setCacheAccountList,
  getCacheShopName
} 