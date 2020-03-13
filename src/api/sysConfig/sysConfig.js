import baseHttpProvider from '../base/baseHttpProvider';


// 计量单位配置
const getUnitConfigList = (params) => {
  return baseHttpProvider.postFormApi('api/unit/config/getList', { page: 1, size: 10, ...params }, { total: true })
}
const saveUnitOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/unit/config/save', params)
}
const deleteUnit = (params) => {
  return baseHttpProvider.getApi('api/unit/config/delete', params)
}
// 退货地址
const getReturnAddressList = (params) => {
  return baseHttpProvider.postFormApi('api/returnAddress/list', { page: 1, size: 10, ...params }, { total: true })
}
const saverReturnAddress = (params) => {
  return baseHttpProvider.postFormApi('api/returnAddress/createAndUpdate', params)
}
const getAddressDetail = (params) => {
  return baseHttpProvider.getApi('api/returnAddress/getDetail', params)
}
const deleteAddress = (params) => {
  return baseHttpProvider.getApi('api/returnAddress/delete', params)
}
// 公众号
const getPublicConfig = (params) => {
  return baseHttpProvider.getApi('api/syncPublicConfig/getData', params)
}
const updatePublicConfig = (params) => {
  return baseHttpProvider.getApi('api/syncPublicConfig/updateConfig', params)
}
// 网店管家
const getHousekeeperConfig = (params) => {
  return baseHttpProvider.getApi('api/housekeeperConfig/getData', params)
}
const updateHousekeeperConfig = (params) => {
  return baseHttpProvider.getApi('api/housekeeperConfig/updateConfig', params)
}
export {
  getUnitConfigList,
  saveUnitOrUpdate,
  deleteUnit,
  getReturnAddressList,
  saverReturnAddress,
  getAddressDetail,
  deleteAddress, getPublicConfig, updatePublicConfig, getHousekeeperConfig, updateHousekeeperConfig
}
