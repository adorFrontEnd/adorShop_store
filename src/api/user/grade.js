import baseHttpProvider from '../base/baseHttpProvider';

/* api/user/findUserData 用户列表*******************************************************************
@params
page	Int	true	第几页
size	Int	true	每页数据条数
*/
const getGradeDetail = (params) => {
  return baseHttpProvider.getApi('api/grade/gradeDetail',params)
}



export {  
  getGradeDetail
}