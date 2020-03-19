import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js'

const registered = (params) => {
  if (params && params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('auth/registered', params, { tokenless: true });
}


const deleteOper = (params) => {
  return baseHttpProvider.getApi('api/sys/oper/delete', params);
}

const searchOperList = (params) => {
  return baseHttpProvider.postFormApi('api/sys/oper/searchList', { page: 1, size: 10, ...params }, { total: true });
}

const saveOrUpdate = (params) => {

  return baseHttpProvider.postFormApi('api/sys/oper/saveOrUpdate', params, { total: true });
}
const disableStatus = (params) => {
  if (params && params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.getApi('api/sys/oper/disable', params, { total: true });
}

const usernameCheck = (params) => {
  return baseHttpProvider.postFormApi('api/sys/oper/check', params);
}

export {
  deleteOper,
  searchOperList,
  saveOrUpdate,
  registered,
  disableStatus,
  usernameCheck
}