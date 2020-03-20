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


export {
  searchSellProductList,
  getSellProductDetail,
  saveOrUpdateSellProduct,
  updateOnsaleStatus,
  deleteSellProduct
}

