import baseHttpProvider from '../base/baseHttpProvider';

const getCityList = (params) => {

  return baseHttpProvider.getApi('api/sys/city/getAllCityList',null
 )
}


const saveSort = (params) => {
  return baseHttpProvider.postApi('api/sys/city/batchSaveOrUpdateBySort',
    {
      ...params
    },
    {
      total: true
    })
}

export {
  getCityList,
  saveSort
}