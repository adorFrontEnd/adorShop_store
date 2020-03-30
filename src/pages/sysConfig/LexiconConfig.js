import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Select, InputNumber } from "antd";
import { NavLink, Link } from 'react-router-dom';
import { insertDictionary, itemDictionary } from '../../api/sysConfig/sysConfig';

import Toast from '../../utils/toast';
import './index.less'
const _title = "词库配置";
const _lexiconCategory = {
  "nr": "姓名",
  "prd": "商品",
  "spec": "规格",
  "amq": "数量"
}
const _lexiconCategoryArr = Object.keys(_lexiconCategory).map(item => { return { id: item, name: _lexiconCategory[item] } });

class Page extends Component {
  state = {
    status: false,
    pageData: null,
    pageDetail: {},
    natureStr: null
  }
  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id && id != 0;
    this.setState({
      id,
      _title: isEdit ? "编辑客户" : "添加客户",
      showLoading: false
    })

    if (isEdit) {
      this.getDetail(id);
    }
  }

  getDetail = (id) => {
    id = id || this.state.id;
    itemDictionary({ id })
      .then(pageDetail => {

        let { natureStr, rangeStr, realName, unit } = pageDetail;
        this.props.form.setFieldsValue({ natureStr, rangeStr, realName });
        this.setState({
          pageDetail,
          natureStr
        })
      })
  }

  // 表格相关列
  columns = [
    { title: "商品名称", dataIndex: "name", render: data => data || "--" },
    { title: "商品图", dataIndex: "image", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    { title: "包装规格", dataIndex: "spec", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a size="small" className="color-red" onClick={() => this.deleteUnit(record)}> 移除</a>
        </span>
      )
    }
  ]
  modalColumns = [
    { title: "商品名称", dataIndex: "name", render: data => data || "--" },
    { title: "商品图", dataIndex: "image", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    { title: "商品分类", dataIndex: "catogery", render: data => data || "--" },
    { title: "包装规格", dataIndex: "spec", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <Button onClick={() => this.chooseProduct(record)} type='primary'>选择</Button>
      )
    }
  ]

  // 下拉框
  handleChange = (natureStr) => {

    this.setState({
      natureStr
    })
  }

  // 打开modal
  showAuthModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
  }

  // 隐藏modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }

  saveDataClicked = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }

      let { realName, natureStr } = data;
      insertDictionary({ realName, natureStr })
        .then(() => {
          Toast('保存词库成功！');
        })
      window.history.back();
    })
  }

  // 返回
  goEditBack = () => {
    window.history.back();
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div style={{ width: 600 }}>
          <Form className='common-form'>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              label='关键词'
              field='realName'
            >
              {
                getFieldDecorator('realName', {
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
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              label='关键词类别：'
              field='natureStr'>
              {
                getFieldDecorator('natureStr', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择类别' }
                  ]
                })(
                  <Select onChange={this.handleChange}>
                    <Select.Option value={null} >请选择类别</Select.Option>
                    {
                      _lexiconCategoryArr ?
                        _lexiconCategoryArr.map(item =>
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        )
                        : null
                    }
                  </Select>
                )
              }
            </Form.Item>
            {
              this.state.natureStr == 'amq' ?
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 10 }}
                  label='数量范围'
                  field='num'>
                  {
                    getFieldDecorator('num', {
                      initialValue: null,
                      rules: [
                        { required: true, message: '请输入数量范围' }
                      ]
                    })(
                      <div>
                        <InputNumber min={1} onChange={this.onChange} />
                        ~<InputNumber min={1} onChange={this.onChange} />
                      </div>
                    )
                  }
                </Form.Item> : null
            }
          </Form>
        </div>
        {
          this.state.natureStr == 'prd' ?
            <div>
              <Button type='primary' style={{ margin: '20px 0' }} onClick={this.showAuthModal}>添加商品</Button>
              <Table
                indentSize={10}
                rowKey="id"
                columns={this.columns}
                loading={this.state.showTableLoading}
                pagination={this.state.pagination}
                dataSource={this.state.tableDataList}
              />
            </div> : null
        }
        <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '30%' }}>
          <Button className='save-btn' type='primary' onClick={this.goEditBack} > 返回</Button>
          <Button className='save-btn' type='primary' onClick={this.saveDataClicked} style={{ marginRight: '10px' }}>保存</Button>
        </div>

        <Modal maskClosable={false}
          title="商品选择"
          visible={this.state.newItemModalVisible}
          onCancel={this._hideNewItemModal}
          className='noPadding'
          width={1100}
        >
          <div style={{ display: 'flex', position: 'relative' }}>
            <div style={{ width: '70%', padding: '24px', borderRight: '1px solid #f2f2f2' }}>
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <Input allowClear style={{ width: "240px" }} onChange={this.onKeywordsChange} placeholder='商品名称/商品编号/商品分类' />
                <Button type='primary' onClick={this.onsearchClick} style={{ margin: '0 10px' }}>搜索</Button>
                <Button type='primary' onClick={this.resetClicked}>重置</Button>
              </div>
              <Table
                indentSize={10}
                rowKey="modalId"
                columns={this.modalColumns}
                loading={this.state.showTableLoading}
                pagination={this.state.pagination}
                dataSource={this.state.modalTableDataList}
              />
            </div>
            <div style={{ padding: '10px', width: '30%' }} >
              <div style={{ display: 'flex', border: '1px solid #f2f2f2', padding: '10px', marginBottom: '10px' }}>
                <div style={{ width: '75px', height: '75px', background: '#f2f2f2', marginRight: '10px' }}></div>
                <div style={{ width: '80%' }}>
                  <div className='flex-between' >
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}> 盛夏光年</div>
                    <img style={{ height: 15, width: 15 }} src='/image/close.png' />
                  </div>
                  <div>纸品-纸尿裤</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

      </CommonPage>
    )
  }

}

export default Form.create()(Page);