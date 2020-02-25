import React, { Component } from "react";
import { message, Form, Input, Button, Spin, Row, Col, Popconfirm, Avatar } from 'antd';
import { baseRoute, routerConfig } from '../../config/router.config';
import { sendSms, forgetPassword } from '../../api/oper/login';
import { userLogin } from '../../api/oper/login';
import dateUtil from '../../utils/dateUtil';
import Toast from "../../utils/toast";
import { getCacheAccountList, setCacheAccountList, setCacheUserInfo } from '../../middleware/localStorage/login';
import { getCacheFirstEnterPage } from '../../middleware/localStorage/cacheAuth';

import './index.less';
import './pwd.less';

class Page extends Component {

  state = {
    username: null,
    loginAccounts: null,
    showLoading: false
  }

  componentDidMount() {
    this.getPageData();
  }

  getPageData = () => {
    let accounts = getCacheAccountList();
    if (!accounts || !accounts.username || !accounts.loginAccounts) {
      this.setState({
        username: null,
        loginAccounts: null,
        accounts: null
      })
      return;
    }
    let { username, loginAccounts } = accounts;
    this.setState({
      username, loginAccounts, accounts
    })
  }

  logout = () => {
    setCacheAccountList(null);
    window.location.href = '/login';
  }

  login = (record) => {
    let { shopId } = record;
    let { password, username } = this.state.accounts;
    this.setState({
      showLoading: true
    })

    userLogin({ password, username, shopId })
      .then((res) => {
        if (res && res.token) {
          message.success("登录成功！");
          setCacheUserInfo(res);
          setCacheAccountList(null);
          setTimeout(() => {
            let firstEnterPagePath = getCacheFirstEnterPage();
            this.props.history.push(routerConfig[firstEnterPagePath].path);
            this.setState({
              showLoading: false
            })
          }, 1000)
          return;
        }
        this.setState({
          showLoading: false
        })
        message.error("登录失败！")
      })
      .catch(() => {
        this.setState({
          showLoading: false
        })
      })
  }

  render() {

    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "700px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", justifyContent: "space-between", position: 'relative' }}>
            <div style={{ display: "flex"}}>
              <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
              <div className='login-form-title'>爱朵电商</div>
              <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
                门店后台系统
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>门店选择</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{marginRight:"10px"}}>
                <Avatar size="large" icon="user" className="avatar margin-right" />
              </div>
              <div style={{ textAlign: "right", paddingRight: "10px" }}>
                <div>{this.state.username}</div>
                <div>
                  <Popconfirm
                    placement="topRight" title='确认要注销吗？'
                    onConfirm={() => { this.logout() }} >
                    <a style={{ marginLeft: "10px" }}>注销登录</a>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div style={{ padding: '20px 4px' }}>
          <div style={{lineHeight:"40px",paddingLeft:"40px",fontSize:"16px"}}>请选择即将操作的门店</div>
          <Spin spinning={this.state.showLoading}>
            {
              this.state.loginAccounts && this.state.loginAccounts.length ?
                this.state.loginAccounts.map(item =>
                  <div
                    onClick={() => { this.login(item) }}
                    key={item.shopId} style={{ padding: "20px", backgroundColor: "#F8F8F8", cursor: "pointer", marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={item.logo} style={{ height: "80px", width: "80px", marginRight: 20 }} />
                        <div>
                          <div style={{ fontSize: 18, fontWeight: "bold" }}>{item.shopName}</div>
                          <div style={{ lineHeight: "40px", fontWeight: "bold" }}>加入时间：{dateUtil.getDateTime(item.createTime)}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>{item.roleName}</div>
                        <div style={{ height: 40, lineHeight: "40px", fontWeight: "bold", color: "#1AAD19" }}>
                          {item.recentLogin ? "最近登录" : ""}</div>
                      </div>
                    </div>

                  </div>
                )
                : null
            }
          </Spin>
        </div>
      </div >
    )
  }
}
export default Page


