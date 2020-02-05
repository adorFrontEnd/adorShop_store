
import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js'
import Toast from '../../utils/toast.js'

const searchCompanyList = (params) => {
  return baseHttpProvider.postFormApi('api/company/searchCompanyList', { page: 1, size: 10, ...params }, { total: true });
}

const saveOrUpdateCompany = (params) => {
  if (params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('api/company/saveOrUpdate', params);
}

const deleteCompany = (params) => {
  return baseHttpProvider.getApi('api/company/delete', params);
}

const getCompanyDetail = (params) => {
  return baseHttpProvider.getApi('api/company/getDetail', params);
}

const getAllCompany = (params) => {
  return baseHttpProvider.getApi('api/company/getAll', params);
}




export {
  searchCompanyList,
  saveOrUpdateCompany,
  deleteCompany,
  getCompanyDetail,
  getAllCompany
  
}