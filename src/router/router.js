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

const AccountManage = asyncComponent(() => import("../pages/enterpriseAccount/AccountManage"));
const AppSearch = asyncComponent(() => import("../pages/appManage/AppSearch"));
const UserSearch = asyncComponent(() => import("../pages/appManage/UserSearch"));
const QrcodeList = asyncComponent(() => import("../pages/appManage/QrcodeList"));

const TransactionSearch = asyncComponent(() => import("../pages/transaction/TransactionSearch"));
const RefundSearch = asyncComponent(() => import("../pages/transaction/RefundSearch"));
const RefundOrderDetail = asyncComponent(() => import("../pages/transaction/RefundOrderDetail"));
const OrderDetail = asyncComponent(() => import("../pages/transaction/OrderDetail"));
const RefundRequest = asyncComponent(() => import("../pages/transaction/RefundRequest"));


const RoleAuth = asyncComponent(() => import("../pages/oper/RoleAuth"));
const OperManage = asyncComponent(() => import("../pages/oper/OperManage"));

const ProductList = asyncComponent(() => import("../pages/productManage/ProductList"));
const FreightTemplate = asyncComponent(() => import("../pages/productManage/FreightTemplate"));


const SettlementSearch = asyncComponent(() => import("../pages/settlement/Search"));

const ThirdPartPayConfig = asyncComponent(() => import("../pages/thirdPartPay/Config"));


export default class GlobalRouter extends React.Component {
  render() {
    let firstEnterPagePath = getCacheFirstEnterPage();
    return (
      <Router>
        <Switch>
          <Route exact={true} path="/" render={() => (
            isUserLogin() ?
              <Redirect to={routerConfig["home"].path} />
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
                  <PrivateRoute path={routerConfig["home"].path} component={Home} />
                  <PrivateRoute path={routerConfig["enterpriseAccount.accountManage"].path} component={AccountManage} />
                  <PrivateRoute path={routerConfig["appManage.appSearch"].path} component={AppSearch} />
                  <PrivateRoute path={routerConfig["appManage.userSearch"].path} component={UserSearch} />
                  <PrivateRoute path={routerConfig["appManage.qrcodeList"].path} component={QrcodeList} />

                  <PrivateRoute path={routerConfig["transaction.transactionSearch"].path} component={TransactionSearch} />
                  <PrivateRoute path={routerConfig["transaction.refundSearch"].path} component={RefundSearch} />
                  <PrivateRoute path={routerConfig["transaction.refundOrderDetail"].path} component={RefundOrderDetail} />
                  <PrivateRoute path={routerConfig["transaction.orderDetail"].path} component={OrderDetail} />
                  <PrivateRoute path={routerConfig["transaction.refundRequest"].path} component={RefundRequest} />

                  <PrivateRoute path={routerConfig["oper.roleAuth.roleAuth"].path} component={RoleAuth} />
                  <PrivateRoute path={routerConfig["oper.operManage.operManage"].path} component={OperManage} />

                  <PrivateRoute path={routerConfig["productManage.productInfo.productList"].path} component={ProductList} />
                  <PrivateRoute path={routerConfig["productManage.other.freightTemplate"].path} component={FreightTemplate} />

                  <PrivateRoute path={routerConfig["settlement.search"].path} component={SettlementSearch} />

                  <PrivateRoute path={routerConfig["thirdPartPay.config"].path} component={ThirdPartPayConfig} />
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
