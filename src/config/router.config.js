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
    route_name: "productManage",
    title: "商品管理",
    icon: "gift",
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
    icon: "profile"
  },
  {
    route_name: "productManage.productInfo.productEdit",
    path: baseRoute + "/productManage/productEdit",
    loginRequired: true,
    moduleAuth: true,
    title: "商品编辑",
    icon: "profile"
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
    icon: "block"
  },
  {
    route_name: "productManage.other.freightTemplateEdit",
    path: baseRoute + "/productManage/freightEdit",
    loginRequired: true,
    moduleAuth: true,
    title: "运费模板",
    icon: "block"
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
  {
    route_name: "user.userManage.userEdit",
    path: baseRoute + "/user/userEdit",
    loginRequired: true,
    moduleAuth: true,
    icon: "apartment",
    title: "创建/编辑客户",
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
    route_name: "storeManage",
    title: "仓库管理",
    icon: "setting",
    moduleAuth: true
  },
  {
    route_name: "storeManage.storeInfo",
    loginRequired: true,
    moduleAuth: true,
    title: "仓库信息",
    icon: "profile"
  },
  {
    route_name: "storeManage.storeInfo.storeManage",
    path: baseRoute + "/storeManage/storeManage",
    loginRequired: true,
    moduleAuth: true,
    title: "仓库管理",
    icon: "profile"
  },
  {
    route_name: "sysConfig",
    title: "系统配置",
    icon: "setting",
    moduleAuth: true
  },
  {
    route_name: "sysConfig.payConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "支付配置",
    icon: "team"
  },
  {
    route_name: "sysConfig.payConfig.payConfig",
    path: baseRoute + "/sysConfig/payConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "支付配置",
    icon: "profile"
  },
  {
    route_name: "sysConfig.syncConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "同步配置",
    icon: "team"
  },
  {
    route_name: "sysConfig.syncConfig.syncConfig",
    path: baseRoute + "/sysConfig/syncConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "网店管家",
    icon: "profile"
  },
  {
    route_name: "sysConfig.syncConfig.officialAccounts",
    path: baseRoute + "/sysConfig/officialAccounts",
    loginRequired: true,
    moduleAuth: true,
    title: "公众号",
    icon: "profile"
  },
  {
    route_name: "sysConfig.safeguardConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "维权配置",
    icon: "team"
  },
  {
    route_name: "sysConfig.safeguardConfig.returnAddress",
    path: baseRoute + "/sysConfig/returnAddress",
    loginRequired: true,
    moduleAuth: true,
    title: "退货地址",
    icon: "profile"
  },
  {
    route_name: "sysConfig.unitConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "计量单位",
    icon: "team"
  },
  {
    route_name: "sysConfig.unitConfig.unitConfig",
    path: baseRoute + "/sysConfig/unitConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "计量单位配置",
    icon: "profile"
  },
  {
    route_name: "sysConfig.checkConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "审核配置",
    icon: "team"
  },
  {
    route_name: "sysConfig.checkConfig.checkConfig",
    path: baseRoute + "/sysConfig/checkConfig",
    loginRequired: true,
    moduleAuth: true,
    title: "审单配置",
    icon: "profile"
  },

  {
    route_name: "orderManage",
    title: "订货管理",
    icon: "orderManage",
    moduleAuth: true
  },
  {
    route_name: "orderManage.orderProduct",
    loginRequired: true,
    moduleAuth: true,
    title: "订货商品",
    icon: "team"
  },
  {
    route_name: "orderManage.orderProduct.orderProduct",
    path: baseRoute + "/orderManage/orderProduct",
    loginRequired: true,
    moduleAuth: true,
    title: "订货商品",
    icon: "profile"
  },
  {
    route_name: "orderManage.orderProduct.commentManage",
    path: baseRoute + "/orderManage/commentManage",
    loginRequired: true,
    moduleAuth: true,
    title: "评论管理",
    icon: "profile"
  },
  {
    route_name: "orderManage.order",
    loginRequired: true,
    moduleAuth: true,
    title: "订货订单",
    icon: "team"
  },
  {
    route_name: "orderManage.order.orderList",
    path: baseRoute + "/orderManage/orderList",
    loginRequired: true,
    moduleAuth: true,
    title: "订单列表",
    icon: "team"
  },
  {
    route_name: "orderManage.order.afterSaleOrder",
    path: baseRoute + "/orderManage/afterSaleOrder",
    loginRequired: true,
    moduleAuth: true,
    title: "维权订单",
    icon: "team"
  } 
  
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



