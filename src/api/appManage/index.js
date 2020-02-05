
import baseHttpProvider from '../base/baseHttpProvider';


const searchApplicationList = (params) => {
  return baseHttpProvider.postFormApi('api/application/searchApplicationList', { page: 1, size: 10, ...params }, { total: true });
}

const getAllCompany = (params) => {
  return baseHttpProvider.getApi('api/company/getAll', params);
}

const updateStatus = (params) => {
  return baseHttpProvider.getApi('api/application/updateStatus', params);
}
const getAllApplication = (params) => {
  return baseHttpProvider.getApi('api/application/getAll', params);
}

const saveOrUpdateApplication = (params) => {
  return baseHttpProvider.postFormApi('api/application/saveOrUpdate', params);
}

const resetSecretKey = (params) => {
  return baseHttpProvider.getApi('api/application/resetSecretKey', params)
}

const searchUserList = (params) => {
  return baseHttpProvider.postFormApi('api/user/searchUserList', { page: 1, size: 10, ...params }, { total: true });
}

const updateUserStatus = (params) => {
  return baseHttpProvider.getApi('api/user/updateStatus', params);
}

const searchQrCodeList = (params) => {
  return baseHttpProvider.postFormApi('api/qrCode/searchQrCodeList', { page: 1, size: 10, ...params }, { total: true });
}

const updateQrcodeStatus = (params) => {
  return baseHttpProvider.getApi('api/qrCode/updateStatus', params);
}

const saveOrUpdateQrcode = (params) => {
  return baseHttpProvider.postFormApi('api/qrCode/saveOrUpdate', params);
}

const searchUserById = (params) => {
  return baseHttpProvider.getApi('api/user/searchUser', params);
}

const getQRCodeUrl = (params) => {
  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/getQRCode', params)
  if (result.url) {
    return result.url
  }
}

const userTransfer = (params) => {
  return baseHttpProvider.postFormApi('api/application/transfer', params);
}
 


export {
  searchApplicationList,
  getAllCompany,
  updateStatus,
  getAllApplication,
  saveOrUpdateApplication,
  resetSecretKey,
  searchUserList,
  searchQrCodeList,
  saveOrUpdateQrcode,
  searchUserById,
  getQRCodeUrl,
  updateQrcodeStatus,
  updateUserStatus,
  userTransfer
}