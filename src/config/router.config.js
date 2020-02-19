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
    route_name: "home",
    path: baseRoute + "/home",
    loginRequired: true,
    title: "概览",
    icon: "line-chart",
    moduleAuth: true
  },
  {
    route_name: "enterpriseAccount",
    title: "企业账户",
    icon: "bank",
    moduleAuth: true
  },
  {
    route_name: "enterpriseAccount.accountManage",
    path: baseRoute + "/enterpriseAccount/accountManage",
    loginRequired: true,
    moduleAuth: true,
    title: "账户管理",
    icon: "apartment"
  },
  {
    route_name: "appManage",
    title: "应用",
    icon: "appstore",
    moduleAuth: true
  },
  {
    route_name: "appManage.appSearch",
    path: baseRoute + "/appManage/appSearch",
    loginRequired: true,
    moduleAuth: true,
    title: "应用管理",
    icon: "search"
  },
  {
    route_name: "appManage.qrcodeList",
    path: baseRoute + "/appManage/qrcodeList",
    loginRequired: true,
    title: "应用二维码",
    icon: "qrcodeList"
  },
  {
    route_name: "appManage.userSearch",
    path: baseRoute + "/appManage/userSearch",
    loginRequired: true,
    title: "会员查询",
    icon: "user"
  },
  {
    route_name: "transaction",
    title: "交易",
    icon: "transaction",
    moduleAuth: true
  },
  {
    route_name: "transaction.transactionSearch",
    path: baseRoute + "/transaction/transactionSearch",
    loginRequired: true,
    moduleAuth: true,
    title: "交易订单",
    icon: "security-scan"
  },
  {
    route_name: "transaction.refundSearch",
    path: baseRoute + "/transaction/refundSearch",
    loginRequired: true,
    moduleAuth: true,
    title: "退款查询",
    icon: "export"
  },
  {
    route_name: "settlement",
    title: "结算",
    icon: "account-book",
    moduleAuth: true
  },
  {
    route_name: "settlement.audit",
    path: baseRoute + "/settlement/audit",
    loginRequired: true,
    moduleAuth: true,
    title: "结算审核",
    icon: "file-done"
  },
  {
    route_name: "settlement.search",
    path: baseRoute + "/settlement/search",
    loginRequired: true,
    moduleAuth: true,
    title: "结算查询",
    icon: "file-search"
  },
  {
    route_name: "settlement.cashRequest",
    path: baseRoute + "/settlement/cashRequest",
    loginRequired: true,
    moduleAuth: true,
    title: "提现申请",
    icon: "audit"
  },
  {
    route_name: "transaction.refundOrderDetail",
    path: baseRoute + "/transaction/refundOrderDetail",
    loginRequired: true,
    moduleAuth: false,
    title: "退款详情"
  },
  {
    route_name: "transaction.orderDetail",
    path: baseRoute + "/transaction/orderDetail",
    loginRequired: true,
    moduleAuth: false,
    title: "订单详情"
  },
  {
    route_name: "transaction.refundRequest",
    path: baseRoute + "/transaction/refundRequest",
    loginRequired: true,
    moduleAuth: false,
    title: "申请退款"
  },
  {
    route_name: "thirdPartPay",
    title: "第三方支付",
    icon: "cluster",
    moduleAuth: true
  },
  {
    route_name: "thirdPartPay.config",
    path: baseRoute + "/thirdPartPay/config",
    loginRequired: true,
    moduleAuth: true,
    title: "支付配置",
    icon: "setting"
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



