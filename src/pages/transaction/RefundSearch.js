import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { searchRefundOrderList, exportRefund } from '../../api/transaction/refund';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';
import numberFilter from '../../utils/filter/number';
import { getAllCompany } from '../../api/enterpriseAccount';
import { getAllApplication } from '../../api/appManage';
import { NavLink, Link } from 'react-router-dom';
import { routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { parseUrl } from '../../utils/urlUtils';

const _title = "退款查询";
const detailPath = routerConfig["transaction.refundOrderDetail"].path;

class Page extends Component {

  state = {
    showTableLoading: false,
    enterpriseModalIsVisible: false,
    transferModalIsVisible: false,
    editFormValue: null,
    applicationList: []
  }

  componentDidMount() {
    this.getOrderId();
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

    searchRefundOrderList(this.params).then(res => {
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


  getOrderId = () => {
    let urlParams = parseUrl(this.props.location.search);
    if (urlParams && urlParams.args && urlParams.args.id) {
      let refundOrderIdParam = urlParams.args.id;     
      this.params = {
        ...this.params,
        refundOrderIdParam
      }
    }
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

  viewDetail = (record) => {

  }

  // 表格相关列
  columns = [
    { title: "退款单号", dataIndex: "orderNo", render: data => data || '--' },
    { title: "商家订单号", dataIndex: "companyOrderNo", render: data => data || '--' },
    { title: "支付流水号", dataIndex: "payRecord", render: data => data || '--' },
    { title: "所属应用", dataIndex: "appName", render: data => data || '--' },
    { title: "退款状态", dataIndex: "refundStatusStr", render: data => data || '--' },
    { title: "退款金额", dataIndex: "payAmount", render: data => data ? numberFilter(data) : 0 },
    { title: "退款发起时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "退款完成时间", dataIndex: "finishTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "发起方式", dataIndex: "transferStr", render: data => data || '--' },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <NavLink to={detailPath + `?id=${record.id}`}>
            查看
          </NavLink>
        </span>
      )
    }
  ]

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { time, finishTime, ...otherData } = params;
    let startCreateTimeStamp = null;
    let endCreateTimeStamp = null;
    let startFinishTimeStamp = null;
    let endFinishTimeStamp = null;

    if (time && time.length) {
      let [startTime, stopTime] = time;
      startCreateTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      endCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
    }

    if (finishTime && finishTime.length) {
      let [startTime, stopTime] = finishTime;
      startFinishTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      endFinishTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
    }

    this.params = {
      page: 1,
      ...otherData,
      startCreateTimeStamp,
      endCreateTimeStamp,
      startFinishTimeStamp,
      endFinishTimeStamp
    }
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  exportClicked = () => {
    exportRefund(this.params)
  }



  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { companyList, applicationList } = this.state;

    return (
      <CommonPage title={_title} >
        <div className='margin10-0'>
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="orderNoParam"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='退款单号'
                >
                  {
                    getFieldDecorator('orderNoParam', {
                    })(
                      <Input allowClear placeholder="输入退款单号" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
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
                      <Input allowClear placeholder="输入订单号" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='发起时间'
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
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='完成时间'
                  field='finishTime'>
                  {
                    getFieldDecorator('finishTime')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  field="refundStatus"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='退款状态'
                >
                  {
                    getFieldDecorator('refundStatus', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>请选择</Select.Option>
                        <Select.Option value={1}>退款中</Select.Option>
                        <Select.Option value={2}>退款完成</Select.Option>

                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  field="refundType"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='退款类型'
                >
                  {
                    getFieldDecorator('refundType', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>请选择</Select.Option>
                        <Select.Option value={1}>部分退款</Select.Option>
                        <Select.Option value={2}>全额退款</Select.Option>

                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>

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
                        <Select.Option value={null}>请选择</Select.Option>
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
              <Col span={8}>
                <Form.Item
                  field="transfer"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='发起方式'
                >
                  {
                    getFieldDecorator('transfer', {
                      initialValue: null
                    })(
                      <Select style={{ width: "240px" }}>
                        <Select.Option value={null}>请选择</Select.Option>
                        <Select.Option value={1}>接口调用</Select.Option>
                        <Select.Option value={2}>后台提交</Select.Option>
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


