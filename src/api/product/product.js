import baseHttpProvider from '../base/baseHttpProvider';


const saveOrUpdateProduct = (params) => {
  return baseHttpProvider.postFormApi('api/prd/product/saveOrUpdate', params);
}

const searchProductList = (params) => {
  return baseHttpProvider.postFormApi('api/prd/product/searchList', { page: 1, size: 10, ...params }, { total: true })
}

const deleteProduct = (params) => {
  return baseHttpProvider.getApi('api/prd/product/delete', params);
}

const getProductDetail = (params) => {
  return baseHttpProvider.getApi('api/prd/product/getDetail', params);
}

const deleteSpec = (params) => {
  return baseHttpProvider.postFormApi('api/prd/product/deleteSpec', params);
}

const batchDelete = (params) => {
  return baseHttpProvider.getApi('api/prd/product/batchDelete', params);
}


export {
  saveOrUpdateProduct,
  searchProductList,
  deleteProduct,
  getProductDetail,
  deleteSpec,
  batchDelete
}

