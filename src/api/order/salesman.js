

import baseHttpProvider from '../base/baseHttpProvider';


const saveOrUpdateSalesman = (params) => {
  return baseHttpProvider.postFormApi('api/ord/salesman/putSalesman', params)
}

const getSalesmanList = (params) => {
  return baseHttpProvider.postFormApi('api/ord/salesman/list', { page: 1, size: 10, ...params }, { total: true })
}

const deleteSalesman = (params) => {
  return baseHttpProvider.getApi('api/ord/salesman/delete', params)
}

export {
  saveOrUpdateSalesman,
  getSalesmanList,
  deleteSalesman
}

