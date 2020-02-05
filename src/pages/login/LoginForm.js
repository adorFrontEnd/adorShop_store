import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { apiUrlPrefix } from '../../config/http.config';
import Toast from '../../utils/toast';
import './login.less'
const FormItem = Form.Item;

class NormalLoginForm extends Component {

  state = {

    imageUrl: "",
    username: "",
    password: "",
    imageCode: ""
  }

  // 登录
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, userInfo) => {
      if (err) {
        return;
      }
      let { username, password, imageCode } = userInfo;
      this.props.login({ username, password, imageCode });
    });
  }

  forgotPassword = (e) => {
    e.preventDefault();
    Toast('请联系管理员找回密码！')
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form theme='dark'
        onSubmit={this.handleSubmit} className="login-form"
        style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around" }}
      >
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: '请输入账号!' },
              { pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/, message: '请输入正确的账号!' }
            ],
          })(
            <Input
              className='border-bottom'
              onBlur={this.usernameOnBlur}
              placeholder="请输入门店账号"
            />
          )}
        </FormItem>
        <FormItem>
          {
            getFieldDecorator('password', {
              rules: [
                { required: true, message: '请输入密码!' },
                { min: 8, max: 15, message: '请输入8-15位的密码!' },
              ],
            })(
              <Input.Password
                className='border-bottom'
                type="password"
                placeholder="请输入密码"
              />
            )
          }
        </FormItem>

        <FormItem style={{ position: "relative" }}>
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
        </FormItem>
        <FormItem>
          <Button
            loading={this.props.loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
        </FormItem>
        <div>
          {
            this.props.children
          }
        </div>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm