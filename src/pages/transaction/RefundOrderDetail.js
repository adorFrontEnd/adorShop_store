import React, { Component } from "react";
import { Table, Form, Input, Select, Spin, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { getRefundDetail } from '../../api/transaction/refund';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { parseUrl } from '../../utils/urlUtils';
import CommonPage from '../../components/common-page';
import dateUtil from '../../utils/dateUtil';

import './detail.less';
import { relative } from "path";


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
        this.props.changeRoute({ path: 'transaction.refundOrderDetail', title: "退款详情", parentTitle: '交易' });
      }
      this.getPageData(id);
    }
  }

  getPageData = (id) => {
    this.setState({
      showLoading: true
    })
    getRefundDetail({ id })
      .then(orderDetail => {
        let { refundChanges, ...res } = orderDetail;
        refundChanges = this.refundChangesSort(refundChanges);
        this.setState({
          orderDetail: { ...res, refundChanges },
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

  render() {

    const { orderDetail } = this.state;
    return (

      <CommonPage title={<div className='line-height40'><span className='margin-right20 font-20 font-bold'>退款详情</span><span className='font-16'>{orderDetail.companyName}</span></div>}>
        <Spin spinning={this.state.showLoading}>
          <div className='padding line-height40'>
            <Row style={{ borderTop: '1px solid #f0f0f0' }} className='main-row margin-bottom20'>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>退款单号</div>
                <div className='border-bottom title-color padding-left'>支付流水单号</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.refundOrderNo || '--'}</div>
                <div className='border-bottom padding-left'>{orderDetail.payRecord || '--'}</div>
              </Col>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>商家退款单号</div>
                <div className='border-bottom title-color padding-left'>商家订单号</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.refundCompanyOrderNo || '--'}</div>
                <div className='border-bottom padding-left'>{orderDetail.companyOrderNo || '--'}</div>
              </Col>
            </Row>

            <Row style={{ borderTop: '1px solid #f0f0f0' }} className='main-row margin-bottom20'>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>订单金额（元）</div>
                <div className='border-bottom title-color padding-left'>应结订单金额（元）</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.payAmount || 0}</div>
                <div className='border-bottom padding-left'>{orderDetail.settlementAmount || 0}</div>
              </Col>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>申请退款金额（元）</div>
                <div className='border-bottom title-color padding-left'>退款金额（元）</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.requestRefundAmount || 0}</div>
                <div className='border-bottom padding-left'>
                  {orderDetail.refundAmount || 0}{orderDetail.payAmount == orderDetail.refundAmount ? '（全额退款）' : ''}
                </div>
              </Col>
            </Row>


            <Row style={{ borderTop: '1px solid #f0f0f0' }} className='main-row margin-bottom20'>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>用户支付方式</div>
                <div className='border-bottom title-color padding-left'>收款账户</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.meansOfTransactionStr || '--'}</div>
                <div className='border-bottom padding-left'>{'--'}</div>
              </Col>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>退款方式</div>
                <div className='border-bottom title-color padding-left'>退款资金来源</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.refundMethod || '--'}</div>
                <div className='border-bottom padding-left'>{orderDetail.refundSource || '--'}</div>
              </Col>
            </Row>

            <Row style={{ borderTop: '1px solid #f0f0f0' }} className='main-row margin-bottom20'>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>发起方式</div>
                <div className='border-bottom title-color padding-left'>退款状态</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.transferStr || '--'}</div>
                <div className='border-bottom padding-left'>{orderDetail.refundStatusStr || '--'}</div>
              </Col>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>提交时间</div>
                <div className='border-bottom title-color padding-left'>退款完成时间</div>
              </Col>
              <Col span={8}>
                <div className='border-bottom padding-left'>{orderDetail.createTime ? dateUtil.getDateTime(orderDetail.createTime) : "--"}</div>
                <div className='border-bottom padding-left'>{orderDetail.finishTime ? dateUtil.getDateTime(orderDetail.finishTime) : "--"}</div>
              </Col>
              <Col span={4}>
                <div className='border-bottom title-color padding-left'>退款说明</div>
              </Col>
              <Col span={20}>
                <div className='border-bottom padding-left'>{orderDetail.refundDesc || '--'}</div>
              </Col>
            </Row>

            <div className='border-bottom title-color padding-left'>
              退款变更记录
          </div>
            <div className='margin-top'>
              {
                orderDetail.refundChanges && orderDetail.refundChanges.length ?
                  orderDetail.refundChanges.map((item, index) =>
                    <div key={item.time} className='flex align-center' style={{ height: 40 }}>
                      {
                        index == 0 && orderDetail.refundChanges.length > 1 ?
                          <div style={{ width: 20, height: "100%", backgroundColor: "#F2F2F2", borderRadius: "50% 50% 0 0" }}></div>
                          : null
                      }
                      {
                        (index == orderDetail.refundChanges.length - 1) && (orderDetail.refundChanges.length > 1) ?
                          <div style={{ width: 20, height: "100%", backgroundColor: "#F2F2F2", borderRadius: "0 0 50% 50%" }}></div>
                          : null
                      }
                      {
                        index == 0 && orderDetail.refundChanges.length == 1 ?
                          <div style={{ width: 20, height: "100%", backgroundColor: "#F2F2F2", borderRadius: "50% 50% 50% 50%" }}></div>
                          : null
                      }
                      {
                        index != 0 && index < orderDetail.refundChanges.length - 1 && orderDetail.refundChanges.length > 2 ?
                          <div style={{ width: 20, height: "100%", backgroundColor: "#F2F2F2" }}></div>
                          : null
                      }
                      <div style={{ width: 20, height: 20, backgroundColor: "#498CFF", borderRadius: "100%", position: "relative", left: "-20px" }}></div>
                      <div className='margin0-20'>{item.time ? dateUtil.getDateTime(item.time) : "--"}</div>
                      <div className='margin-right20' style={{ minWidth: 100 }}>{item.status}</div>
                      <div className='margin-right'>{item.detail}</div>
                    </div>
                  )
                  :
                  null
              }
            </div>

          </div>
        </Spin>
        <div>
          <Button type='primary' className='margin-left' style={{ width: 100 }} onClick={this.goBack}>返回</Button>
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
