import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, InputNumber, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchOperList, deleteOper, saveOrUpdate, usernameCheck } from '../../api/oper/oper';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';
import { sendSms } from '../../api/SYS/SYS';

const _title = "账号管理";
const _description = "";

class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    roleList: [],
    normalRoleList: [],
    editFormValue: null,
    editModalVisible: false,
    selectRoleId: null,
    username: null,
    checkInfo: null,
    checkedOper: null,
    countNum: 60,
    editLoading: false,
    selectOper: null
  }

  componentWillMount() {

    this.getPageData();
    this.getRoleList();
  }

  componentWillUnmount() {
    this.resetCdTimer();
  }
  params = {
    page: 1
  }

  getPageData = () => {

    let _this = this;
    this._showTableLoading();

    searchOperList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })

      this.setState({
        tableDataList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { inputKey, inputValue, ...data } = params;
    let _data = {};
    _data[inputKey] = inputValue || null;

    this.params = {
      ...data,
      ..._data
    }
    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  getRoleList = () => {
    searchRoleList({ page: 1, size: 100 })
      .then(res => {
        if (res && res.data && res.data.length) {
          let roleList = res.data;
          let normalRoleList = roleList.filter(item => item.name != '超级管理员');
          this.setState({
            roleList,
            normalRoleList
          })
        }
      })
  }


  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }
  // 表格相关列 
  columns = [
    { title: "账号名", dataIndex: "nickname" },
    { title: "登录手机号", dataIndex: "username" },
    { title: "账号角色", dataIndex: "roleName", render: data => data || '--' },
    {
      title: "加入时间", render: (text, record, index) => (
        record && record.roleName != '超级管理员' && record.gmtCreate ? dateUtil.getDateTime(record.gmtCreate) : '--'
      )
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.roleName != '超级管理员' ?
              <span>
                <a onClick={() => { this.showAcountModal(record) }}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={() => { this.deleteOper(record) }} >
                  <a size="small" className='color-red'>删除</a>
                </Popconfirm>
              </span>
              :
              '--'
          }
        </span>
      )
    }
  ]

  /* 账号编辑操作*******************************************************************************************************************************************/
  // 打开modal
  showAcountModal = (selectOper) => {

    let selectRoleId = null;
    let username = null;
    if (selectOper) {
      if (selectOper.roleId) {
        selectRoleId = selectOper.roleId;
      }

      if (selectOper.username) {
        username = selectOper.username;
      }
    } else {
      this.resetUsername();
    }
    this.setState({
      editModalVisible: true,
      selectOper,
      selectRoleId,
      username
    })
  }

  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      editModalVisible: false
    })
  }

  //保存
  operSaveClicked = () => {
    let { selectRoleId, checkedOper, smsCode, selectOper } = this.state;
    if (!selectRoleId) {
      Toast('请选择角色！');
      return;
    }

    if (!checkedOper || !checkedOper.username) {
      Toast('请检查手机号是否存在！');
      return;
    }

    if (!smsCode || smsCode.toString().length != 6) {
      Toast('请输入短信验证码！');
      return;
    }
    let id = selectOper && selectOper.id ? selectOper.id : null;
    let params = { id, roleId: selectRoleId, username: checkedOper.username, smsCode };
    this.setState({
      editLoading: true
    })
    saveOrUpdate(params)
      .then(() => {
        Toast('保存成功！');
        this.getPageData();
        this.setState({
          editLoading: false,
          editModalVisible: false
        })
      })
      .catch(() => {
        this.setState({
          editLoading: false
        })
      })

  }

  deleteOper = (record) => {
    let { id } = record;
    deleteOper({ id })
      .then(() => {
        Toast("删除账号成功！");
        this.getPageData();
      })
  }

  usernameChange = (username) => {
    this.setState({
      username
    })
  }

  operIdChange = (selectRoleId) => {
    this.setState({
      selectRoleId
    })

  }

  checkClicked = () => {
    let username = this.state.username;
    if (!username || username.toString().length != 11) {
      Toast("请输入11位手机号！");
      return;
    }
    usernameCheck({ username })
      .then(data => {

        if (data && data.roleName == '超级管理员') {
          Toast('该账号为本店铺超级管理员，不能更改角色！');
          return
        }

        this.setState({
          checkInfo: data ? "1" : "0",
          checkedOper: data
        })
      })
  }

  resetUsername = () => {
    this.setState({
      username: null,
      checkedOper: null,
      smsCode: null
    })
  }

  smsCodeChange = (smsCode) => {
    this.setState({
      smsCode
    })
  }

  sendSmsClicked = () => {
    let { checkedOper } = this.state;
    let { username } = checkedOper;
    sendSms({ phone: username })
      .then(() => {
        Toast("发送短信成功！");
        this.startCdTimer();
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { checkInfo, checkedOper } = this.state;
    return (
      <CommonPage title={_title} description={_description} >
        <div>
          <Button onClick={() => { this.showAcountModal() }} style={{ width: 100 }} type='primary'>创建账号</Button>
        </div>
        <div className='margin10-0'>
          <Form layout='inline'>
            <Form.Item
              field="inputKey"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label='账号：'
              style={{ width: 200 }}
            >
              {
                getFieldDecorator('inputKey', {
                  initialValue: "nicknameParam"
                })(
                  <Select>
                    <Select.Option value='nicknameParam'>账户名</Select.Option>
                    <Select.Option value='usernameParam'>登录手机号</Select.Option>
                  </Select>
                )
              }
            </Form.Item>

            <Form.Item
              field="inputValue"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              {
                getFieldDecorator('inputValue', {
                })(
                  <Input allowClear style={{ width: "240px" }} />
                )
              }
            </Form.Item>

            <Form.Item
              field="roleId"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              label='账号角色：'
              style={{ width: 300 }}
            >
              {
                getFieldDecorator('roleId', {
                  initialValue: null
                })(
                  <Select>
                    <Select.Option value={null}>请选择角色</Select.Option>
                    {
                      this.state.roleList && this.state.roleList.length ?
                        this.state.roleList.map(item =>
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        )
                        : null

                    }
                  </Select>
                )
              }
            </Form.Item>

          </Form>
        </div>
        <div className='margin10-0'>
          <Button type='primary' className='normal' onClick={this.searchClicked}>筛选</Button>
          <Button className='margin-left' onClick={this.resetClicked}>清除所有筛选</Button>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.tableDataList}
        />

        <Modal maskClosable={false}
          title='创建/编辑账号'
          visible={this.state.editModalVisible}
          onCancel={this._hideNewItemModal}
          onOk={this.operSaveClicked}
          width={640}
        >
          <Spin spinning={this.state.editLoading}>
            <Row className='line-height40'>
              <Col span={6} className='text-right'>
                <span className='label-color label-required'>角色：</span>
              </Col>
              <Col span={18}>
                <Select style={{ width: 200 }} defaultValue={null} value={this.state.selectRoleId} onChange={this.operIdChange}>
                  <Select.Option value={null}>请选择角色</Select.Option>
                  {
                    this.state.normalRoleList && this.state.normalRoleList.length ?
                      this.state.normalRoleList.map(item =>
                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                      )
                      : null

                  }
                </Select>
              </Col>
            </Row>
            <Row className='line-height40'>
              <Col span={6} className='text-right'>
                <span className='label-color label-required'>手机号：</span>
              </Col>
              <Col span={18}>
                <InputNumber
                  style={{ width: 200 }}
                  precision={0}
                  min={0}
                  value={this.state.username}
                  onChange={this.usernameChange}
                  placeholder='请输入手机号'
                />
                <Button onClick={this.checkClicked} type='primary' className='normal' style={{ margin: "0 10px" }}>检测</Button>
                <Button onClick={this.resetUsername} type='primary' className='normal'>重置</Button>
              </Col>
            </Row>
            <Row className='line-height20'>
              <Col offset={3}>
                {
                  checkInfo == '0' ?
                    <span className='color-red margin-top'>
                      该手机号尚未注册，请先使用该手机号在门店登录页面完成注册
                  </span> : null
                }
                {
                  checkInfo == '1' && checkedOper ?
                    <div className='padding-top'>
                      <div>存在账号，保存即确认使用此账号</div>
                      <div style={{ border: "1px solid #ccc", padding: 10 }} className='flex-middle'>
                        <div>
                          <img src={checkedOper.imageUrl} style={{ height: 40, width: 40 }} />
                        </div>
                        <div className='margin0-10'>
                          <div>{checkedOper.nickname}</div>
                          <div className='theme-color'>{checkedOper.username}</div>
                        </div>
                        <div className='margin0-10'>
                          <InputNumber style={{ width: 110 }} onChange={this.smsCodeChange} value={this.state.smsCode} />
                        </div>
                        <Button
                          disabled={this.state.countNum != 60}
                          onClick={this.sendSmsClicked} type='primary' style={{ width: "100%", marginRight: "20px" }}>
                          {
                            this.state.countNum == 60 ?
                              <span>发送</span>
                              :
                              <span>已发送（{this.state.countNum}秒后可重发）</span>
                          }

                        </Button>
                      </div>

                    </div>
                    : null
                }
              </Col>
            </Row>
          </Spin>
        </Modal>

      </CommonPage >)
  }
}

export default Form.create()(Page);