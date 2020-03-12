

import baseHttpProvider from '../base/baseHttpProvider';


const searchPublicSelectMember = (params) => {
  return baseHttpProvider.postFormApi('api/user/publicSelectMember', { page: 1, size: 10, ...params }, { total: true })
}

const searchSalesman = (params) => {
  return baseHttpProvider.postFormApi('api/salesman/list', { page: 1, size: 10, ...params }, { total: true })
}

const getPrdSkuList = (params) => {
  return baseHttpProvider.postFormApi('api/sellPrdSku/getPrdSkuList', { page: 1, size: 10, ...params }, { total: true })
}

export {
  searchPublicSelectMember,
  searchSalesman,
  getPrdSkuList  
}
