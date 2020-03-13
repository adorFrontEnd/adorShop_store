

import baseHttpProvider from '../base/baseHttpProvider';


const updateStock = (params) => {
  return baseHttpProvider.postFormApi('api/stock/updateStock', params)
}

const getStockList = (params) => {
  return baseHttpProvider.postFormApi('api/stock/searchList', { page: 1, size: 10, ...params }, { total: true })
}

const getDetail = (params) => {
  return baseHttpProvider.getApi('api/stock/getDetail', params)
}

const getStockLogList = (params) => {
  return baseHttpProvider.postFormApi('api/stockLog/searchList', { page: 1, size: 10, ...params }, { total: true })
}
const batchDeleteStatus = (params) => {
  return baseHttpProvider.getApi('api/stockLog/batchDeleteStatus', params)
}

export {
  updateStock,
  getStockList,
  getDetail,
  getStockLogList,
  batchDeleteStatus
}

