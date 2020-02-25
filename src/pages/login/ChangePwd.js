import React, { Component } from "react";
import { message, Form, Input, Button, Row, Col } from 'antd';
import { sendSms, changePassword } from '../../api/oper/login';
import { md5 } from '../../utils/signMD5.js';
import { baseRoute, routerConfig } from '../../config/router.config';

import './index.less';
import Toast from "../../utils/toast";

class Page extends Component {

  state = {
    showBtnLoading: false
  }

  componentDidMount() {
    document.title = '爱朵电商 | 门店后台系统' 
  }

  goback = () => {
    window.history.back();
  }  

  submitClicked = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { oldPassword, newPassword, repeatPassword } = data;
     
      if (newPassword != repeatPassword) {
        Toast("重复密码不一致！");
        return;
      }
      let params = {
        oldPassword: md5(oldPassword),
        newPassword: md5(newPassword)      
      }
      this.setState({
        showBtnLoading: true
      })

      changePassword(params)
        .then(() => {
          Toast("修改成功！");
          this.props.history.push(routerConfig['login'].path);
          return;
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
              门店后台系统
              <span style={{ fontSize: '18px', marginLeft: "10px" }}>修改密码</span></div>
          </div>
        </div>
        <div style={{ padding: '20px 4px' }}>
          <Form theme='dark' className='login-form' style={{ width: 450, margin: "0 auto" }}>
            <Form.Item
              field="oldPassword"
              // labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
            // label='请输入原始密码'
            >
              {
                getFieldDecorator('oldPassword', {
                  rules: [
                    { required: true, message: '请输入原始密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    className='border-bottom'
                    type="password" placeholder="请输入原始密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="newPassword"
              // labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
            // label='请输入新密码'
            >
              {
                getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    className='border-bottom'
                    type="password" placeholder="请输入新密码"
                  />
                )
              }
            </Form.Item>
            <Form.Item
              field="repeatPassword"
              // labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
            // label='重复新密码'
            >
              {
                getFieldDecorator('repeatPassword', {
                  rules: [
                    { required: true, message: '请输入密码!' },
                    { pattern: /^[A-Za-z0-9]{8,15}$/, message: '8-15位字符，包含数字和字母!' }
                  ],
                })(
                  <Input.Password
                    className='border-bottom'
                    type="password" placeholder="重复新密码"
                  />
                )
              }
            </Form.Item>
            <Row>
              <Col
                // offset={8} 
                span={24} style={{ paddingBottom: 30 }}>
                <div>
                  <Button loading={this.state.showBtnLoading} onClick={this.submitClicked} type='primary' style={{ width: "100%", lineHeight: "40px", height: 40, marginRight: "20px" }}>保存</Button>
                  {/* <Button style={{ width: 100, marginRight: "20px" }} onClick={this.goback}>返回</Button> */}
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


