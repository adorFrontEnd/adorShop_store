import baseHttpProvider from '../base/baseHttpProvider';

// const searchList = (params) => {

//     return baseHttpProvider.postFormApi('api/category/searchList', null
//     )
// }
const searchList = (params) => {
    return baseHttpProvider.postFormApi('api/category/getList', params, { total: true });
}
const searchAllList = (params) => {
    return baseHttpProvider.getApi('api/category/getAllList', params, { total: true });
}

const saveOrUpdate = (params) => {
    return baseHttpProvider.postFormApi('api/category/saveOrUpdate', params)
}
const levelList = (params) => {
    return baseHttpProvider.getApi('api/category/levelList', params)
}
const saveSort = (params) => {
    return baseHttpProvider.postApi('api/category/saveSort', params)
}

const deleteClassify = (params) => {
    return baseHttpProvider.getApi('api/category/delete', params)
}
export {
    searchList,
    searchAllList,
    saveOrUpdate,
    levelList,
    saveSort,
    deleteClassify
}