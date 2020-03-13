import baseHttpProvider from '../base/baseHttpProvider';


const saveOrUpdateProduct = (params) => {
  return baseHttpProvider.postFormApi('api/product/saveOrUpdate', params);
}

const searchProductList = (params) => {
  return baseHttpProvider.postFormApi('api/product/searchList', { page: 1, size: 10, ...params }, { total: true })
}

const deleteProduct = (params) => {
  return baseHttpProvider.getApi('api/product/delete', params);
}

const getProductDetail = (params) => {
  return baseHttpProvider.getApi('api/product/getDetail', params);
}


export {
  saveOrUpdateProduct,
  searchProductList,
  deleteProduct,
  getProductDetail
}

