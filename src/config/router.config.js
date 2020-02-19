const baseRoute = "";
const routerSort = ["home", "appManage", "transaction", "settlement", "oper", "enterpriseAccount", "thirdPartPay"];

const routerConfigArr = [
  {
    route_name: "login",
    path: baseRoute + "/login",
  },
  {
    route_name: "registerAccount",
    path: baseRoute + "/registerAccount"
  },
  {
    route_name: "changepwd",
    path: baseRoute + "/changepwd"
  },
  {
    route_name: "forgotPwd",
    path: baseRoute + "/forgotPwd"
  },
  {
    route_name: "accountSelect",
    path: baseRoute + "/accountSelect"
  },  
  {
    route_name: "oper",
    title: "员工管理",
    icon: "user",
    moduleAuth: true
  },
  {
    route_name: "oper.operManage",
    path: baseRoute + "/oper/operManage",
    loginRequired: true,
    moduleAuth: true,
    title: "账号管理",
    icon: "team"
  },
  {
    route_name: "oper.operManage.operManage",
    path: baseRoute + "/oper/operManage",
    loginRequired: true,
    moduleAuth: true,
    title: "账号管理",
    icon: "team"
  },
  {
    route_name: "oper.roleAuth",
    path: baseRoute + "/oper/roleAuth",
    loginRequired: true,
    moduleAuth: true,
    title: "角色管理",
    icon: "solution"
  },
  {
    route_name: "oper.roleAuth.roleAuth",
    path: baseRoute + "/oper/roleAuth",
    loginRequired: true,
    moduleAuth: true,
    title: "角色管理",
    icon: "solution"
  },
  {
    route_name: "productManage",
    title: "商品管理",
    icon: "profile",
    moduleAuth: true
  },
  {
    route_name: "productManage.productInfo",    
    loginRequired: true,
    moduleAuth: true,
    title: "商品信息",
    icon: "team"
  },
  {
    route_name: "productManage.productInfo.productList",
    path: baseRoute + "/productManage/productList",
    loginRequired: true,
    moduleAuth: true,
    title: "商品列表",
    icon: "team"
  },
  {
    route_name: "productManage.other",
    loginRequired: true,
    moduleAuth: true,
    title: "其他",
    icon: "solution"
  },
  {
    route_name: "productManage.other.freightTemplate",
    path: baseRoute + "/productManage/freight",
    loginRequired: true,
    moduleAuth: true,
    title: "运费模板",
    icon: "solution"
  },
  {
    route_name: "user",
    title: "会员管理",
    icon: "team",
    moduleAuth: true
  },
  {
    route_name: "user.userManage",    
    loginRequired: true,
    moduleAuth: true,
    title: "客户管理",   
  },
  {
    route_name: "user.userManage.userList",    
    path: baseRoute + "/user/userList",
    loginRequired: true,
    moduleAuth: true,
    icon: "solution",
    title: "客户列表",   
  },
  {
    route_name: "user.userManage.userGrade",    
    path: baseRoute + "/user/userGrade",
    loginRequired: true,
    moduleAuth: true,
    icon: "apartment",
    title: "客户级别",   
  },


]

const getRouterConfig = (routerConfigArr) => {
  let config = {};
  routerConfigArr.forEach((item, i) => {
    if (item && item.route_name) {
      let k = item.route_name;
      config[k] = { ...item, sort: i };
    }
  })
  return config;
}
const routerConfig = getRouterConfig(routerConfigArr);

export {
  baseRoute,
  routerConfig
}



