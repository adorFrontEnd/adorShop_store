import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { baseRoute, routerConfig } from '../../config/router.config';
import { sendSms, forgetPassword } from '../../api/oper/login';
import './index.less';
import './pwd.less';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showBtnLoading: false,
    showVefifyClickLinkStatus: "0",
    countNum: 60
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统'
  }

  goback = () => {
    window.history.back();
  }

  componentWillUnmount() {

    this.resetCdTimer();
  }

  verfyCodeClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { phone } = params;
    if (!phone || phone.length != 11) {
      Toast("请输入11位的门店账号（手机号）！")
      return;
    }
    sendSms({ phone })
      .then(() => {
        Toast("发送短信成功！");
        this.startCdTimer();
      })
  }

  onPhoneChange = (e) => {
    let phone = e.currentTarget.value;
    let showVefifyClickLinkStatus = (phone && phone.length == 11) ? "1" : "0";
    this.setState({
      showVefifyClickLinkStatus
    })
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

  submitPassword = () => {

    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { phone, code, password } = data;
      forgetPassword({ phone, code, password })
        .then(() => {

          Toast('重置密码成功！');
          window.location.href = '/login';
        })
    })

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
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>忘记密码</span></div>
          </div>
        </div>
        <div style={{ padding: '20px 4px' }}>

          <Form theme='dark' className='login-form' style={{ width: 450, margin: "0 auto" }}>

            <Form.Item
              field="phone"
            >
              {
                getFieldDecorator('phone', {
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
                    placeholder="请填写门店账号"
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
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    className='bottom-line-input'
                    type="password" placeholder="填写重置密码，8-15位字符，包含数字和字母"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="imageCode"
              style={{ position: "relative" }}
            >
              {getFieldDecorator('imageCode', {
                rules: [
                  { required: true, message: '请输入验证码!' },
                  { pattern: /^\d{4}$/, message: '请输入验证码!' }
                ],
              })(
                <Input
                  className='border-bottom'
                  placeholder="请输入验证码"
                />
              )}
              <img style={{ width: 100, height: 30, position: "absolute", right: 0, bottom: -6 }} />
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
              field="code"
              style={{ position: "relative" }}
            >
              {
                getFieldDecorator('code', {
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
                  <Button onClick={this.submitPassword} size='large' type='primary' style={{ width: "100%", marginRight: "20px" }}>确认重置</Button>
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


