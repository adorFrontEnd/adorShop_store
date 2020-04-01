import baseHttpProvider from '../base/baseHttpProvider';

const searchSellProductList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/sellProduct/searchList', { page: 1, size: 10, ...params }, { total: true });
}

const getSellProductDetail = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/getDetail', params);
}

const saveOrUpdateSellProduct = (params) => {
  return baseHttpProvider.postFormApi('api/prd/sellProduct/saveOrUpdate', params);
}

const updateOnsaleStatus = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/updateOnsaleStatus', params);
}

const deleteSellProduct = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/delete', params);
}

const deleteOrderProductUserPrice = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/deleteUserPrice', params);
}

const deleteUserGradePrice = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/deleteUserGradePrice', params);
}

const batchOnsaleStatus = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/batchOnsaleStatus', params);
}

const batchDelete = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/batchDelete', params);
}

const exportOrderProduct = (params) => {

  params = baseHttpProvider.filterAllNullKeyInParams(params)
  let result = baseHttpProvider.getReqObj('api/prd/sellProduct/export', params)
  if (result.url) {
    window.open(result.url, '_blank');
  }
}

const getSellProductByIds = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/selectByIds', params);
}


const getGoodsDetail = (params) => {
  return baseHttpProvider.getApi('api/prd/product/getGoodsDetail', params);
}

export {
  searchSellProductList,
  getSellProductDetail,
  saveOrUpdateSellProduct,
  updateOnsaleStatus,
  deleteSellProduct,
  deleteOrderProductUserPrice,
  deleteUserGradePrice,
  batchOnsaleStatus,
  batchDelete,
  getSellProductByIds,
  exportOrderProduct,
  getGoodsDetail
}

