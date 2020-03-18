import baseHttpProvider from '../base/baseHttpProvider';

const searchSellProductList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/sellProduct/searchList', { page: 1, size: 10, ...params }, { total: true });
}

const getSellProductDetail = (params) => {
  return baseHttpProvider.getApi('api/prd/sellProduct/getDetail', params);
}

export {
  searchSellProductList,
  getSellProductDetail
}

