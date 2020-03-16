

import baseHttpProvider from '../base/baseHttpProvider';


const updateStock = (params) => {
  return baseHttpProvider.postFormApi('api/str/stock/updateStock', params)
}

const getStockList = (params) => {
  return baseHttpProvider.postFormApi('api/str/stock/searchList', { page: 1, size: 10, ...params }, { total: true })
}

const getDetail = (params) => {
  return baseHttpProvider.getApi('api/str/stock/getDetail', params)
}

const getStockLogList = (params) => {
  return baseHttpProvider.postFormApi('api/str/stockLog/searchList', { page: 1, size: 10, ...params }, { total: true })
}
const batchDeleteStatus = (params) => {
  return baseHttpProvider.getApi('api/str/stockLog/batchDeleteStatus', params)
}

export {
  updateStock,
  getStockList,
  getDetail,
  getStockLogList,
  batchDeleteStatus
}

