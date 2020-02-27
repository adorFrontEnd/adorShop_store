import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList, updateUserStatus } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { getGradeList } from "../../api/user/grade";

const _title = "客户列表";
const _description = "";
const userEditPath = routerConfig["user.userManage.userEdit"].path;

const _statusEnum = {
  "0": "正常",
  "1": "待审核",
  "2": "未通过",
  "3": "已停用"
}

const _statusColorEnum = {
  "0": "color-green",
  "1": "theme-color",
  "2": "color-gray",
  "3": "color-red"
}
const _statusEnumArr = Object.keys(_statusEnum).map(item => { return { id: item, name: _statusEnum[item] } });

class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    exportUserListUrl: null,
    gradeList: []
  }

  componentDidMount() {
    this.props.changeRoute({ path: 'user.userManage.userList', title: '客户列表', parentTitle: '会员管理' });
    this.getGradeList();
    this.getPageData();
  }

  goUserEdit = () => {
    let title = '积分记录';
    this.props.changeRoute({ path: 'marketManage.integralRecord', title, parentTitle: '市场营销' });
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
    optionList: []
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
    field: "likeName",
    style: { width: 320 },
    placeholder: "客户名称/客户编码/登录账号/地区/联系人/上级"
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

  getGradeList = () => {
    getGradeList()
      .then(gradeList => {
        gradeList.push({ id: "-1", name: "可降级状态" })
        this.formItemList[0].optionList = gradeList;
      })
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchUserList(this.params).then(res => {
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
    { title: "客户编码", dataIndex: "customerNumber", render: data => data || "--" },
    { title: "登录账号", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "地区", dataIndex: "area", render: data => this.getAreaData(data) },
    { title: "级别", dataIndex: "gradeName", render: data => data || "--" },
    // { title: "联系人", dataIndex: "province", render: data => data || "--" },
    { title: "状态", dataIndex: "status", render: data => data || data == 0 ? <span className={_statusColorEnum[data]}>{_statusEnum[data]}</span> : "--" },
    {
      title: "上级", dataIndex: "superiorId", render: (text, record, index) => (
        <>
          {
            record.superiorCustomerNumber ?
              <div className='text-center'>
                <div className='theme-color'>{record.superiorCustomerName}</div>
                <div>{record.superiorCustomerNumber}</div>
              </div>
              :
              <div className='text-center'>--</div>
          }
        </>
      )
    },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.status == "0" ?
              <span>
                <Popconfirm
                  placement="topLeft" title='确认要停用吗？'
                  onConfirm={() => { this.updateStatus(record, '3') }} >
                  <a size="small">停用</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
              :
              null
          }
          {
            record.status == "3" ?
              <span>
                <Popconfirm
                  placement="topLeft" title='确认要启用吗？'
                  onConfirm={() => { this.updateStatus(record, '0') }} >
                  <a size="small">启用</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
              :
              null
          }
          {
            record.status == 1 ?
              <span>
                <Popconfirm
                  placement="topLeft" title='要审核通过吗？'
                  okText='通过'
                  cancelText='不通过'
                  onConfirm={() => { this.updateStatus(record, '0', true) }}
                  onCancel={() => { this.updateStatus(record, '2', true) }}
                >
                  <a size="small">审核</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
              :
              null
          }
          {
            record.status == "0" || record.status == "1" || record.status == "3" ?
              <span>
                <span onClick={() => { this.goUserEdit(record.shopUserId) }}><NavLink to={userEditPath + "/" + record.shopUserId}>编辑</NavLink></span>
                <Divider type="vertical" />
              </span>
              : null
          }

          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.updateStatus(record, '-1') }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>

        </span>
      )
    }
  ]

  //更新状态，启用，停用，审核，编辑，删除
  updateStatus = (record, status, isReview) => {
    let sEnum = {
      '-1': "删除",
      "0": "启用",
      "3": "停用"
    }
    let title = isReview ? "审核完毕!" : `${sEnum[status]}成功！`;
    let { shopUserId } = record;
    updateUserStatus({ shopUserId, status })
      .then(() => {
        Toast(title);
        this.getPageData();
      })
  }

  getAreaData = (areaData) => {
    if (!areaData) {
      return '--'
    }
    let arr = areaData.split(',');
    return arr[1]
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

  goEdit = (id) => {
    let title = id == '0' ? '添加客户' : "编辑客户"
    this.props.changeRoute({ path: 'user.userManage.userEdit', title, parentTitle: '会员管理' });
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <div className="flex-between align-center margin-bottom20">
            <NavLink to={userEditPath + "/0"}>
              <Button type='primary' onClick={() => this.goEdit('0')}>创建客户</Button>
            </NavLink>
            <div style={{ minWidth: 850 }}>
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