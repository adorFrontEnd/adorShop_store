
import React, { Component } from "react";
import { Row, Col, Avatar, Menu, Dropdown, Icon, message, Breadcrumb, Modal } from "antd";

import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../../config/router.config';
import { withRouter } from 'react-router-dom';
import { userLogout, getCacheUserInfo, getCacheShopName } from '../../../middleware/localStorage/login';

import '../../../assets/css/common.less'
import './index.less';

class Header extends Component {
  componentWillMount() {
    let userInfo = getCacheUserInfo();

    this.setState({
      userName: userInfo.nickname || userInfo.phoneNumber,
      roleName: userInfo.roleName,
      shopName: userInfo.shopName
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
      <Menu>
        {/* <Menu.Item key="1">资料</Menu.Item> */}
        {/* <Menu.Item onClick={this.goSetting.bind(this)} key="2">设置</Menu.Item> */}
        <Menu.Item onClick={this.goChangePwd} key="4">修改密码</Menu.Item>
        <Menu.Item onClick={this.logout.bind(this)} key="3">注销</Menu.Item>
      </Menu>
    )
    return (
      <div className="header">
        <Row className="header-top">
          <Col span={24} className="flex-between align-center" style={{ height: 60, borderBottom: "2px solid #f2f2f2" }}>
            <div>
              <div className='logo'>
                <div className='flex align-center'>
                  <div className='img-wrap'>
                    <img src='/favicon.ico' style={{ height: 50, width: 50 }} alt='' />
                  </div>
                  <div className='logo-title font-20 ellipsis'>爱朵电商<span className='margin0-10'>|</span><span className='font-16'>{this.state.shopName || '门店后台系统'}</span></div>
                </div>
              </div>
            </div>
            <div className="user-login">
              <Dropdown overlay={DropMenu} trigger={['hover', 'click']}>
                <div className="user-menu text-center flex">
                  <Avatar size="large" icon="user" className="avatar margin-right" />
                  <div className='line-height20'>
                    <div className="padding-right text-left ellipsis" style={{ maxWidth: 140 }}>{this.state.userName}</div>
                    <div className="padding-right font-12 ellipsis color-yellow" style={{ maxWidth: 140 }}>{this.state.roleName}</div>
                  </div>
                </div>
              </Dropdown>
            </div>
          </Col>
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

export default withRouter(connect(mapStateToProps)(Header))




