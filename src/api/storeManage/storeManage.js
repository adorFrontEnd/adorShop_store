import baseHttpProvider from '../base/baseHttpProvider';


// 计量单位配置
const getStorageList = (params) => {
  return baseHttpProvider.postFormApi('api/storage/list', { page: 1, size: 10, ...params }, { total: true })
}
const putStorage = (params) => {
  return baseHttpProvider.postFormApi('api/storage/putStorage', params)
}
const deleteStorage = (params) => {
  return baseHttpProvider.getApi('api/storage/delete', params)
}

const getSelectList = (params) => {
  return baseHttpProvider.getApi('api/storage/getList', params)
}

export {
  getStorageList,
  putStorage,
  deleteStorage,
  getSelectList
}
