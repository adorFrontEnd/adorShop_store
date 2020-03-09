import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";

import Toast from '../../utils/toast';
const _title = "网店管家";

class Page extends Component {

  state = {
    status: false,
    pageData: null
  }

  componentDidMount() {
  }


  onSyncStatusChange = (status) => {

    let title = status ? "开启" : "关闭";
    Toast(`${title}同步网店管家成功！`);

    this.setState({
      status
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
              <Switch checked={this.state.status} onChange={this.onSyncStatusChange} />
            </div>
            {
              this.state.status ?
                <Form style={{ width: 500 }} className='common-form'>
                  <Form.Item
                    field="AppID"
                    label="AppID"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {
                      getFieldDecorator('AppID', {
                        rules: [
                          { required: true, message: '请设置AppID!' }
                        ],
                        initialValue: null
                      })(
                        <Input autoComplete="false" placeholder='请设置AppID' />
                      )
                    }
                  </Form.Item>
                  <Form.Item
                    field="AppSecret"
                    label="AppSecret"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {
                      getFieldDecorator('AppSecret', {
                        rules: [
                          { required: true, message: '请设置AppSecret!' }
                        ],
                        initialValue: null
                      })(
                        <Input.Password autoComplete="false" visibilityToggle={false} placeholder='请设置AppSecret' />
                      )
                    }
                  </Form.Item>
                  <Form.Item
                    field="Token"
                    label="Token"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                  >
                    {
                      getFieldDecorator('Token', {
                        rules: [
                          { required: true, message: '请设置Token!' }
                        ],
                        initialValue: null
                      })(
                        <Input autoComplete="false" placeholder='请设置Token' />
                      )
                    }
                  </Form.Item>

                  <Row className='line-height40'>
                    <Col offset={6}>
                      <Button onClick={this.saveConfirmClicked} type='primary' className='normal'>保存</Button>
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