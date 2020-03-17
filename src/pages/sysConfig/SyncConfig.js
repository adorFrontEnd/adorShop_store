import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";
import { getHousekeeperConfig, updateHousekeeperConfig} from '../../api/sysConfig/sysConfig'
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
        if (pageData.status == 0) {
          this.setState({ swichStatus: false })
        } else {
          this.setState({ swichStatus: true })
        }
        this.setState({
          pageData
        })
        if (!pageData || !pageData.id) {
          this.props.form.setFieldsValue({ appId: "", appSecret: "", tokenStr: "" });
          this.setState({
            status: false
          })
          return;
        }
        let { appId, appSecret, status, tokenStr } = pageData;
        this.setState({
          status: status == '1'
        })
        this.props.form.setFieldsValue({ appId, appSecret, tokenStr });
      })
  }

  onSyncStatusChange = (swichStatus) => {
    // let title = status ? "开启" : "关闭";
    // Toast(`${title}同步网店管家成功！`);
if(swichStatus){
  this.getPageData()
}
    this.setState({
      swichStatus
    })
  }
  saveClick = (swichStatus) => {
    let title = swichStatus ? "开启" : "关闭";
    let status=swichStatus?1:0
    let pageData = this.state.pageData;
    this.props.form.validateFields((err, params) => {
      if (err) {
        return;
      }
      let { appId, appSecret, tokenStr } = params;
      this.setState({
        swichStatus
      })
      updateHousekeeperConfig({ id:pageData.id, ...params,status })
        .then((data) => {
          Toast(`${title}同步网店管家成功！`);
          this.getPageData()
        })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} >
        <>
          <>
            <div className='font-20 line-height40 font-bold'>网店管家</div>
            <div className='line-height40'>
              <span className='margin-right20'>网店管家同步</span>
              <Switch checked={this.state.swichStatus} onChange={this.onSyncStatusChange} />
            </div>
            {
              this.state.swichStatus ?
                <Form style={{ width: 500 }} className='common-form'>
                  <Form.Item
                    field="appId"
                    label="appappIdID"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {
                      getFieldDecorator('appId', {
                        rules: [
                          { required: true, message: '请设置appID!' }
                        ],
                        initialValue: null
                      })(
                        <Input autoComplete="false" placeholder='请设置AppID' />
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
                    label="tokenStr"
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

                  <Row className='line-height40'>
                    <Col offset={6}>
                      <Button onClick={this.saveClick} type='primary' className='normal'>保存</Button>
                    </Col>

                  </Row>
                </Form> : null
            }

          </>

        </>
      </CommonPage>
    )
  }

}

export default Form.create()(Page);