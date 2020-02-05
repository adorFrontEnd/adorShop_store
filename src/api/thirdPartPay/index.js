import { md5 } from '../../utils/signMD5.js';
import baseHttpProvider from '../base/baseHttpProvider';

const getDetail = (params) => {
  return baseHttpProvider.getApi('api/withdraw/getDetail', params);
}

const saveOrUpdate = (params) => {
  if (params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('api/withdraw/saveOrUpdate', params);
}

const getPayConfigDetail = (params) => {
  return baseHttpProvider.getApi('api/payConfig/getDetail', params);
}

const saveOrUpdatePayConfig = (params) => {
  return baseHttpProvider.postFormApi('api/payConfig/saveOrUpdate', params);
}

const getAisleConfigDetail = (params) => {
  return baseHttpProvider.getApi('api/payAisleConfig/getDetail', params);
}


const saveOrUpdateAisleConfig = (params) => {
  return baseHttpProvider.postFormApi('api/payAisleConfig/saveOrUpdate', params);
}

const checkConfig = (params) => {
  return baseHttpProvider.postFormApi('api/payConfig/check', params);
}

export {
  getDetail,
  saveOrUpdate,
  getPayConfigDetail,
  saveOrUpdatePayConfig,
  getAisleConfigDetail,
  saveOrUpdateAisleConfig,
  checkConfig
}