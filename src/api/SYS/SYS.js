import baseHttpProvider from '../base/baseHttpProvider';
import uploadBaseHttpProvider from '../base/uploadBaseHttpProvider';

// 获取当前服务器时间
const getServerCurrentTime = () => {
  return baseHttpProvider.getApi('auth/getCurrentTimeMillis', null, {
    tokenless: true
  })
}

const getUpdatePictureUrl = (params) => {

  let result = uploadBaseHttpProvider.getReqObj('api/captcha/uploadImg', params)
  if (result.url) {
    return result.url
  }
}

const getImageCaptcha = (params) => {

  let result = baseHttpProvider.getReqObj('imageCaptcha', params, false, true);
  if (result.url) {
    return result.url
  }
}

const sendSms = (params) => {
  return baseHttpProvider.getApi('sendSms', params, {
    tokenless: true
  })
}

const getAllCityList = (params) => {
  return baseHttpProvider.getApi('api/sys/city/getAllCityList', params);
}

const getExpressFromkdniao = (params)=>{
  return baseHttpProvider.POST_TotalData('http://api.kdniao.com/Ebusiness/EbusinessOrderHandle.aspx', params);  
}

export {
  getServerCurrentTime,
  getUpdatePictureUrl,
  getImageCaptcha,
  sendSms,
  getAllCityList,
  getExpressFromkdniao
}
