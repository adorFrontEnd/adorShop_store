import { baseRoute, routerConfig } from '../config/router.config';

//测试路由数据
const _routeData = [
  "oper.operManage",
  "oper.operManage.operManage",
  "oper.roleAuth",
  "oper.roleAuth.roleAuth",
  "productManage.productInfo",
  "productManage.productInfo.productList",
  "productManage.other",
  "productManage.other.freightTemplate",
  "user.userManage",
  "user.userManage.userList",
  "user.userManage.userGrade"
];
const getRouter = (data, shouldValidateAuth) => {
  if (!data) {
    return;
  }
  // data = _routeData;
  let routeIndexMap = {};
  let router = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (!item || !routerConfig[item] || (!routerConfig[item]["moduleAuth"] && shouldValidateAuth)) {
      continue;
    }
    let routeInfo = routerConfig[item];
    if (item.indexOf(".") == -1) {
      routeIndexMap[item] = router.length;
      router.push({ "key": item, children: [], ...routeInfo })
    } else {
      let arr = item.split(".");

      //二级菜单
      if (arr.length == 2) {
        let parent = arr[0];
        if (!routerConfig[parent]["moduleAuth"] && shouldValidateAuth) {
          continue;
        }
        let parentInfo = routerConfig[parent];
        if (!routeIndexMap.hasOwnProperty(parent)) {
          routeIndexMap[parent] = router.length;
          router.push({ "key": parent, children: [], ...parentInfo, level: 1 })
        }
        let index = routeIndexMap[parent];
        if (router[index]["children"] && !routeIndexMap.hasOwnProperty(item)) {
          routeIndexMap[item] = router[index]["children"].length;
          router[index]["children"].push({ "key": item, children: [], ...routeInfo, level: 2 });
        }
      }

      // 三级菜单
      if (arr.length == 3) {
        let parent = arr[0] + '.' + arr[1];
        let grandfather = arr[0];
        if ((!routerConfig[grandfather]["moduleAuth"] || !routerConfig[parent]["moduleAuth"]) && shouldValidateAuth) {
          continue;
        }
        let parentInfo = routerConfig[parent];
        let grandfatherInfo = routerConfig[grandfather];
        if (!routeIndexMap.hasOwnProperty(grandfather)) {
          routeIndexMap[grandfather] = router.length;
          router.push({ "key": grandfather, children: [], ...grandfatherInfo, level: 1 })
        }

        let gindex = routeIndexMap[grandfather];
        if (router[gindex]['children'] && !routeIndexMap.hasOwnProperty(parent)) {
          routeIndexMap[parent] = router[gindex]['children'].length;
          router[gindex]['children'].push({ "key": parent, children: [], ...parentInfo, level: 2 })
        }

        let pindex = routeIndexMap[parent];
        if (router[gindex]['children'] && router[gindex]['children'][pindex]['children'] && !routeIndexMap.hasOwnProperty(item)) {
          let gindex = routeIndexMap[grandfather];
          router[gindex]['children'][pindex]['children'].push({ "key": item, ...routeInfo })
        }
      }
    }
  }
  
  return sortRouter(router)
}


const sortRouter = (data) => {
  let arr = data.map(item => {
    if (item && item.children) {
      return {
        ...item,
        children: item.children.sort((a, b) => parseInt(a.sort) - parseInt(b.sort))
      }
    } else {
      return item
    }
  })
  return arr.sort((a, b) => parseInt(a.sort) - parseInt(b.sort))
}

export { getRouter };

