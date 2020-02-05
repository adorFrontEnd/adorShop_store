import React, { Component } from "react";
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { getOrderDetail } from '../../api/transaction/transaction';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { parseUrl } from '../../utils/urlUtils';
import CommonPage from '../../components/common-page';
import dateUtil from '../../utils/dateUtil';

import './detail.less';

const refundRequestPath = routerConfig["transaction.refundRequest"].path;

class Page extends Component {

  state = {
    orderDetail: {}
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

  getPageData = (id) => {
    getOrderDetail({ id })
      .then(orderDetail => {
        let { refundChanges, ...res } = orderDetail;
        refundChanges = this.refundChangesSort(refundChanges);
        this.setState({
          orderDetail: { ...res, refundChanges }
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


  //确认分账
  accountingClicked = () => {

  }

  render() {

    const { orderDetail } = this.state;
    return (

      <CommonPage title={<div className='line-height40'><span className='margin-right20 font-20 font-bold'>订单详情</span><span className='font-16'>{orderDetail.companyName}</span></div>}>
        <div className='padding line-height40'>
          <div className='line-height40 font-16 font-bold'>基础信息</div>
          <div style={{ borderTop: '1px solid #f0f0f0' }} className='main-row margin-bottom20 flex'>
            <div style={{ width: 140 }}>
              <div className='border-bottom title-color padding-left'>商家订单号</div>
              <div className='border-bottom title-color padding-left'>支付流水单号</div>
              <div className='border-bottom title-color padding-left'>所属应用</div>
              <div className='border-bottom title-color padding-left'>交易时间</div>
              <div className='border-bottom title-color padding-left'>更新时间</div>
              <div className='border-bottom title-color padding-left'>支付时间</div>
              <div className='border-bottom title-color padding-left'>支付场景</div>
              <div className='border-bottom title-color padding-left'>交易状态</div>
              <div className='border-bottom title-color padding-left'>交易方式</div>
              <div className='border-bottom title-color padding-left'>订单金额（元）</div>
              <div className='border-bottom title-color padding-left'>应结金额（元）</div>
              <div className='border-bottom title-color padding-left'>结算状态</div>
              <div className='border-bottom title-color padding-left'>应用返回</div>
            </div>
            <div style={{ minWidth: 400 }}>
              <div className='border-bottom padding-left'>{orderDetail.companyOrderNo || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.payRecord || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.appName || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.createTime ? dateUtil.getDateTime(orderDetail.createTime) : "--"}</div>
              <div className='border-bottom padding-left'>{orderDetail.updateTime ? dateUtil.getDateTime(orderDetail.updateTime) : "--"}</div>
              <div className='border-bottom padding-left'>{orderDetail.finishTime ? dateUtil.getDateTime(orderDetail.finishTime) : "--"}</div>
              <div className='border-bottom padding-left'>{orderDetail.payScenesStr || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.tradingStatusStr || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.meansOfTransactionStr || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.payAmount || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.settlementAmount || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.settlementStatusStr || '--'}</div>
              <div className='border-bottom padding-left'>{orderDetail.notifyStatusStr || '--'}</div>
            </div>
          </div>

        </div>
        <div>
          <Button className='margin-left' style={{ width: 100 }} onClick={this.goBack}>返回</Button>
          {/* <Button type='primary' className='margin-left20' style={{ width: 100 }} onClick={this.accountingClicked}>确认分账</Button> */}
          <NavLink to={refundRequestPath + `?id=${this.state.id}`}>
            <Button type='primary' className='margin-left20 yellow-btn' style={{ width: 100 }}>申请退款</Button>
          </NavLink>

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
