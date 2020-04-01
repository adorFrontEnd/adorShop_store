

import baseHttpProvider from '../base/baseHttpProvider';
import uploadBaseHttpProvider from '../base/uploadBaseHttpProvider';

/* 通过市的名称查询其对应的code以及其省对应的code
cityName
areaName
*/

const getAreaCode = (params) => {
  return baseHttpProvider.getApi('api/sys/city/getAreaCode', params)
}

export {
  getAreaCode
}