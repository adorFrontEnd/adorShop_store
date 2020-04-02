import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";
import { getHousekeeperConfig, updateHousekeeperConfig } from '../../api/sysConfig/sysConfig'
import Toast from '../../utils/toast';
const _title = "网店管家";

class Page extends Component {

  state = {
    swichStatus: false,
    pageData: null
  }

  componentDidMount() {
    this.getPageData()
  }
  getPageData = () => {
    getHousekeeperConfig()
      .then(pageData => {

        this.setState({
          pageData,
          swichStatus: pageData && pageData.status == 1
        })
        if (!pageData || !pageData.id) {
          this.props.form.setFieldsValue({ appId: "", appSecret: "", tokenStr: "" });
          return;
        }
        let { appId, appSecret, status, tokenStr } = pageData;
        this.props.form.setFieldsValue({ appId, appSecret, tokenStr });
      })
  }

  onSyncStatusChange = (swichStatus) => {
    this.setState({
      swichStatus
    })
  }

  saveClick = () => {
    let { swichStatus, pageData } = this.state;
    let title = swichStatus ? "开启" : "关闭";
    let status = swichStatus ? 1 : 0;
    let id = pageData && pageData.id ? pageData.id : null;
    if (!swichStatus) {
      let { appId, appSecret, tokenStr } = this.props.form.getFieldsValue();
      updateHousekeeperConfig({ id, status, appId, appSecret, tokenStr })
        .then((data) => {
          Toast(`${title}网店管家同步成功！`);
          this.getPageData()
        })
      return;
    }

    this.props.form.validateFields((err, params) => {
      if (err) {
        return;
      }
      let { appId, appSecret, tokenStr } = params;
      this.setState({
        swichStatus
      })
      updateHousekeeperConfig({ id, appId, appSecret, tokenStr, status })
        .then((data) => {
          Toast(`${title}网店管家同步成功！`);
          this.getPageData()
        })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage path='sysConfig.syncConfig.syncConfig' title={_title} >
        <>
          <>
            <div className='font-20 line-height40 font-bold'>网店管家</div>
            <Row style={{ width: 500 }} className='line-height40 margin-bottom'>
              <Col span={6} style={{ textAlign: "right" }}>
                网店管家同步：
              </Col>
              <Col span={16}>
                <Switch checked={this.state.swichStatus} onChange={this.onSyncStatusChange} />
              </Col>
            </Row>

            <Form style={{ width: 500, display: `${this.state.swichStatus ? 'block' : "none"}` }} className='common-form'>
              <Form.Item
                field="appId"
                label="appId"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                {
                  getFieldDecorator('appId', {
                    rules: [
                      { required: true, message: '请设置appId!' }
                    ],
                    initialValue: null
                  })(
                    <Input autoComplete="false" placeholder='请设置appId' />
                  )
                }
              </Form.Item>
              <Form.Item
                field="appSecret"
                label="appSecret"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                {
                  getFieldDecorator('appSecret', {
                    rules: [
                      { required: true, message: '请设置appSecret!' }
                    ],
                    initialValue: null
                  })(
                    <Input.Password autoComplete="false" visibilityToggle={false} placeholder='请设置AppSecret' />
                  )
                }
              </Form.Item>
              <Form.Item
                field="tokenStr"
                label="token"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
              >
                {
                  getFieldDecorator('tokenStr', {
                    rules: [
                      { required: true, message: '请设置token!' }
                    ],
                    initialValue: null
                  })(
                    <Input autoComplete="false" placeholder='请设置Token' />
                  )
                }
              </Form.Item>
            </Form>
            <Row className='line-height40' style={{ width: 500 }}>
              <Col offset={6}>
                <Button onClick={this.saveClick} type='primary' className='normal'>保存</Button>
              </Col>
            </Row>

          </>

        </>
      </CommonPage>
    )
  }

}

export default Form.create()(Page);