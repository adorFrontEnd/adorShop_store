import React, { Component } from "react";
import { Col, Row, Card, Spin, Form, Button, Input, Table, Popconfirm, Divider, Modal, Select } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchOperList, deleteOper, saveOrUpdate } from '../../api/oper/oper';
import { searchRoleList } from '../../api/oper/role';
import { pagination } from '../../utils/pagination';

const _title = "员工账号";
const _description = "";

class Page extends Component {

  state = {

    tableDataList: null,
    showTableLoading: false,
    roleList: [],
    editFormValue: null,
    newItemModalVisible: false,
    selectOper: null,
    passwordModalVisible: false,
    password: null
  }

  componentWillMount() {

    this.getPageData();
    this.getRoleList();
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

  getRoleList = () => {
    searchRoleList({ page: 1, size: 100 })
      .then(res => {
        if (res && res.data && res.data.length) {
          let roleList = res.data;
          this.setState({
            roleList
          })
          this.newItemFormList[2].optionList = roleList.filter(item => item.name != '超级管理员');;
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
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.roleName != '超级管理员' ?
              <span>
                <a onClick={() => { this.showAcountModal(record) }}>编辑</a>
                <Divider type="vertical" />
                <a onClick={() => { this.showPasswordModal(record) }}>重置密码</a>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={() => { this.deleteOper(record) }} >
                  <a size="small" className='color-red'>删除</a>
                </Popconfirm>
              </span>
              :
              <a onClick={() => { this.showPasswordModal(record) }}>重置密码</a>
          }
        </span>
      )
    }
  ]

  /* Modal操作*******************************************************************************************************************************************/
  newItemFormList = [
    {
      type: "INPUT",
      field: "nickname",
      label: "账号名称:",
      placeholder: "请输入名称",
      rules: [
        { required: true, message: '请输入名称!' }
      ]
    },
    {
      type: "INPUT",
      field: "username",
      label: "登录手机号:",
      placeholder: "请输入手机号码",
      rules: [
        { required: true, message: '请输入手机号码!' }
      ]
    },
    {
      type: "SELECT",
      field: "roleId",
      label: "角色:",
      placeholder: "请选择角色名称",
      optionList: [],
      rules: [
        { required: true, message: '请选择角色名称!' }
      ]
    }
  ]

  // 打开modal
  showAcountModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
    let selectOper = data || null;
    let editFormValue = {};
    if (data) {
      let { roleId, roleName, username, nickname } = data;
      roleId = { key: roleId, label: roleName };
      editFormValue = { roleId, username, nickname, _s: Date.now() };
    }

    this.setState({
      editFormValue,
      selectOper
    })
  }

  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }

  newItemModalSaveClicked = (data) => {

    let { roleId } = data;
    roleId = roleId.key;

    let params = { ...data, roleId }
    let title = '添加账户成功！';
    if (this.state.selectOper) {
      let { id } = this.state.selectOper;
      params.id = id;
      title = '修改账户成功！'
    }
    saveOrUpdate(params)
      .then(() => {
        Toast(title);
        this.getPageData();
        this._hideNewItemModal();
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

  // 重置密码
  resetPassword = (record) => {
    let { id } = record;
    let status = '0';
    saveOrUpdate({ id, status })
      .then(() => {
        Toast("禁用账户成功！");
        this.getPageData();
      })
  }

  // 显示重置密码modal
  showPasswordModal = (selectOper) => {

    this.setState({
      selectOper,
      passwordModalVisible: true
    })
  }

  // 隐藏密码modal
  hidePasswordModal = () => {
    this.setState({
      passwordModalVisible: false
    })
  }

  passwordModalConfirm = () => {
    let { id } = this.state.selectOper;
    let { password } = this.state;
    if (!password || password.length < 6) {
      Toast('请填入至少6位数的密码！');
      return;
    }
    saveOrUpdate({ id, password })
      .then(() => {
        Toast('重置密码成功！');
        this.hidePasswordModal();
      })
  }

  passwordOnChange = (e) => {
    let password = e.target.value;
    this.setState({
      password
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


  render() {
    const { getFieldDecorator } = this.props.form;
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
          title="添加/修改账号"
          visible={this.state.newItemModalVisible}
          footer={null}
          onCancel={this._hideNewItemModal}
          className='noPadding'
        >
          <SubmitForm
            clearWhenHide={true}
            showForm={this.state.newItemModalVisible}
            setFormValue={this.state.editFormValue}
            formItemList={this.newItemFormList}
            saveClicked={this.newItemModalSaveClicked}
            cancelClicked={this._hideNewItemModal}
          >
          </SubmitForm>
        </Modal>

        <Modal maskClosable={false}
          title="重置密码"
          visible={this.state.passwordModalVisible}
          onCancel={this.hidePasswordModal}
          onOk={this.passwordModalConfirm}
          className='noPadding'
        >
          <div>

          </div>

          <Row className='line-height40'>
            <Col span={7} className='text-right'>
              <span className='label-color label-required'>填写密码：</span>
            </Col>
            <Col span={10}>
              <Input
                value={this.state.password}
                onChange={this.passwordOnChange}
                placeholder='请填入至少6位数的密码'
              />
            </Col>
          </Row>

        </Modal>

      </CommonPage >)
  }
}

export default Form.create()(Page);