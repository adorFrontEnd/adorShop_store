import baseHttpProvider from '../base/baseHttpProvider';

/* api/user/findUserData 用户列表*******************************************************************
@params
page	Int	true	第几页
size	Int	true	每页数据条数
*/
const searchUserList = (params) => {
  return baseHttpProvider.postFormApi('api/user/list',
    {
      size: 10,
      ...params
    },
    {
      total: true
    })
}

const getSurplusExportQuantity = (params) => {
  return baseHttpProvider.getApi('api/user/getSurplusExportQuantity', params)
}

const exportUserList = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/attention/export', params)
  if (result.url) {
    return result.url
  }
}

const searchUserAuthList = (params) => {
  return baseHttpProvider.postFormApi('api/userAuth/searchUserAuthList',
    {
      size: 10,
      ...params
    },
    {
      total: true
    })
}

const getUserAuthDetail = (params) => {
  return baseHttpProvider.getApi('api/userAuth/getDetail', params)
}

const resetSecretKey = (params) => {
  return baseHttpProvider.getApi('api/userAuth/resetSecretKey', params)
}

const deleteAuth = (params) => {
  return baseHttpProvider.getApi('api/userAuth/delete', params)
}

const saveOrUpdateAuth = (params) => {
  return baseHttpProvider.postFormApi('api/userAuth/saveOrUpdate', params)
}


const searchUser = (params) => {
  return baseHttpProvider.postFormApi('api/user/searchUser', params)
}

const createUser = (params) => {
  return baseHttpProvider.postFormApi('api/user/createAndUpdateUser', params)
}

const getUserDetail = (params) =>{
  return baseHttpProvider.getApi('api/user/getUserDetail', params);  
}

const updateUserStatus = (params) => {
  return baseHttpProvider.postFormApi('api/user/updateUserStatus', params)
}

const detectPhone = (params) => {
  return baseHttpProvider.postFormApi('api/user/detectPhone', params)
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