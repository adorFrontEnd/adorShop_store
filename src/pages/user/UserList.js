import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchAttentionList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';

const _title = "客户列表";
const _description = "";
const integralRecordPath = routerConfig["user.userManage.userList"].path;
const giftRecordPath = routerConfig["user.userManage.userList"].path;
const settingDrainagePath = routerConfig["user.userManage.userList"].path;
const _statusEnum = {
  "0": "正常",
  "2": "待审核",
  "3": "未通过",
  "4": "已停用"
}
const _statusEnumArr = Object.keys(_statusEnum).map(item => { return { id: item, name: _statusEnum[item] } });

class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    exportUserListUrl: null
  }

  componentDidMount() {
    this.props.changeRoute({ path: 'user.userManage.userList', title: '客户列表', parentTitle: '会员管理' });

  }

  goIntegralRecord = () => {
    let title = '积分记录';
    this.props.changeRoute({ path: 'marketManage.integralRecord', title, parentTitle: '市场营销' });
  }

  goGiftRecord = () => {
    let title = '兑奖记录';
    this.props.changeRoute({ path: 'marketManage.giftRecord', title, parentTitle: '市场营销' });
  }

  params = {
    page: 1
  }

  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [{
    type: "SELECT",
    field: "gradeId",
    style: { width: 140 },
    defaultOption: { id: null, name: "所有级别" },
    placeholder: '选择级别',
    initialValue: null,
    optionList: [{ id: "1", name: "是" }, { id: "0", name: "否" }]
  },
  {
    type: "SELECT",
    field: "status",
    style: { width: 140 },
    defaultOption: { id: null, name: "所有状态" },
    placeholder: '选择加盟商',
    initialValue: null,
    optionList: _statusEnumArr
  },
  {
    type: "INPUT",
    field: "inputData",
    style: { width: 300 },
    placeholder: "客户名称/客户编码/登陆地区/联系人/上级"
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
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchAttentionList(this.params).then(res => {
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

  /**************************************************************************************** */
  // 表格相关列
  columns = [

    { title: "客户名称", dataIndex: "customerName", render: data => data || "--" },
    { title: "客户编码", dataIndex: "userId", render: data => data || "--" },
    { title: "登录账号", dataIndex: "avatar", render: data => data ? (<img src={data} style={{ height: 40, width: 40 }} />) : "--" },
    { title: "地区", dataIndex: "area", render: data => data || "--" },
    { title: "级别", dataIndex: "gradeName", render: data => data || "--" },
    { title: "联系人", dataIndex: "province", render: data => data || "--" },
    { title: "状态", dataIndex: "status", render: data => data || "--" },
    { title: "上级", dataIndex: "superiorId", render: data => data || "--" },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },

    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span onClick={() => { this.goIntegralRecord(record.id) }}><NavLink to={integralRecordPath + "/" + record.id}>积分记录</NavLink></span>
          <Divider type="vertical" />
          <span onClick={() => { this.goGiftRecord(record.id) }}><NavLink to={giftRecordPath + "/" + record.id}>兑奖记录</NavLink></span>
          {/* <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteTableItem(record) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm> */}
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

  exportUserListData = () => {
    let exportUserListUrl = exportUserList(this.params);
    if (!exportUserListUrl) {
      Toast("导出失败！")
      return;
    }
    this.setState({
      exportUserListUrl
    })

    setTimeout(() => {
      this.refs.exportUserListUrl.click()
    }, 1000)
  }



  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <div className="flex-between align-center margin-bottom20">
            <Button type='primary'>创建客户</Button>
            <SearchForm
              width={850}
              searchText='筛选'
              towRow={false}
              searchClicked={this.searchClicked}
              formItemList={this.formItemList}
            />
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