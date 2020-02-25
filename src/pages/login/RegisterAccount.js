import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { baseRoute, routerConfig } from '../../config/router.config';
import { registered } from '../../api/oper/oper';
import './index.less';
import './pwd.less';
import Toast from "../../utils/toast";
import { NavLink, Link } from 'react-router-dom';
import { getImageCaptcha, sendSms } from '../../api/SYS/SYS';


class Page extends Component {

  state = {
    showBtnLoading: false,
    showVefifyClickLinkStatus: "0",
    countNum: 60,
    imageCaptchaUrl: null,
    username:null
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统'
  }

  componentWillUnmount() {
    this.resetCdTimer();
  }

  goback = () => {
    window.history.back();
  }

  /**点击注册 *****************************************************************/

  registerClicked = () => {

    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { nickname, username, password, repeatPassword, verifyCode, smsCode } = data;
      if (password != repeatPassword) {
        Toast('密码与重复密码不一致！');
        return;
      }
      let params = {
        nickname, username, password, verifyCode, smsCode
      }
      
      this.setState({
        showBtnLoading:true
      })
      registered(params)
      .then(()=>{
        this.setState({
          showBtnLoading:false
        })
        Toast('注册成功！');
        this.props.history.push(routerConfig['login'].path);
      })
      .catch(()=>{
        this.setState({
          showBtnLoading:false
        })
      })
    })
  }
  /**发送短信 *****************************************************************/
  verfyCodeClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { username } = params;
    if (!username || username.length != 11) {
      Toast("请输入11位的门店账号（手机号）！")
      return;
    }
    sendSms({ phone:username })
      .then(() => {
        Toast("发送短信成功！");
        this.startCdTimer();
      })
  }

  onPhoneChange = (e) => {
    let username = e.currentTarget.value;
    let status = username && username.length == 11;
    let showVefifyClickLinkStatus = status ? "1" : "0";

    this.setState({
      showVefifyClickLinkStatus,
      username
    })

    if (status) {
      this.getImageCaptcha(username);
    }
  }

  startCdTimer = () => {
    this.resetCdTimer();
    let cdTimer = setInterval(() => {
      let countNum = this.state.countNum;
      countNum--;
      this.setState({
        countNum
      })
      if (countNum <= 0) {
        this.resetCdTimer();
      }
    }, 1000)
    this.setState({
      cdTimer
    })
  }

  resetCdTimer = () => {
    let cdTimer = this.state.cdTimer;
    if (this.state.cdTimer) {
      clearInterval(this.state.cdTimer);
      this.setState({
        cdTimer: null
      })
    }
    this.setState({
      countNum: 60
    })
  }

  getImageCaptcha = (username) => {
    username = username || this.state.username;
    if (username && username.length == 11) {
      let imageCaptchaUrl = getImageCaptcha({ username, stamp: Date.now() });
      this.setState({
        imageCaptchaUrl
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ width: "80%", margin: "0 auto", maxWidth: "900px", minWidth: "700px" }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #BCBCBC' }}>
          <div style={{ display: "flex", position: 'relative' }}>
            <div><img src='/favicon.ico' style={{ height: 50, width: 50, marginRight: 10 }} /></div>
            <div className='login-form-title'>爱朵电商</div>
            <div style={{ position: 'absolute', bottom: '0px', left: '167px', fontSize: '16px' }}>
              门店后台系统
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>注册账号</span></div>
          </div>
        </div>
        <div style={{ padding: '20px 4px' }}>

          <Form theme='dark' className='login-form' style={{ width: 450, margin: "0 auto" }}>

            <Form.Item
              field="nickname"
            >
              {
                getFieldDecorator('nickname', {
                  rules: [
                    { required: true, message: '请填写名称!' }
                  ],
                })(
                  <Input
                    className='bottom-line-input prefix'
                    placeholder="请填写名称"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="username"
            >
              {
                getFieldDecorator('username', {
                  rules: [
                    { required: true, message: '请输入11位手机号码!' },
                    { min: 11, max: 11, message: '请输入11位手机号码!' },
                    { pattern: /^\d{11}$/, message: '请输入11位数字!' }
                  ],
                })(
                  <Input

                    type='number'
                    min={0}
                    className='bottom-line-input prefix'
                    placeholder="请填写手机号"
                    onChange={this.onPhoneChange}
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="password"
            >
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字或字母!' }
                  ],
                })(
                  <Input.Password
                    className='bottom-line-input'
                    type="password" placeholder="请填写密码，8-15位字符，包含数字或字母"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="repeatPassword"
            >
              {
                getFieldDecorator('repeatPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '请输入8-15位字符，包含数字或字母!' }
                  ],
                })(
                  <Input.Password
                    className='bottom-line-input'
                    type="password" placeholder="确认密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="verifyCode"
              style={{ position: "relative" }}
            >
              {getFieldDecorator('verifyCode', {
                rules: [
                  { required: true, message: '请输入验证码!' },
                  { pattern: /^\w{4}$/, message: '请输入验证码!' }
                ],
              })(
                <Input
                  className='border-bottom'
                  placeholder="请输入验证码"
                />
              )}
              <a onClick={() => this.getImageCaptcha()}>
                {
                  this.state.imageCaptchaUrl ?
                    <img src={this.state.imageCaptchaUrl} style={{ width: 100, height: 40, position: "absolute", right: 0, bottom: -6 }} />
                    : null
                }
              </a>
            </Form.Item>

            <Form.Item>
              <Button
                disabled={this.state.showVefifyClickLinkStatus != '1' || this.state.countNum != 60}
                onClick={this.verfyCodeClicked} size='large' type='primary' style={{ width: "100%", marginRight: "20px" }}>
                {
                  this.state.countNum == 60 ?
                    <span>获取短信验证码</span>
                    :
                    <span>短信已发送（{this.state.countNum}秒后可重发）</span>
                }

              </Button>
            </Form.Item>

            <Form.Item
              field="smsCode"
              style={{ position: "relative" }}
            >
              {
                getFieldDecorator('smsCode', {
                  rules: [
                    { required: true, message: '请输入6位验证码!' },
                    { pattern: /^\d{6}$/, message: '请输入6位数字验证码!' }
                  ],
                })(
                  <Input
                    min={0}
                    className='bottom-line-input'
                    placeholder="填写6位短信验证码"
                  />
                )
              }
            </Form.Item>

            <Row>
              <Col span={24} style={{ paddingBottom: 30 }}>
                <div>
                  <Button loading={this.state.showBtnLoading} onClick={this.registerClicked} size='large' type='primary' style={{ width: "100%", marginRight: "20px" }}>注册</Button>
                </div>
                <div style={{ paddingTop: 10 }}>
                  <NavLink to='/login' >已有账号，马上登录</NavLink>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div >
    )
  }
}
export default Form.create()(Page)


