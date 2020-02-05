import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js'

const deleteOper = (params) => {
  return baseHttpProvider.getApi('api/oper/delete', params);
}

const searchOperList = (params) => {
  return baseHttpProvider.postFormApi('api/oper/searchOperList', { page: 1, size: 10, ...params }, { total: true });
}

const saveOrUpdate = (params) => {
  if (params && params.password) {
    params.password = md5(params.password);
  } 
  return baseHttpProvider.postFormApi('api/oper/saveOrUpdate', params, { total: true });
}
const disableStatus = (params) => {
  if (params && params.password) {
    params.password = md5(params.password);
  } 
  return baseHttpProvider.getApi('api/oper/disable', params, { total: true });
}

export {
  deleteOper,
  searchOperList,
  saveOrUpdate,
  disableStatus
}