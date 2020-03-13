import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Popconfirm, Divider } from "antd";
import { NavLink, Link } from 'react-router-dom';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { changeRoute } from '../../store/actions/route-actions';
import { connect } from 'react-redux';
import Toast from '../../utils/toast';
const _title = "业绩配置";
const performanceEditPath = routerConfig["orderManage.stockManage.performanceEdit"].path;
class Page extends Component {

  state = {
    status: false,
    pageData: null
  }

  componentDidMount() {
  }
  // 表格相关列
  columns = [

    { title: "业绩组", dataIndex: "customerName", render: data => data || "--" },
    { title: "商品数", dataIndex: "customerNumber", render: data => data || "--" },
    { title: "计算方式", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "变更时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span>
            <a onClick={() => { this.showAcountModal(record) }}>编辑商品</a>
            <Divider type="vertical" />
            <a to={performanceEditPath + "/0"}>编辑业绩</a>
            <Divider type="vertical" />
            <a>删除</a>
          </span>
        </span>
      )
    }
  ]
  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "status",
      style: { width: 140 },
      defaultOption: { id: null, name: "所有类别" },
      placeholder: '选择类别',
      initialValue: null
    },
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "商品名称/商品编号"
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


  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div className="flex-between align-center margin-bottom20">
          <NavLink to={performanceEditPath + "/0"}>
            <Button type='primary'>添加业绩组</Button>
          </NavLink>
          <div style={{ minWidth: 700 }}>
            <SearchForm
              width={700}
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

      </CommonPage>
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