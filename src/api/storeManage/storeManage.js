import baseHttpProvider from '../base/baseHttpProvider';


// 仓库列表
const getStorageList = (params) => {
  return baseHttpProvider.postFormApi('api/str/storage/list', { page: 1, size: 10, ...params }, { total: true })
}
const putStorage = (params) => {
  return baseHttpProvider.postFormApi('api/str/storage/putStorage', params)
}
const deleteStorage = (params) => {
  return baseHttpProvider.getApi('api/str/storage/delete', params)
}

const getSelectList = (params) => {
  return baseHttpProvider.getApi('api/str/storage/getList', params)
}

export {
  getStorageList,
  putStorage,
  deleteStorage,
  getSelectList
}
