import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { getDetail, saveOrUpdate, searchWithdrawApplicationList, cancelApplicationReq } from '../../api/accountManage';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';

const RequestEnum = {
  "-1": "申请拒绝",
  "0": "申请中",
  "1": "申请通过",
  "2": "申请撤回",
  "3": "提现中",
  "4": "提现失败"
}

class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    companyList: null,
    cacheCompanyName: '',
    secretKey: "",
    selectAppId: null,
    selectAppBalance: null
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }

  componentWillReceiveProps(props) {
    if (props.update != this.props.update) {
      this.getPageData();
    }
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchWithdrawApplicationList(this.params).then(res => {
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

  cancelClick = (record) => {
    let { id } = record;
    cancelApplicationReq({ id })
      .then(() => {
        Toast('撤销完成！');
        this.getPageData();
      })
  }

  // 表格相关列
  columns = [
    { title: "申请编号", dataIndex: "id" },
    { title: "申请提现金额（元）", dataIndex: "applicationAmount", render: data => data || "--" },
    { title: "实际提现金额（元）", dataIndex: "withdrawalAmount", render: data => data || "--" },
    // { title: "提现银行卡", dataIndex: "bankCard", render: data => data || "--" },
    // { title: "开户行", dataIndex: "bankName", render: data => data || "--" },
    { title: "申请状态", dataIndex: "statusStr", render: data => data || "--" },
    { title: "平台反馈", dataIndex: "feedback", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.status == '0' ?
              <Popconfirm
                placement="topLeft" title='确认要撤销申请吗？'
                onConfirm={() => { this.cancelClick(record) }} >
                <a size="small" className="color-red">撤销申请</a>
              </Popconfirm>
              :
              null
          }
        </span>
      )
    }
  ]

  /**搜索，过滤 *******************************************************************************************************************************/

  searchClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { time, passTime, nameParam } = params;

    if (time && time.length) {
      let [startTime, stopTime] = time;
      let startCreateTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        ...params,
        startCreateTimeStamp,
        endCreateTimeStamp,
        time: null
      }
    } else {
      this.params = {
        ...params,
        startCreateTimeStamp: null,
        endCreateTimeStamp: null,
        time: null
      }
    }

    if (passTime && passTime.length) {
      let [startTime, stopTime] = passTime;
      let startPassTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endPassCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        ...this.params,
        startPassTimeStamp,
        endPassCreateTimeStamp,
        passTime: null
      }
    } else {
      this.params = {
        ...this.params,
        startPassTimeStamp: null,
        endPassCreateTimeStamp: null,
        passTime: null
      }
    }

    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }


  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div className='margin10-0' >
          <Form layout='inline' style={{ minWidth: 1278 }}>
            <Row>
              <Col span={6}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='申请日期'
                  field='time'>
                  {
                    getFieldDecorator('time')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='通过日期'
                  field='passTime'>
                  {
                    getFieldDecorator('passTime')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>
              {/* <Col span={12}>

                <Form.Item
                  style={{ width: "50%" }}
                  field="bankNameParam"
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  label='提现银行卡'
                >
                  {
                    getFieldDecorator('bankNameParam', {
                    })(
                      <Input allowClear placeholder="输入开户行" style={{ width: "100%" }} />
                    )
                  }
                </Form.Item>

                <Form.Item
                  style={{ width: "40%" }}
                  field="bankCardParam"
                  labelCol={{ span: 1 }}
                  wrapperCol={{ span: 23 }}
                >
                  {
                    getFieldDecorator('bankCardParam', {
                    })(
                      <Input allowClear placeholder="输入提现银行卡号" style={{ width: "100%" }} />
                    )
                  }
                </Form.Item>
              </Col> */}
            </Row>
          </Form>
        </div>
        <div className='padding10-0'>
          <Button className='normal' type='primary' onClick={this.searchClicked}>筛选</Button>
          <Button className='margin-left' onClick={this.resetClicked}>清除所有筛选</Button>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />
      </div>


    )
  }
}

export default Form.create()(Page);


