import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import Toast from "../../utils/toast";
import PictureWall from '../../components/upload/PictureWall';
import UploadFile from '../../components/upload/UploadFile';

class Page extends Component {

  state = {
    logoPicUrl: "",
    refundCertificateUrl: "",
    p12File: ''
  }

  componentDidMount() {
    let config = this.props.config;
    this.revertData(config);
  }

  componentWillReceiveProps(props) {

    if (JSON.stringify(props.config) != JSON.stringify(this.props.config)) {
      let config = props.config;
      this.revertData(config)
    }
  }

  // 上传图片
  uploadLogoPic = (picList) => {
    let logoPicUrl = picList && picList.length ? picList[0] : "";
    this.setState({
      logoPicUrl
    })
  }

  // 保存
  saveConfigClicked = () => {

    this.props.form.validateFields((err, data) => {

      if (err) {
        return;
      }

      let { logoPicUrl, p12File } = this.state;

      if (!logoPicUrl) {
        this.setState({
          showImgValidateInfo: true
        })
        return;
      }

      let refundCertificateUrl = null;
      let p12Name = null;

      if (p12File) {
        refundCertificateUrl = p12File.url;
        p12Name = p12File.name;
      }

      let params = {
        ...data,
        icon: logoPicUrl,
        refundCertificateUrl,
        p12Name
      }
      this.props.saveClick(params);
    })
  }

  revertData = (config) => {

    if (config) {
      let { icon, refundCertificateUrl, p12Name } = config;
      let p12File = null;
      if (refundCertificateUrl) {
        p12File = {
          name: p12Name,
          url: refundCertificateUrl
        }
      }
      this.setState({
        logoPicUrl: icon,
        p12File
      })
    }
    this.props.form.setFieldsValue(config);
  }

  // 恢复
  resetConfigClicked = () => {

    this.props.resetData();
  }

  uploadP12 = (files) => {
    let p12File = files && files.length ? files[0] : "";
    this.setState({
      p12File
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (

      <div style={{ minWidth: 700 }}>
        <Form className='common-form'>
          <Row>
            <Col span={12}>
              <Form.Item
                field="unionAccount"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='收款方客户号'
              >
                {
                  getFieldDecorator('unionAccount', {
                    rules: [
                      { required: true, message: '请输入!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写收款方客户号" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>

              <Form.Item
                field="unionPayeeName"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='收款方客户名称'
              >
                {
                  getFieldDecorator('unionPayeeName', {
                    rules: [
                      { required: true, message: '请输入收款方客户名称!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写收款方客户名称" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>

              <Form.Item
                field="unionPrivateKey"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='银联在线密钥'
                extra="请注意不要让他人知晓您的密钥"
              >
                {
                  getFieldDecorator('unionPrivateKey', {
                    rules: [
                      { required: true, message: '请填写银联在线密钥!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写银联在线密钥" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>
              <Row className='line-height40 margin10-0'>
                <Col span={7} className='text-right'>
                  <span className='label-color'>支付币种：</span>
                </Col>
                <Col span={17}>
                  人民币
                </Col>
              </Row>

            </Col>
            <Col span={12}>
              <Form.Item
                field="title"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='显示名称(Title)：'
              >
                {
                  getFieldDecorator('title', {
                    rules: [
                      { required: true, message: '请填写显示名称!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写显示名称" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>

              <Form.Item
                field="sort"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='显示顺序(PaiXu)：'
              >
                {
                  getFieldDecorator('sort', {
                    rules: [
                      { required: true, message: '请填写排序!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写排序" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>

              <Row className='line-height40 margin10-0'>
                <Col span={7} className='text-right'>
                  <span className='label-color label-required'>默认图标(Icon)：</span>
                </Col>
                <Col span={17}>
                  <PictureWall
                    allowType={['1', '2']}
                    folder='adorpay'
                    pictureList={this.state.logoPicUrl ? [this.state.logoPicUrl] : null}
                    uploadCallback={this.uploadLogoPic}
                  />
                  <div style={{ lineHeight: "16px" }}>建议上传尺寸42px * 42px；图片格式jpg、png；图片大小：3M以内</div>
                  {
                    this.state.showImgValidateInfo ?
                      <div className='line-height18 color-red' style={{ textAlign: "left" }}>请设置企业logo</div> :
                      null
                  }
                </Col>
              </Row>

              <Form.Item
                field="depict"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 17 }}
                label='描述(Description)：'
              >
                {
                  getFieldDecorator('depict', {
                    rules: [
                      { required: true, message: '请填写20字以内的描述!' },
                      { max: 20, message: '请填写20字以内的描述!' }
                    ]
                  })(
                    <Input allowClear placeholder="请填写20字以内的描述" style={{ width: "90%" }} />
                  )
                }
              </Form.Item>              
            </Col>
          </Row>
        </Form>
        <div style={{ width: "50%" }}>
          <Row>
            <Col span={17} offset={7}>
              <Button className='normal' type='primary' onClick={this.saveConfigClicked}>修改</Button>
              <Button className='normal margin-left yellow-btn' onClick={this.resetConfigClicked}>恢复</Button>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Form.create()(Page);