import baseHttpProvider from '../base/baseHttpProvider';



const getUnitConfigList = (params) => {
  return baseHttpProvider.postFormApi('api/unit/config/getList', { page: 1, size: 10, ...params }, { total: true })
}
const saveUnitOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/unit/config/save', params)
}
const deleteUnit = (params) => {
  return baseHttpProvider.getApi('api/unit/config/delete', params)
}

export {
  getUnitConfigList,
  saveUnitOrUpdate,
  deleteUnit
}
