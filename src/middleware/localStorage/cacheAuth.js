import { getCacheUserInfo } from './login';

const getCacheSpecAuth = () => {
  let userInfo = getCacheUserInfo();
  if (userInfo && userInfo.specialData && userInfo.specialData.length) {
    return userInfo.specialData
  }
}

const isSpecAuthExistByName = (name) => {
  let specAuth = getCacheSpecAuth();
  if (!specAuth || !name) {
    return
  }
  return specAuth.includes(name);
}

const getCacheFirstEnterPage = () => {
  let userInfo = getCacheUserInfo();
  if (userInfo && userInfo.data && userInfo.data.length) {
    let data = userInfo.data.filter(item => isLevel3route(item));
    let route = data.includes("home") ? "home" : data[0];    
    return route
  }
}

const isLevel3route = (route) => {

  if (!route) {
    return;
  }
  let length = route.toString().split('.').length;
  return length == 3;
}

export {
  getCacheSpecAuth,
  isSpecAuthExistByName,
  getCacheFirstEnterPage
} 