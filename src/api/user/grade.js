import baseHttpProvider from '../base/baseHttpProvider';

/* api/usr/user/findUserData 用户列表*******************************************************************
@params
page	Int	true	第几页
size	Int	true	每页数据条数
*/
const getGradeDetail = (params) => {
  return baseHttpProvider.getApi('api/usr/grade/gradeDetail', params)
}

const createAndUpdateGrade = (params) => {
  return baseHttpProvider.postFormApi('api/usr/grade/createAndUpdateGrade', params)
}

const deleteGrade = (params) => {
  return baseHttpProvider.getApi('api/usr/grade/deleteGrade', params)
}

const getGradeList = (params) => {
  return baseHttpProvider.getApi('api/usr/grade/gradeList', params)
}



export {
  getGradeDetail,
  createAndUpdateGrade,
  deleteGrade,
  getGradeList
}