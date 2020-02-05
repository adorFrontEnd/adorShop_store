import baseHttpProvider from '../base/baseHttpProvider'

// 获取当前服务器时间
const getServerCurrentTime = () => {
  return baseHttpProvider.getApi('auth/getCurrentTimeMillis', null, {
    tokenless: true
  })
}

const getUpdatePictureUrl = (params) => {

  let result = baseHttpProvider.getReqObj('api/uploadImg', params)
  if (result.url) {
    return result.url
  }
}



export {
  getServerCurrentTime,
  getUpdatePictureUrl
}
