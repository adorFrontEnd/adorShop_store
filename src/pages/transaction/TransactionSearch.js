import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { searchOrderList, exportOrder } from '../../api/transaction/transaction';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { getAllApplication } from '../../api/appManage';
import numberFilter from '../../utils/filter/number';
import { NavLink, Link } from 'react-router-dom';
import { routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';
import PictureWall from '../../components/upload/PictureWall';
const detailPath = routerConfig["transaction.orderDetail"].path;
const refundRequestPath = routerConfig["transaction.refundRequest"].path;
const refundSearchPath = routerConfig["transaction.refundSearch"].path;

const _title = "交易查询";
class Page extends Component {

  state = {
    showTableLoading: false,
    enterpriseModalIsVisible: false,
    transferModalIsVisible: false,
    editFormValue: null,
    showImgValidateInfo: false,
    applicationList: []
  }

  componentDidMount() {
    this.getPageData();
    this.getApplicationList();
  }

  params = {
    page: 1
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchOrderList(this.params).then(res => {
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


  getApplicationList = () => {
    getAllApplication()
      .then(applicationList => {
        this.setState({
          applicationList
        })
      })
  }


  // 表格相关列
  columns = [
    { title: "商家订单号", dataIndex: "companyOrderNo", render: data => data || "--" },
    // { title: "交易订单号", dataIndex: "orderNo", render: data => data || "--" },
    { title: "支付流水号", dataIndex: "payRecord", render: data => data || "--" },
    { title: "所属应用", dataIndex: "appName", render: data => data || "--" },
    { title: "交易通道", dataIndex: "paymentChannelStr" },
    { title: "交易方式", dataIndex: "meansOfTransactionStr" },
    { title: "支付场景", dataIndex: "payScenesStr" },
    { title: "交易状态", dataIndex: "tradingStatusStr" },
    { title: "订单金额", dataIndex: "payAmount", render: data => data ? numberFilter(data) : 0 },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "应用返回", dataIndex: "notifyStatus", render: data => data ? (data == "1" ? <span className='color-green'>成功</span> : <span className='color-red'>失败</span>) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (

        <span>
          <NavLink to={detailPath + `?id=${record.id}`}>
            查看
          </NavLink>
          {
            record.tradingStatus == '1' || record.tradingStatus == '2' || record.tradingStatus == '3' || record.tradingStatus == '5' || record.tradingStatus == '6' ?
              <span>
                <Divider type="vertical" />
                <NavLink to={refundRequestPath + `?id=${record.id}`}>
                  退款
                </NavLink>
              </span>
              : null
          }
          {
            record.tradingStatus == '3' || record.tradingStatus == '4' || record.tradingStatus == '5' || record.tradingStatus == '6' ?
              <span>
                <Divider type="vertical" />
                <NavLink to={refundSearchPath + `?id=${record.id}`}>
                  查询退款单
                </NavLink>
              </span>
              : null
          }
        </span>
      )
    }
  ]


  /*搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { time, nameParam } = params;
    let { startPayAmount, endPayAmount } = this.state;
    if (endPayAmount < startPayAmount) {
      Toast('交易金额下限小于上限！');
      return
    }
    if (time && time.length) {
      let [startTime, stopTime] = time;
      let startCreateTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        ...params,
        startPayAmount,
        endPayAmount,
        startCreateTimeStamp,
        endCreateTimeStamp,
        time: null
      }
    } else {
      this.params = {
        ...params,
        startPayAmount,
        endPayAmount,
        time: null
      }
    }
    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
    this.setState({
      startPayAmount: null,
      endPayAmount: null
    })
  }

  exportClicked = () => {
    exportOrder(this.params);
  }

  onAmountChange = (e, k) => {
    let data = {};
    data[k] = e;
    this.setState(data);
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { companyList, applicationList, startPayAmount, endPayAmount } = this.state;
    return (
      <CommonPage title={_title} >

        <div className='margin10-0'>
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="companyOrderNoParam"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='商家订单号'
                >
                  {
                    getFieldDecorator('companyOrderNoParam', {
                    })(
                      <Input allowClear placeholder="输入商家订单号" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='交易金额：'
                  field='amount'
                >
                  <Input.Group compact style={{ width: 240 }}>
                    <InputNumber
                      precision={0}
                      min={0}
                      value={startPayAmount}
                      onChange={(e) => { this.onAmountChange(e, 'startPayAmount') }}
                      style={{ width: 106, textAlign: 'center' }}
                    />
                    <InputNumber
                      style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }}
                      placeholder="~"
                      disabled
                    />
                    <InputNumber
                      precision={0}
                      value={endPayAmount}
                      min={0}
                      onChange={(e) => { this.onAmountChange(e, 'endPayAmount') }}
                      style={{ width: 106, textAlign: 'center' }}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='创建时间'
                  field='time'>
                  {
                    getFieldDecorator('time')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8}>
                <Form.Item
                  field="meansOfTransaction"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='交易方式'
                >
                  {
                    getFieldDecorator('meansOfTransaction', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>全部</Select.Option>
                        <Select.Option value={1}>微信支付</Select.Option>
                        <Select.Option value={2}>支付宝支付</Select.Option>
                        <Select.Option value={3}>银联支付</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  field="payScenes"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='支付场景'
                >
                  {
                    getFieldDecorator('payScenes', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>全部</Select.Option>
                        <Select.Option value={1}>线上付</Select.Option>
                        <Select.Option value={2}>扫码付</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  field="appId"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='所属应用'
                >
                  {
                    getFieldDecorator('appId', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>全部</Select.Option>
                        {
                          applicationList && applicationList.length ?
                            applicationList.map(item =>
                              <Select.Option key={item.id} value={item.appId}>{item.name}</Select.Option>
                            )
                            : null
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='margin10-0'>
          <Button type='primary' className='normal' onClick={this.searchClicked}>筛选</Button>
          <Button className='yellow-btn margin0-10 normal' onClick={this.exportClicked}>导出</Button>
          <Button type="primary" onClick={this.resetClicked}>清除所有筛选</Button>
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


