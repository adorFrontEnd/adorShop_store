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
const _title = "智能词库";
const LexiconConfigPath = routerConfig["sysConfig.orderConfig.lexiconConfig"].path;
const _lexiconCategory = {
  "0": "姓名",
  "1": "商品",
  "2": "规格",
  "3": "数量"
}
const _lexiconCategoryArr = Object.keys(_lexiconCategory).map(item => { return { id: item, name: _lexiconCategory[item] } });
class Page extends Component {

  state = {
    status: false,
    pageData: null
  }

  componentDidMount() {
  }
  // 表格相关列
  columns = [

    { title: "关键词", dataIndex: "customerName", render: data => data || "--" },
    { title: "关键类别", dataIndex: "customerNumber", render: data => data || "--" },
    { title: "范围", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span>
            <a onClick={() => { this.showAcountModal(record) }}>编辑信息</a>
            <Divider type="vertical" />
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteClassify(record) }} >
              <a size="small" style={{ color: '#ff8716' }}>删除</a>
            </Popconfirm>
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
      initialValue: null,
      optionList:_lexiconCategoryArr
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

  goLexiconConfig = (id) => {
    let title = id == '0' ? '词库配置' : "词库配置"
    this.props.changeRoute({ path: 'sysConfig.orderConfig.lexiconConfig', title, parentTitle: '订单配置' });
  }
  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div className="flex-between align-center margin-bottom20">
          <NavLink to={LexiconConfigPath + "/0"}>
            <Button type='primary' onClick={() => this.goLexiconConfig('0')}>创建词库</Button>
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