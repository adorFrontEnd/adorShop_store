

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

const confirmOrder = (params) => {
  return baseHttpProvider.getApi('api/ord/order/confirm', params);
}

const reviewOrder= (params) => {
  return baseHttpProvider.getApi('api/ord/order/reviewOrder', params);
}


const getOrderShippingData= (params) => {
  return baseHttpProvider.getApi('api/ord/order/shippingData', params);
}

const confirmDelivery= (params) => {
  return baseHttpProvider.postFormApi('api/ord/order/confirmDelivery', params);
}

const confirmReceipt= (params) => {
  return baseHttpProvider.postFormApi('api/ord/order/confirmReceipt', params);
}

const deleteDeliveryRecord= (params) => {
  return baseHttpProvider.getApi('api/ord/order/deleteDeliveryRecord', params);
}

const parseSmartOrderText= (params) => {
  return baseHttpProvider.postFormApi('api/nlp/parse/parse', params);
}


export {
  searchPublicSelectMember,
  searchSalesman,
  getPrdSkuList,
  smartOrder,
  getOrderlist,
  getOrderDetail,
  addOrderLog,
  confirmOrder,
  reviewOrder,
  confirmDelivery,
  getOrderShippingData,
  confirmReceipt,
  deleteDeliveryRecord,
  parseSmartOrderText
}

