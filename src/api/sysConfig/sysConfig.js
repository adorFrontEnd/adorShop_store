import baseHttpProvider from '../base/baseHttpProvider';



const getUnitConfigList = (params) => {
  return baseHttpProvider.postFormApi('api/unit/config/getList', { page: 1, size: 10, ...params }, { total: true })
}

export {
  getUnitConfigList
}
