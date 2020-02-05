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
    let data = userInfo.data;
    let route = data.includes("home") ? "home" : data[0];
    console.log("getCacheFirstEnterPage：" + route)
    return route
  }
}

export {
  getCacheSpecAuth,
  isSpecAuthExistByName,
  getCacheFirstEnterPage
} 