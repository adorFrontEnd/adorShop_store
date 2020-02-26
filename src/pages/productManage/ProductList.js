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

const _title = "商品列表";
const _description = "";
const integralRecordPath = routerConfig["user.userManage.userList"].path;
const giftRecordPath = routerConfig["user.userManage.userList"].path;
const productEditPath = routerConfig["productManage.productInfo.productEdit"].path;
const _channelEnum = {
  "0": "直购",
  "1": "订货",
  "2": "云市场"
}
const _channelEnumArr = Object.keys(_channelEnum).map(item => { return { id: item, name: _channelEnum[item] } });

class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    exportUserListUrl: null
  }

  componentDidMount() {
    this.props.changeRoute({ path: 'product.productInfo.productEdit', title: '商品编辑', parentTitle: '商品管理' });

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
  formItemList = [
    {
      type: "SELECT",
      field: "status",
      style: { width: 140 },
      defaultOption: { id: null, name: "全部" },
      placeholder: '选择渠道',
      initialValue: null,
      optionList: _channelEnumArr
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
    { title: "商品名称", dataIndex: "name", render: data => data || "--" },
    { title: "商品图", dataIndex: "imageUrl", render: data => data ? (<img src={data} style={{ height: 40, width: 40 }} />) : "--" },
    { title: "包装规格", dataIndex: "specifications", render: data => data || "--" },
    { title: "可用渠道", dataIndex: "channel", render: data => data || "--" },
    { title: "单位", dataIndex: "unit", render: data => data || "--" },
    { title: "新增时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span onClick={() => { this.goIntegralRecord(record.id) }}><NavLink to={integralRecordPath + "/" + record.id}>编辑</NavLink></span>
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
            <div>
              <NavLink to={productEditPath + "/0"}><Button type='primary' onClick={() => this.goEdit('0')}>创建商品</Button></NavLink>
              <Button type='primary' className='margin0-10'>批量倒入商品</Button>
              <Button type='primary' >批量删除</Button>
            </div>
            <SearchForm
              width={750}
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