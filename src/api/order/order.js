

import baseHttpProvider from '../base/baseHttpProvider';

const searchPublicSelectMember = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/publicSelectMember', { page: 1, size: 10, ...params }, { total: true })
}

const searchSalesman = (params) => {
  return baseHttpProvider.postFormApi('api/ord/salesman/list', { page: 1, size: 10, ...params }, { total: true });
}

const getPrdSkuList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/sellPrdSku/getPrdSkuList', { page: 1, size: 10, ...params }, { total: true });
}

const smartOrder = (params) => {
  return baseHttpProvider.postFormApi('api/ord/order/smartOrder', params, { total: true });
}

const getOrderlist = (params) => {
  return baseHttpProvider.postFormApi('api/ord/order/list', { page: 1, size: 10, ...params }, { total: true });
}

const getOrderDetail = (params) => {
  return baseHttpProvider.getApi('api/ord/order/listDetail', params);
}

const addOrderLog = (params) => {
  return baseHttpProvider.postFormApi('api/ord/order/addLog', params);
}


export {
  searchPublicSelectMember,
  searchSalesman,
  getPrdSkuList,
  smartOrder,
  getOrderlist,
  getOrderDetail,
  addOrderLog
}

