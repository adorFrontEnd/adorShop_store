import React, { Component } from "react";
import { Table, Form, Input, Spin, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { requestRefund, refund } from '../../api/transaction/refund';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { parseUrl } from '../../utils/urlUtils';
import CommonPage from '../../components/common-page';
import dateUtil from '../../utils/dateUtil';

import './detail.less';
import { relative } from "path";
import toast from "../../utils/toast";


class Page extends Component {

  state = {
    orderDetail: {},
    showLoading: false
  }

  componentDidMount() {
    this.pageInit(this.props.location.search);
  }

  pageInit = (search) => {
    let urlParams = parseUrl(search);
    let id = null;
    if (urlParams && urlParams.args) {
      let { id } = urlParams.args;
      if (id) {

        this.setState({
          id
        })
        this.props.changeRoute({ path: 'transaction.orderDetail', title: "订单详情", parentTitle: '交易' });
      }
      this.getPageData(id);
    }
  }

  getPageData = (orderId) => {

    this.setState({
      showLoading: true
    })
    requestRefund({ orderId })
      .then(orderDetail => {
        let { requestedRefundAmount, payAmount, ...res } = orderDetail;
        let shouldRefundAmount = requestedRefundAmount ? payAmount - requestedRefundAmount : payAmount;
        orderDetail = { requestedRefundAmount, payAmount, shouldRefundAmount, ...res }
        this.setState({
          orderDetail,
          showLoading: false
        })
      })
      .catch(() => {
        this.setState({
          showLoading: false
        })
      })
  }

  refundChangesSort = (arr) => {
    if (!arr || !arr.length) {
      return arr
    }
    let result = arr.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    return result;
  }

  goBack = () => {
    this.props.changeRoute({ path: 'transaction.refundSearch', title: "退款查询", parentTitle: '交易' });
    window.history.back();
  }

  // 申请退款
  refundReqClicked = () => {
    let params = {
      orderId: this.state.id,
      payAmount: this.state.refundPayAmount,
      refundDesc: this.state.refundDesc
    }
    refund(params)
      .then(() => {
        toast("提交完成！");
      })
  }



  refundAmountOnChange = (refundPayAmount) => {
    this.setState({
      refundPayAmount
    })
  }

  refundRemarkOnChange = (e) => {
    let refundDesc = e.currentTarget.value;
    this.setState({
      refundDesc
    })
  }

  render() {

    const { orderDetail } = this.state;
    return (

      <CommonPage title={<div className='line-height40'><span className='margin-right20 font-20 font-bold'>申请退款</span><span className='font-16'>{orderDetail.companyName}</span></div>}>
        <Spin spinning={this.state.showLoading}>
          <div className='padding line-height40 margin-bottom'>
            <div className='line-height40 title-color padding-left'>交易及退款信息</div>
            <div style={{ border: '1px solid #f0f0f0' }}
              className='main-row flex'>
              <div style={{ width: 180 }}>
                <div className='padding-left'>支付流水号：</div>
                <div className='padding-left'>退款应用：</div>
                <div className='padding-left'>商家订单号：</div>
                <div className='padding-left'>订单金额（元）：</div>
                <div className='padding-left'>已申请退款金额（元）：</div>
                <div className='padding-left'>退款方式</div>
              </div>
              <div style={{ minWidth: 400, flex: "1 0 auto" }}>
                <div className='padding-left'>{orderDetail.payRecord || '--'}</div>
                <div className='padding-left'>{orderDetail.appName || '--'}</div>
                <div className='padding-left'>{orderDetail.companyOrderNo || '--'}</div>
                <div className='padding-left'>{orderDetail.payAmount}</div>
                <div className='padding-left'>{orderDetail.requestedRefundAmount}</div>
                <div className='padding-left'>{orderDetail.refundMethod || "--"}</div>
              </div>
            </div>
          </div>

          {
            orderDetail.shouldRefundAmount && orderDetail.shouldRefundAmount > 0 ?
              <div className='padding line-height40'>
                <div className='line-height40 title-color padding-left'>退款信息</div>
                <div style={{ border: '1px solid #f0f0f0' }} className='main-row margin-bottom20 flex'>
                  <div style={{ width: 180 }}>
                    <div className='padding-left'>退款金额：</div>
                    <div className='padding-left'>退款原因：</div>
                  </div>

                  <div style={{ minWidth: 400, flex: "1 0 auto" }}>
                    <div className='padding-left'>
                      <InputNumber
                        value={this.state.refundPayAmount}
                        onChange={this.refundAmountOnChange}
                        style={{ width: 200, marginRight: "10px" }}
                        precision={2} min={0}
                      />
                      元（最多{orderDetail.shouldRefundAmount}元）
              </div>
                    <div className='padding-left'>
                      <Input.TextArea
                        value={this.state.refundDesc}
                        onChange={this.refundRemarkOnChange}
                        style={{ width: 400, minHeight: "140px" }} />
                    </div>
                  </div>
                </div>
              </div>
              : null

          }


          {/* <div className='padding line-height40'>
          <div className='line-height40 title-color padding-left'> 分账信息（请先填写完退款信息再填写）</div>
          <div style={{ border: '1px solid #f0f0f0' }} className='main-row margin-bottom20 flex'>
            <div style={{ width: 180 }}>
              <div className='padding-left'>分账总额:</div>
              <div className='padding-left'>闲租手平台:</div>
            </div>

            <div style={{ minWidth: 400, flex: "1 0 auto" }}>
              <div className='padding-left'>
                <InputNumber
                  value={this.state.refundAmount1}
                  onChange={this.refundAmountOnChange}
                  style={{ width: 200, marginRight: "10px" }}
                  precision={2} min={0}
                />
                元（最多100.00元）
              </div>
              <div className='padding-left'>
                <InputNumber
                  value={this.state.refundAmount2}
                  onChange={this.refundAmountOnChange}
                  style={{ width: 200, marginRight: "10px" }}
                  precision={2} min={0}
                />
                元（最多100.00元）
              </div>
            </div>
          </div>
        </div> */}
        </Spin>
        <div>
          <Button className='margin-left' style={{ width: 100 }} onClick={this.goBack}>返回</Button>
          {
            orderDetail.shouldRefundAmount && orderDetail.shouldRefundAmount > 0 ?
              <Button disabled={!Object.keys(orderDetail).length} type='primary' className='margin-left20' style={{ width: 100 }} onClick={this.refundReqClicked}>提交申请</Button>
              : null
          }
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Page);
