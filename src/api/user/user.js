import baseHttpProvider from '../base/baseHttpProvider';

/* api/usr/user/findUserData 用户列表*******************************************************************
@params
page	Int	true	第几页
size	Int	true	每页数据条数
*/
const searchUserList = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/list',
    {
      size: 10,
      ...params
    },
    {
      total: true
    })
}

const getSurplusExportQuantity = (params) => {
  return baseHttpProvider.getApi('api/usr/user/getSurplusExportQuantity', params)
}

const exportUserList = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/usr/attention/export', params)
  if (result.url) {
    return result.url
  }
}

const searchUserAuthList = (params) => {
  return baseHttpProvider.postFormApi('api/usr/userAuth/searchUserAuthList',
    {
      size: 10,
      ...params
    },
    {
      total: true
    })
}

const getUserAuthDetail = (params) => {
  return baseHttpProvider.getApi('api/usr/userAuth/getDetail', params)
}

const resetSecretKey = (params) => {
  return baseHttpProvider.getApi('api/usr/userAuth/resetSecretKey', params)
}

const deleteAuth = (params) => {
  return baseHttpProvider.getApi('api/usr/userAuth/delete', params)
}

const saveOrUpdateAuth = (params) => {
  return baseHttpProvider.postFormApi('api/usr/userAuth/saveOrUpdate', params)
}


const searchUser = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/searchUser', params)
}

const createUser = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/createAndUpdateUser', params)
}

const getUserDetail = (params) =>{
  return baseHttpProvider.getApi('api/usr/user/getUserDetail', params);  
}

const updateUserStatus = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/updateUserStatus', params)
}

const detectPhone = (params) => {
  return baseHttpProvider.postFormApi('api/usr/user/detectPhone', params)
}


export {
  getSurplusExportQuantity,
  searchUserList,
  exportUserList,
  searchUserAuthList,
  getUserAuthDetail,
  resetSecretKey,
  saveOrUpdateAuth,
  deleteAuth,
  searchUser,
  createUser,
  getUserDetail,
  updateUserStatus,
  detectPhone
}