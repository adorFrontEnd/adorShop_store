import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { getStorageList, putStorage, deleteStorage, getSelectList } from '../../api/storeManage/storeManage';
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
    this.getPageData();
  }

  params = {
    page: 1
  }
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getStorageList(this.params).then(res => {
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

  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "INPUT",
      field: "likeName",
      style: { width: 300 },
      placeholder: "仓库名称/仓库编号/备注"
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
  // 添加仓库
  putStorage = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      putStorage({ ...data })
        .then(() => {
          Toast('添加成功');
          this.props.form.resetFields();
          this.getPageData();
        })
    })
  }

  // 删除仓库
  deleteStorage = (record) => {
    let { id } = record;
    deleteStorage({ id })
      .then(() => {
        Toast("删除成功！");
        this.getPageData();
      })
  }

  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "仓库编号", dataIndex: "code", render: data => data || "--" },
    { title: "仓库名称", dataIndex: "name", render: data => data || '--' },
    { title: "备注", dataIndex: "remark", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span >
            <a size="small" className="color-red" onClick={() => this.deleteStorage(record)}> 删除</a>
        </span>
      )
    }
  ]


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
            <Form layout='inline'
            >
              <Form.Item>
                {
                  getFieldDecorator('code', {
                    rules: [
                      { required: true, message: '仓库编号' }
                    ]
                  })(
                    <Input placeholder='仓库编号' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '仓库名称' }
                    ]
                  })(
                    <Input placeholder='仓库名称' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('remark', {
                    rules: [
                      { required: true, message: '仓库备注' }
                    ]
                  })(
                    <Input placeholder='仓库备注' allowClear />
                  )
                }

              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={() => { this.putStorage() }}>添加新仓</Button>
              </Form.Item>
            </Form>
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