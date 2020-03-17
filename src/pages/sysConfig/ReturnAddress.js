import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';


const _title = "退货配置";
const _description = "";



class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }





  componentDidMount() {
    this.getPageData();
  }



  params = {
    page: 1
  }


  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "名称/地址/联系人/联系电话"
    }]
  //查询按钮点击事件
  searchClicked = (params) => {
    let { inputData } = params;
    inputData = inputData || null;
    this.params = {
      page: 1,
      ...params,
      inputData
    }
    // this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
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


  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "名称", dataIndex: "name", render: data => data || "--" },
    { title: "地址", dataIndex: "imageUrl", render: data => data || '--' },
    { title: "联系电话", dataIndex: "specifications", render: data => data || "--" },
    { title: "联系人", dataIndex: "channel", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span onClick={() => this.showEditModalClick()}>编辑</span>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteTableItem(record) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]
  showEditModalClick = (data) => {
    this.showAuthModal(data);
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
  /* Modal操作*******************************************************************************************************************************************/
  newItemFormList = [
    {
      type: "INPUT",
      field: "name",
      label: "名称:",
      placeholder: "请输入角色名称",
      rules: [
        { required: true, message: '请输入角色名称!' }
      ]
    }
    ,
    {
      type: "INPUT",
      field: "adress",
      label: "地址:",
      placeholder: "请输入角色名称",
      rules: [
        { required: true, message: '请输入角色名称!' }
      ]
    },
    {
      type: "INPUT",
      field: "phone",
      label: "联系电话:",
      placeholder: "请输入角色名称",
      rules: [
        { required: true, message: '请输入角色名称!' }
      ]
    },
    {
      type: "INPUT",
      field: "user",
      label: "联系人:",
      placeholder: "请输入角色名称",
      rules: [
        { required: true, message: '请输入角色名称!' }
      ]
    }
  ]

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
   
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <div className="flex-between align-center margin-bottom20 flex-wrap">
            <Button type='primary' onClick={() => { this.showEditModalClick() }}>创建退货地址</Button>
            <div >
              <SearchForm
                searchText='筛选'
                towRow={false}
                searchClicked={this.searchClicked}
                formItemList={this.formItemList}

              />
            </div>
          </div>

          <Table
            indentSize={10}
            rowKey="id"
            columns={this.columns}
            loading={this.state.showTableLoading}
            pagination={this.state.pagination}
            dataSource={this.state.tableDataList}
          />
        </div>
        <Modal maskClosable={false}
          title="退货地址"
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
      </CommonPage >
    )
  }
}
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));