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

const searchWithdrawApplicationList = (params) => {
  return baseHttpProvider.postFormApi('api/withdrawApplication/searchWithdrawApplicationList', { page: 1, size: 10, ...params }, { total: true });
}

const getBalance = (params) => {
  return baseHttpProvider.getApi('api/company/getBalance', params);
}

const withdrawApplicationReq = (params) => {
  return baseHttpProvider.getApi('api/withdrawApplication/application', params);
}

const cancelApplicationReq = (params) => {
  return baseHttpProvider.getApi('api/withdrawApplication/cancel', params);
}

const companyRecharge = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/company/recharge', params)
  if (result.url) {
   return result.url
  }
}


export {
  getDetail,
  saveOrUpdate,
  getPayConfigDetail,
  saveOrUpdatePayConfig,
  getAisleConfigDetail,
  saveOrUpdateAisleConfig,
  searchWithdrawApplicationList,
  getBalance,
  withdrawApplicationReq,
  cancelApplicationReq,
  companyRecharge
}