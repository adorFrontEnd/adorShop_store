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
import { saveOrUpdateSalesman, getSalesmanList, deleteSalesman } from '../../api/order/salesman';

const _title = "业务员管理";
const _description = "";



class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }

  componentDidMount() {
    this.getPageData()

  }



  params = {
    page: 1
  }

  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getSalesmanList(this.params).then(res => {
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


  saveOrUpdateSalesman = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }

      saveOrUpdateSalesman({ ...data })
        .then(() => {
          Toast('添加成功');
          this.props.form.resetFields();
          this.getPageData();
        })
    })
  }

// 删除业务员
deleteSalesman = (record) => {
  let { id } = record;
  deleteSalesman({ id })
    .then(() => {
      Toast("删除成功！");
      this.getPageData();
    })
}

  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "INPUT",
      field: "likeName",
      style: { width: 300 },
      placeholder: "业务员名称/业务员手机号"
    }]
  //查询按钮点击事件
  searchClicked = (params) => {
    let { likeName } = params;
    likeName = likeName || null;
    this.params = {
      page: 1,
      ...params,
      likeName
    }
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }



  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "序号", dataIndex: "id", render: data => data || "--" },
    { title: "业务员名称", dataIndex: "salesmanName", render: data => data || '--' },
    { title: "业务员手机号", dataIndex: "salesmanPhone", render: data => data || "--" },
    { title: "备注", dataIndex: "remark", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
      
        <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteSalesman(record) }} >
              <a size="small" style={{ color: '#ff8716' }}>删除</a>
            </Popconfirm>
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
            <Form layout='inline' style={{ marginBottom: '20px' }}>
              <Form.Item>
                {
                  getFieldDecorator('salesmanName', {
                    rules: [
                      { required: true, message: '新业务员名称' }
                    ]
                  })(
                    <Input placeholder='新业务员名称' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('salesmanPhone', {
                    rules: [
                      { required: true, message: '新业务员手机号' }
                    ]
                  })(
                    <Input placeholder='新业务员手机号' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('remark', {
                    rules: [
                      { required: true, message: '备注' }
                    ]
                  })(
                    <Input placeholder='备注' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={() => { this.saveOrUpdateSalesman() }}>新增业务员</Button>
              </Form.Item>
            </Form>


            <div style={{ marginBottom: '20px' }}>
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