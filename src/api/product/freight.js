
import baseHttpProvider from '../base/baseHttpProvider';


const searchFreightList = (params) => {
  return baseHttpProvider.postFormApi('api/freight/searchList', { page: 1, size: 10, ...params }, { total: true })
}

const getFreightConfigDetail = (params) => {
  return baseHttpProvider.getApi('api/freight/config/getDetail', params)
}

const saveOrUpdateFreight = (params) => {
  return baseHttpProvider.postFormApi('api/freight/config/saveOrUpdate', params)
}


const saveOrUpdateFreightItem = (params) => {
  return baseHttpProvider.postFormApi('api/freight/saveOrUpdate', params)
}

const getFreightItemDetail = (params) => {
  return baseHttpProvider.postFormApi('api/freight/area/getDetail', params)
}

const deleteTemplate = (params) => {
  return baseHttpProvider.postFormApi('api/freight/delete', params)
}

const getFreightDetail = (params) => {
  return baseHttpProvider.getApi('api/freight/getDetail', params)
}

const deleteTemplateItem = (params) => {
  return baseHttpProvider.getApi('api/freight/area/delete', params)
}



export {
  searchFreightList,
  saveOrUpdateFreight,
  getFreightConfigDetail,
  saveOrUpdateFreightItem,  
  getFreightItemDetail,
  deleteTemplate,
  getFreightDetail,
  deleteTemplateItem
}

