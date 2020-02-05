


import baseHttpProvider from '../base/baseHttpProvider';

const searchRefundOrderList = (params) => {
  return baseHttpProvider.postFormApi('api/refundOrder/searchRefundOrderList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}


const getRefundDetail = (params) => {
  return baseHttpProvider.getApi('api/refundOrder/getDetail', params)
}


const exportRefund = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/refundOrder/export', params)
  if (result.url) {
    window.open(result.url, '_blank');
  }
}


const requestRefund = (params) => {
  return baseHttpProvider.getApi('api/refundOrder/requestRefund', params)
}

const refund = (params) => {
  return baseHttpProvider.postApi('api/refundOrder/refund', params)
}


export {
  searchRefundOrderList,
  getRefundDetail,
  exportRefund,
  requestRefund,
  refund
}