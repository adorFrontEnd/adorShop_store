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
    showVerifySlider: false,
    beginClientX: 0,
    /*距离屏幕左端距离*/
    mouseMoveStata: false,
    maxwidth: 360,
    confirmWords: '按住滑块向右拖动验证登录',
    /*滑块文字*/
    confirmSuccess: false,
    left: '0',
    width: '0',
    comfirmbg: 'image/slider.png',
    showVefifyClickLinkStatus: "0",
    countNum: 60
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统'
  }

  goback = () => {
    window.history.back();
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.mousemoveEvent);
    document.body.addEventListener('mouseup', this.mouseupEvent)
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.mousemoveEvent);
    document.body.removeEventListener('mouseup', this.mouseupEvent);
    this.resetCdTimer();
  }


  mouseupEvent = (e) => {
    //鼠标放开 
    this.setState({
      mouseMoveStata: false
    })
    var width = e.clientX - this.state.beginClientX;
    if (width < this.state.maxwidth) {
      this.setState({
        left: '0',
        width: '0'
      })
    }
  }

  mousemoveEvent = (e) => {
    if (this.state.mouseMoveStata) {
      var width = e.clientX - this.state.beginClientX;

      if (width > 0 && width <= this.state.maxwidth) {
        this.setState({
          left: width,
          width
        })
      } else if (width > this.state.maxwidth) {
        this.successFunction()
      }
    }
  }


  mousedownFn = (e) => {
    this.setState({
      mouseMoveStata: true,
      beginClientX: e.clientX
    })
  }

  successFunction = () => {
    this.setState({
      confirmWords: "验证通过",
      left: this.state.maxwidth,
      width: this.state.maxwidth,
      comfirmbg: "/image/confirm.png",
      confirmSuccess: true
    })
    setTimeout(() => {

      if (this.state.confirmSuccess) {
        this.setState({
          showVerifySlider: false,
          confirmWords: "按住滑块向右拖动验证登录",
          comfirmbg: 'image/slider.png',
          confirmSuccess: false
        })
        let params = this.props.form.getFieldsValue();
        let { phone } = params;
        sendSms({ phone })
          .then(() => {
            Toast("发送短信成功！");
            this.startCdTimer();
          })
      }
    }, 1000);
  }

  verfyCodeClicked = () => {
    this.setState({
      showVerifySlider: true
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
                    prefix={<span>中国+86</span>}
                    placeholder="今后使用手机号登录"
                    onChange={this.onPhoneChange}
                  />
                )
              }
            </Form.Item>

            <Form.Item
              field="code"
              style={{ position: "relative" }}
            >
              {
                this.state.showVerifySlider ?
                  <div className={!this.state.confirmSuccess ? 'drag no-margin' : 'comfirmdrag'} >
                    <div className="drag_bg" style={{ width: this.state.width }}></div>
                    <div className="drag_text">{this.state.confirmWords}</div>
                    <div className="handler" onMouseDown={this.mousedownFn} style={{ backgroundImage: `url(${this.state.comfirmbg})`, left: this.state.left, backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
                  </div>
                  :
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

              {
                this.state.showVerifySlider ?
                  null :
                  <span style={{ position: 'absolute', right: "10px", top: 0, lineHeight: "20px" }}>
                    {
                      this.state.showVefifyClickLinkStatus == '0' ?
                        <span className='color-gray'>获取短信验证码</span>
                        : null
                    }
                    {
                      this.state.showVefifyClickLinkStatus == '1' ?
                        (
                          this.state.countNum == 60 ?
                            < a onClick={this.verfyCodeClicked}> 获取短信验证码</a>
                            :
                            <span style={{ color: "#f00" }}>{this.state.countNum}秒后刷新</span>
                        )
                        : null
                    }
                  </span>
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
                    type="password" placeholder="8-15位字符，包含数字和字母"
                  />
                )
              }
            </Form.Item>
            <Row>
              <Col span={24} style={{ paddingBottom: 30 }}>
                <div>
                  <Button onClick={this.submitPassword} size='large' type='primary' style={{ width: "100%", marginRight: "20px" }}>确认修改</Button>
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


