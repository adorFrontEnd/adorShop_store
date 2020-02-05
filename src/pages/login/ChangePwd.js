import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { sendSms, changePassword } from '../../api/oper/login';
import { md5 } from '../../utils/signMD5.js';
import { baseRoute, routerConfig } from '../../config/router.config';
import { getCacheAccountList, setCacheAccountList, getCacheUserInfo } from '../../middleware/localStorage/login';

import './index.less';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showBtnLoading: false,
    phone: null,
    redirectLogin: false
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统'
    this.getPageData();
  }

  goback = () => {
    window.history.back();
  }

  getPageData = () => {
    let accounts = getCacheAccountList();
    if (accounts && accounts.username) {
      this.setState({
        phone: accounts.username,
        redirectLogin: false
      })
    } else {
      let cacheUserInfo = getCacheUserInfo();
      this.setState({
        phone: cacheUserInfo.phoneNumber,
        redirectLogin: true
      })
    }
  }

  submitClicked = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { oldPassword, newPassword, repeatPassword } = data;
      let phone = this.state.phone;
      if (newPassword != repeatPassword) {
        Toast("重复密码不一致！");
        return;
      }
      let params = {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword),
        phone
      }
      this.setState({
        showBtnLoading: true
      })

      changePassword(params)
        .then(() => {
          Toast("修改成功！");
          if (this.state.redirectLogin) {
            this.props.history.push(routerConfig['login'].path);
            return;
          }
          let accounts = getCacheAccountList();
          let { password, ...cacheData } = accounts;
          password = params.newPassword;
          setCacheAccountList({ password, ...cacheData });
          setTimeout(() => {
            this.setState({
              showBtnLoading: false
            })
            this.props.history.push(routerConfig['accountSelect'].path);
          }, 1000)

        })
        .catch(() => {
          this.setState({
            showBtnLoading: false
          })
        })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "760px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵电商</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              总平台
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>修改密码</span></div>
          </div>
        </div>
        <div style={{ padding: '20px 4px' }}>
          <Form theme='dark' className='login-form' style={{ width: 450, margin: "0 auto" }}>
            <Form.Item
              field="oldPassword"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='请输入原始密码'
            >
              {
                getFieldDecorator('oldPassword', {
                  rules: [
                    { required: true, message: '请输入原始密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    type="password" placeholder="请输入原始密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="newPassword"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='请输入新密码'
            >
              {
                getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password

                    type="password" placeholder="请输入新密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="repeatPassword"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='重复新密码'
            >
              {
                getFieldDecorator('repeatPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password

                    type="password" placeholder="重复新密码"
                  />
                )
              }
            </Form.Item>
            <Row>
              <Col offset={6} span={18} style={{ paddingBottom: 30 }}>
                <div>
                  <Button loading={this.state.showBtnLoading} onClick={this.submitClicked} type='primary' style={{ width: 100, marginRight: "20px" }}>确认修改</Button>
                  <Button style={{ width: 100, marginRight: "20px" }} onClick={this.goback}>返回</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}
export default Form.create()(Page)


