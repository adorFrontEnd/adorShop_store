import baseHttpProvider from '../base/baseHttpProvider';

const getUpdatePictureUrl = (params) => {

  let result = baseHttpProvider.getReqObj('api/uploadImg', params)
  if (result.url) {
    return result.url
  }
}



export {
  getUpdatePictureUrl
}
