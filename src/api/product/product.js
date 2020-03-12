import baseHttpProvider from '../base/baseHttpProvider';


const saveOrUpdateProduct = (params) => {
  return baseHttpProvider.postFormApi('api/product/saveOrUpdate', params);
}

export {
  saveOrUpdateProduct
}

