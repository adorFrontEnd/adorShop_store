
import React, { Component } from "react";
import { Row, Col, Avatar, Menu, Dropdown, Icon, message, Breadcrumb, Modal } from "antd";
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../../config/router.config';
import { withRouter } from 'react-router-dom';
import { userLogout, getCacheUserInfo } from '../../../middleware/localStorage/login';
import '../../../assets/css/common.less'
import './index.less';

class Page extends Component {
  componentWillMount() {
    let userInfo = getCacheUserInfo();

    this.setState({
      userName: userInfo.nickname || userInfo.phoneNumber,
      roleName: userInfo.roleName,

    })
  }
  logout = () => {
    Modal.confirm({
      title: '退出登录',
      content: "确认要退出登录吗？",
      onOk: () => {
        userLogout();
        this.props.history.replace(routerConfig['login'].path);
        message.success("你已退出登录！")
      }
    })
  }

  goSetting = () => {
    this.props.history.replace(routerConfig['setting.basicManage'].path);
  }

  goChangePwd = () => {
    this.props.history.push(routerConfig['changepwd'].path);
  }

  render() {
    const DropMenu = (
      <Menu theme="dark">
        {/* <Menu.Item key="1">资料</Menu.Item> */}
        {/* <Menu.Item onClick={this.goSetting.bind(this)} key="2">设置</Menu.Item> */}
        <Menu.Item onClick={this.goChangePwd} key="4">修改密码</Menu.Item>
        <Menu.Item onClick={this.logout.bind(this)} key="3">注销</Menu.Item>
      </Menu>
    )
    return (
      <div className="header">      

        <Row className="breadcrumb">
          <div className="bread-nav">
            <Breadcrumb >
              <Breadcrumb.Item>
                <a>
                  <Icon type="home" />
                </a>
              </Breadcrumb.Item>
              {
                this.props.routeInfo.parentTitle ?
                  <Breadcrumb.Item>
                    <span>{this.props.routeInfo.parentTitle}</span>
                  </Breadcrumb.Item>
                  : null
              }
              <Breadcrumb.Item>
                <a>
                  {this.props.routeInfo.title}
                </a>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state, own) => {
  return {
    routeInfo: state.storeRoute.routeInfo
  }
}

export default withRouter(connect(mapStateToProps)(Page))




