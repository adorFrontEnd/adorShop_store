import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Select } from "antd";
import { NavLink, Link } from 'react-router-dom';
import Toast from '../../utils/toast';
import { relative } from "path";
const _title = "词库配置";

class Page extends Component {

  state = {
    status: false,
    pageData: null
  }
  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      _title: isEdit ? "编辑客户" : "添加客户",
      showLoading: false
    })

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
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 10 }}
              label='关键词'
              field='shopName'
            >

              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '输入关键词' }
                  ]
                })(
                  <Input allowClear />
                )
              }
              <div style={{ color: 'red', marginLeft: '10px', position: 'absolute', top: '-10px', right: '-300px' }}>关键词不能重复，一个关键词只允许有一种类别</div>

            </Form.Item>
            <Form.Item
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 10 }}
              label='关键词类别：'
              field='gradeId'>
              {
                getFieldDecorator('gradeId', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                  <Select style={{ width: 233 }}>
                    <Select.Option value={null} style={{ width: 200 }}>请选择</Select.Option>
                    {
                      this.state.gradeList && this.state.gradeList.length ?
                        this.state.gradeList.map(item =>
                          <Select.Option key={item.id.toString()} value={item.id}>{item.name}</Select.Option>
                        )
                        : null
                    }
                  </Select>
                )
              }
            </Form.Item>

          </Form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>

          <Button className='save-btn' type='primary' onClick={this.goEditBack} > 返回</Button>
          <Button className='save-btn' type='primary' onClick={this.saveDataClicked} style={{ marginRight: '10px' }}>保存</Button>

        </div>



      </CommonPage>
    )
  }

}

export default Form.create()(Page);