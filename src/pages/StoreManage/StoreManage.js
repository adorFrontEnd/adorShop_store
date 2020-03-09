import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';


const _title = "仓库管理";
const _description = "";



class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }

  componentDidMount() {


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
      placeholder: "仓库名称/仓库编号/备注"
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
    { title: "仓库编号", dataIndex: "name", render: data => data || "--" },
    { title: "仓库名称", dataIndex: "imageUrl", render: data => data || '--' },
    { title: "备注", dataIndex: "specifications", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
          <span onClick={() => this.showEditModalClick()}>删除</span>
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

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <div className="flex-between align-center margin-bottom20 flex-wrap">
            <div className=" align-center margin-bottom20 " style={{ display: 'flex' }}>
              <div style={{ marginRight: '15px' }}> <Input placeholder='仓库编号' /></div>
              <div style={{ marginRight: '15px' }}> <Input placeholder='仓库名称' /></div>
              <div style={{ marginRight: '15px' }}> <Input placeholder='编号' /></div>
              <Button type='primary' onClick={() => { this.showEditModalClick() }}>添加新仓</Button>

            </div>
         
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