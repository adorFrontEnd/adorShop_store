
import baseHttpProvider from '../base/baseHttpProvider';

const searchOrderList = (params) => {
  return baseHttpProvider.postFormApi('api/order/searchOrderList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const exportOrder = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/order/export', params)
  if (result.url) {
    window.open(result.url, '_blank');
  }
}

const getOrderByUserId = (params) => {
  return baseHttpProvider.getApi('api/user/getOrderByUserId', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const getOrderByAppId = (params) => {
  return baseHttpProvider.getApi('api/application/getOrderByAppId', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const getOrderDetail = (params) => {
  return baseHttpProvider.getApi('api/order/getDetail', params);
}



export {
  searchOrderList,
  exportOrder,
  getOrderByUserId,
  getOrderByAppId,
  getOrderDetail
}