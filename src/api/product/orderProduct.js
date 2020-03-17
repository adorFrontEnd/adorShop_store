import baseHttpProvider from '../base/baseHttpProvider';


const searchSellProductList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/sellProduct/searchList', { page: 1, size: 10, ...params }, { total: true });
}



export {
  searchSellProductList
}

