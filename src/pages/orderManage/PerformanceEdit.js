import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Select,Radio } from "antd";
import { NavLink, Link } from 'react-router-dom';
import Toast from '../../utils/toast';
import { relative } from "path";
const _title = "编辑业绩";

class Page extends Component {

  state = {
    status: false,
    pageData: null
  }


  componentDidMount() {
  }


  // 返回
  goEditBack = () => {
    window.history.back();
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div style={{ width: 600, padding: 20 }}>
          <Form className='common-form'>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 10 }}
              label='业绩组名称'
              field='shopName'
            >

              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '输入业绩组名称' }
                  ]
                })(
                  <Input allowClear />
                )
              }
            </Form.Item>
            
            <Form.Item
               style={{ width: 700 }}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 16 }}
              label='计算方式'
              field='gradeId'>
              {
                getFieldDecorator('gradeId', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                  <Radio.Group>
                    <Radio value={1}>按业绩计算取值</Radio>
                    <Radio value={2}>按实际销售额</Radio>
                  </Radio.Group>
                )
              }
            </Form.Item>
            <Form.Item
               style={{ width: 700 }}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 16 }}
              label='参与等级限制'
              field='gradeId'>
              {
                getFieldDecorator('gradeId', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                 <div style={{display:'flex'}}>
                    <Radio.Group style={{lineHeight:'32px'}}>
                    <Radio value={1}>不限制</Radio>
                    <Radio value={2}>部分可参与</Radio>
                  </Radio.Group>
                  <Button type='primary'>可参与等级(3)</Button>
                 </div>
                )
              }
            </Form.Item>
            <Form.Item
               style={{ width: 700 }}
               labelCol={{ span: 6 }}
               wrapperCol={{ span: 16 }}
              label='参与等级限制'
              field='gradeId'>
              
            </Form.Item>
          </Form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row-reverse',marginTop:'30%' }}>

          <Button className='save-btn' type='primary' onClick={this.goEditBack} > 返回</Button>
          <Button className='save-btn' type='primary' onClick={this.saveDataClicked} style={{ marginRight: '10px' }}>保存</Button>

        </div>



      </CommonPage>
    )
  }

}

export default Form.create()(Page);