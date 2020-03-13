import React from 'react';
import asyncComponent from "../components/asyncComponent/asyncComponent";
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { baseRoute, routerConfig } from '../config/router.config';
import { isUserLogin } from '../middleware/localStorage/login';
import { getCacheFirstEnterPage } from '../middleware/localStorage/cacheAuth';

import Login from "../pages/login";
import Changepwd from "../pages/login/ChangePwd";
import ForgotPwd from "../pages/login/ForgotPwd";
import RegisterAccount from '../pages/login/RegisterAccount';
import AccountSelect from "../pages/login/AccountSelect";

const Admin = asyncComponent(() => import("../pages/admin"));
const Home = asyncComponent(() => import("../pages/home/Home"));

const RoleAuth = asyncComponent(() => import("../pages/oper/RoleAuth"));
const OperManage = asyncComponent(() => import("../pages/oper/OperManage"));

const ProductList = asyncComponent(() => import("../pages/productManage/ProductList"));
const FreightTemplate = asyncComponent(() => import("../pages/productManage/FreightTemplateManage"));
const FreightTemplateEdit = asyncComponent(() => import("../pages/productManage/FreightTemplateEdit"));
const ProductEdit = asyncComponent(() => import("../pages/productManage/ProductEdit"));

const UserList = asyncComponent(() => import("../pages/user/UserList"));
const UserGrade = asyncComponent(() => import("../pages/user/UserGrade"));
const UserEdit = asyncComponent(() => import("../pages/user/UserEdit"));

const CheckConfig = asyncComponent(() => import("../pages/sysConfig/CheckConfig"));
const OfficialAccounts = asyncComponent(() => import("../pages/sysConfig/OfficialAccounts"));
const PayConfig = asyncComponent(() => import("../pages/sysConfig/PayConfig"));
const ReturnAddress = asyncComponent(() => import("../pages/sysConfig/ReturnAddress"));
const SyncConfig = asyncComponent(() => import("../pages/sysConfig/SyncConfig"));
const UnitConfig = asyncComponent(() => import("../pages/sysConfig/UnitConfig"));
const SmartLexicon = asyncComponent(() => import("../pages/sysConfig/SmartLexicon"));
const LexiconConfig = asyncComponent(() => import("../pages/sysConfig/LexiconConfig"));

const StoreManage = asyncComponent(() => import("../pages/StoreManage/StoreManage"));

const PerformanceCheck = asyncComponent(() => import("../pages/fundsManage/PerformanceCheck"));


const OrderProduct = asyncComponent(() => import("../pages/orderManage/OrderProduct"));
const CommentManage = asyncComponent(() => import("../pages/orderManage/CommentManage"));
const OrderList = asyncComponent(() => import("../pages/orderManage/OrderList"));
const AfterSaleOrder = asyncComponent(() => import("../pages/orderManage/AfterSaleOrder"));
const IntelliOrder = asyncComponent(() => import("../pages/orderManage/IntelliOrder"));
const Salesman = asyncComponent(() => import("../pages/orderManage/Salesman"));
const StockLog = asyncComponent(() => import("../pages/orderManage/StockLog"));
const StockManage = asyncComponent(() => import("../pages/orderManage/StockManage"));
const PerformanceConfig = asyncComponent(() => import("../pages/orderManage/PerformanceConfig"));
const PerformanceStatc = asyncComponent(() => import("../pages/orderManage/PerformanceStatc"));
const PerformanceEdit = asyncComponent(() => import("../pages/orderManage/PerformanceEdit"));



export default class GlobalRouter extends React.Component {

  render() {

    let firstEnterPagePath = getCacheFirstEnterPage();
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" render={() => (
            isUserLogin() ?
              <Redirect to={routerConfig[firstEnterPagePath].path} />
              :
              <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />

          <Route exact={true} path={routerConfig["login"].path} component={Login} />
          <Route exact={true} path={routerConfig["changepwd"].path} component={Changepwd} />
          <Route exact={true} path={routerConfig["forgotPwd"].path} component={ForgotPwd} />
          <Route exact={true} path={routerConfig["accountSelect"].path} component={AccountSelect} />
          <Route exact={true} path={routerConfig["registerAccount"].path} component={RegisterAccount} />

          <Route path={baseRoute} render={() => (
            isUserLogin() ?
              <Admin>
                <Switch>

                  <PrivateRoute path={routerConfig["oper.roleAuth.roleAuth"].path} component={RoleAuth} />
                  <PrivateRoute path={routerConfig["oper.operManage.operManage"].path} component={OperManage} />

                  <PrivateRoute path={routerConfig["productManage.productInfo.productList"].path} component={ProductList} />
                  <PrivateRoute path={routerConfig["productManage.other.freightTemplate"].path} component={FreightTemplate} />
                  <PrivateRoute path={routerConfig["productManage.other.freightTemplateEdit"].path + '/:id'} component={FreightTemplateEdit} />
                  <PrivateRoute path={routerConfig["productManage.productInfo.productEdit"].path + '/:id'} component={ProductEdit} />

                  <PrivateRoute path={routerConfig["user.userManage.userList"].path} component={UserList} />
                  <PrivateRoute path={routerConfig["user.userManage.userGrade"].path} component={UserGrade} />
                  <PrivateRoute path={routerConfig["user.userManage.userEdit"].path + '/:id'} component={UserEdit} />

                  <PrivateRoute path={routerConfig["sysConfig.payConfig.payConfig"].path} component={PayConfig} />
                  <PrivateRoute path={routerConfig["sysConfig.syncConfig.syncConfig"].path} component={SyncConfig} />
                  <PrivateRoute path={routerConfig["sysConfig.syncConfig.officialAccounts"].path} component={OfficialAccounts} />
                  <PrivateRoute path={routerConfig["sysConfig.safeguardConfig.returnAddress"].path} component={ReturnAddress} />
                  <PrivateRoute path={routerConfig["sysConfig.unitConfig.unitConfig"].path} component={UnitConfig} />
                  <PrivateRoute path={routerConfig["sysConfig.checkConfig.checkConfig"].path} component={CheckConfig} />
                  <PrivateRoute path={routerConfig["sysConfig.orderConfig.smartLexicon"].path} component={SmartLexicon} />
                  <PrivateRoute path={routerConfig["sysConfig.orderConfig.lexiconConfig"].path + '/:id'} component={LexiconConfig} />

                  <PrivateRoute path={routerConfig["storeManage.storeInfo.storeManage"].path} component={StoreManage} />

                  <PrivateRoute path={routerConfig["fundsManage.fundsCheck.performanceCheck"].path} component={PerformanceCheck} />

                  <PrivateRoute path={routerConfig["orderManage.orderProduct.orderProduct"].path} component={OrderProduct} />
                  <PrivateRoute path={routerConfig["orderManage.orderProduct.commentManage"].path} component={CommentManage} />
                  <PrivateRoute path={routerConfig["orderManage.order.orderList"].path} component={OrderList} />
                  <PrivateRoute path={routerConfig["orderManage.order.afterSaleOrder"].path} component={AfterSaleOrder} />
                  <PrivateRoute path={routerConfig["orderManage.order.intelliOrder"].path} component={IntelliOrder} />
                  <PrivateRoute path={routerConfig["orderManage.salesman.salesman"].path} component={Salesman} />
                  <PrivateRoute path={routerConfig["orderManage.stockManage.stockLog"].path} component={StockLog} />
                  <PrivateRoute path={routerConfig["orderManage.stockManage.stockManage"].path} component={StockManage} />
                  
                </Switch>
              </Admin>
              : <Redirect to={{ pathname: routerConfig["login"].path }} />
          )} />
        </Switch>
      </Router >
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={
        props =>
          isUserLogin() ?
            <Component {...props} />
            : <Redirect to={{ pathname: routerConfig["login"].path, state: { from: props.location } }} />
      }
    />
  )
}
