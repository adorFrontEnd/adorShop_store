import React, { Component } from "react";
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import dateUtil from '../../utils/dateUtil';
import { getOrderByAppId, getOrderByUserId } from '../../api/transaction/transaction';



class Page extends Component {

  state = {
    showTableLoading: false,
    pageDataList: null
  }

  componentDidMount() {
    this.getPageData();
  }

  componentWillReceiveProps(props) {
    if (props.visible && !this.props.visible) {
      this.getPageData();
    }

    if (!props.visible) {
      this.resetClicked();
    }
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    let appId = this.props.appId || null;
    let userId = this.props.userId || null;
    if (!appId && !userId) {
      return;
    }
    this._showTableLoading();
    let fn = appId ? getOrderByAppId : getOrderByUserId;
    fn({ ...this.params, appId, userId }).then(res => {
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
        pagination: _pagination
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
    { title: "日期", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "入账金额", dataIndex: "payAmount" },
    { title: "关联交易订单号", dataIndex: "orderNo" }
  ]

  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { time } = params;
    if (time && time.length) {
      let [startTime, stopTime] = time;
      let startCreatTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endCreatTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        startCreatTimeStamp,
        endCreatTimeStamp,
        time: null
      }
    } else {
      this.params = {
        time: null
      }
    }
    this.params.page = 1;
    this.getPageData();
  }

  resetClicked = () => {
    this.props.form.resetFields();
  }

  render() {

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          width={800}
          maskClosable={false}
          title='查看收支'
          visible={this.props.visible}
          onCancel={this.props.onCancel}
          onOk={this.props.onOk}
        >
          <div>
            <Form layout='inline'>
              <Form.Item>
                <span>余额：{this.props.banlance}元</span>
              </Form.Item>
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
              <Form.Item>
                <Button type='primary margin-left' className='normal' onClick={this.searchClicked}>筛选</Button>
                <Button className='margin-left' onClick={this.resetClicked}>清除所有筛选</Button>
              </Form.Item>
            </Form>
          </div>
          <div>
            <Table
              indentSize={20}
              rowKey="orderNo"
              columns={this.columns}
              loading={this.state.showTableLoading}
              pagination={this.state.pagination}
              dataSource={this.state.pageDataList}
            />
          </div>
        </Modal>
      </div>
    )
  }

}

export default Form.create()(Page)