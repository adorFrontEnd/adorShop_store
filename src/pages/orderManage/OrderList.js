import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, DatePicker, Tabs } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { getOrderlist } from '../../api/order/order';
import { SearchForm, SubmitForm } from '../../components/common-form';
import numberFilter from '../../utils/filter/number';
import { NavLink, Link } from 'react-router-dom';
import { routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import { OrderStatusEnum } from '../../enum/orderEnum';
import moment from 'moment';

const detailPath = routerConfig["orderManage.order.orderDetail"].path;

const _title = "订单列表";
const tabsList = [0, 3, 4, 5, 7, 2];
class Page extends Component {

  state = {
    showTableLoading: false,
    activeTabsKey: "all"
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }

  onTabsChange = (activeTabsKey) => {
    this.setState({
      activeTabsKey
    })

    this.params.status = activeTabsKey == 'all' ? null : activeTabsKey;
    this.params.page = 1;
    this.getPageData();
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getOrderlist(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize;
        _this.getPageData();
      })

      this.setState({
        pageDataList: res.data,
        pagination: _pagination,

      })

    }).catch(() => {
      this._hideTableLoading();
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
    { title: "订单号", dataIndex: "orderNo", render: data => <div style={{ wordWrap: "break-word", wordBreak: "break-all" }}>{data}</div> || "--" },
    { title: "联系人", dataIndex: "contactPerson", render: data => data || "--" },
    { title: "联系电话", dataIndex: "contactPhone", render: data => data || "--" },
    { title: "配送地址", render: (text, record, index) => this.getTotalAddress(record) },
    { title: "订单金额", dataIndex: "totalPrice", render: data => (data || data == 0) ? numberFilter(data) : "--" },
    { title: "订单状态", dataIndex: "status", render: data => data || data == 0 ? OrderStatusEnum[data] : "--" },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <NavLink to={detailPath + `/${record.id}`}>
            查看详情
          </NavLink>
        </span>
      )
    }
  ]

  getTotalAddress = (record) => {

    if (!record) {
      return '--'
    }

    let { contactProvince, contactAddress, contactArea, contactCity } = record;
    return `${contactProvince}${contactCity}${contactArea}${contactAddress}`
  }

  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "DATE_RANGE",
      field: "time",
      label: "时间范围",

    },
    {
      type: "INPUT",
      field: "likeName",
      style: { width: 300 },
      placeholder: "订单编号/联系电话/联系人"
    }]

  //查询按钮点击事件
  searchClicked = (params) => {
    let { likeName, time } = params;
    let { activeTabsKey } = this.state;
    let [startTime, endTime] = dateUtil.parseDateRange(time);
    likeName = likeName || null;
    let status = activeTabsKey == 'all' ? null : activeTabsKey;
    this.params = {
      page: 1,
      startTime,
      endTime,
      likeName,
      status
    }
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { activeTabsKey } = this.state;
    return (
      <CommonPage title={_title} >
        <div>
          <Tabs onChange={this.onTabsChange} activeKey={activeTabsKey} type="card">
            <Tabs.TabPane tab='全部' key='all' />
            {
              tabsList.map(item =>
                <Tabs.TabPane tab={OrderStatusEnum[item]} key={item} />
              )
            }
          </Tabs>
        </div>
        <div>
          <div className='flex-end margin-bottom20'>
            <SearchForm
              width={1000}
              searchText='筛选'
              towRow={false}
              searchClicked={this.searchClicked}
              formItemList={this.formItemList}
            />
          </div>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />


      </CommonPage >
    )
  }
}
export default Form.create()(Page)


