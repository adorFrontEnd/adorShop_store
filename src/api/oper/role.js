import baseHttpProvider from '../base/baseHttpProvider';
import { md5 } from '../../utils/signMD5.js';

const searchRoleList = (params) => {
  return baseHttpProvider.postFormApi('api/sys/role/searchList', { page: 1, size: 10, ...params },
    {
      total: true
    })
}

const deleteRole = (params) => {
  return baseHttpProvider.getApi('api/sys/role/delete', params)
}

const saveOrUpdate = (params) => {

  if (params.password) {
    params.password = md5(params.password);
  }
  return baseHttpProvider.postFormApi('api/sys/role/saveOrUpdate', params)
}

const getAllList = (params) => {
  return baseHttpProvider.getApi('api/sys/source/getAll', params)
}

export {
  searchRoleList,
  deleteRole,
  getAllList,
  saveOrUpdate
}