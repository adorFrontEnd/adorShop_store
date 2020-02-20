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

const UserList = asyncComponent(() => import("../pages/user/UserList"));
const UserGrade = asyncComponent(() => import("../pages/user/UserGrade"));
const UserEdit = asyncComponent(() => import("../pages/user/UserEdit"));


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

                  <PrivateRoute path={routerConfig["user.userManage.userList"].path} component={UserList} />
                  <PrivateRoute path={routerConfig["user.userManage.userGrade"].path} component={UserGrade} />
                  <PrivateRoute path={routerConfig["user.userManage.userEdit"].path} component={UserEdit} />
                  
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
