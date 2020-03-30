import baseHttpProvider from '../base/baseHttpProvider';

// 计量单位配置
const getUnitConfigList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/unit/config/getList', { page: 1, size: 10, ...params }, { total: true })
}

const saveUnitOrUpdate = (params) => {
  return baseHttpProvider.postFormApi('api/prd/unit/config/save', params)
}

const deleteUnit = (params) => {
  return baseHttpProvider.getApi('api/prd/unit/config/delete', params)
}

// 公众号
const getPublicConfig = (params) => {
  return baseHttpProvider.getApi('api/sys/syncPublicConfig/getData', params)
}

const updatePublicConfig = (params) => {
  return baseHttpProvider.getApi('api/sys/syncPublicConfig/updateConfig', params)
}

// 网店管家
const getHousekeeperConfig = (params) => {
  return baseHttpProvider.getApi('api/sys/housekeeperConfig/getData', params)
}

const updateHousekeeperConfig = (params) => {
  return baseHttpProvider.postFormApi('api/sys/housekeeperConfig/updateConfig', params)
}

// 审核配置
const getAuditConfig = (params) => {
  return baseHttpProvider.getApi('api/sys/auditConfig/getData', params)
}

const updateConfig = (params) => {
  return baseHttpProvider.postFormApi('api/sys/auditConfig/updateConfig', params)
}


//智能词库
const listDictionary = (params) => {
  return baseHttpProvider.getApi('api/nlp/dictionary/listDictionary', { page: 1, size: 10, ...params }, { total: true })
}

const insertDictionary = (params) => {
  return baseHttpProvider.postFormApi('api/nlp/dictionary/insertDictionary', params);
}

const delDictionary = (params) => {
  return baseHttpProvider.postFormApi('api/nlp/dictionary/delDictionary', params);
}

const itemDictionary = (params) => {
  return baseHttpProvider.getApi('api/nlp/dictionary/itemDictionary', params);
}


export {
  getUnitConfigList,
  saveUnitOrUpdate,
  deleteUnit,
  getPublicConfig,
  updatePublicConfig,
  getHousekeeperConfig,
  updateHousekeeperConfig,
  getAuditConfig,
  updateConfig,
  listDictionary,
  insertDictionary,
  itemDictionary
}
