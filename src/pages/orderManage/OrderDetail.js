import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Spin, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import { smartOrder, getOrderDetail, addOrderLog } from '../../api/order/order';
import NumberFilter from '../../utils/filter/number';
import { getOrderSaveData } from './orderUtils';
import { OrderStatusEnum, OrderOperTypeEnum } from '../../enum/orderEnum';

const _title = "订单详情";
const _description = '';

class Page extends Component {

  state = {
    showLoading: false,
    orderDetail: null,

    orderLogList: [],
    orderSKUList: [],
    orderInfo: null,
    remark: null
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    this.setState({
      id
    })
    this.getDetail(id);
  }


  getDetail = (id) => {
    this._showPageLoading();
    getOrderDetail({ id })
      .then((orderDetail) => {

        this._hidePageLoading();
        if (!orderDetail || !orderDetail.list || !orderDetail.order) {
          return;
        }
        let { list, order, logList } = orderDetail;
        let orderInfo = order;
        let orderLogList = logList;
        let productTotalAmount = 0;
        let orderSKUList = list.map(item => {
          productTotalAmount += item.totalPrice;
          return { ...item, _id: Date.now() + Math.random() * 100000 }
        });
        let orderTotalAmount = productTotalAmount + orderInfo.freightPrice;
        let orderStatus = order.status || order.status == 0 ? order.status : null;
        let orderStatusStr = orderStatus || order.status == 0 ? OrderStatusEnum[orderStatus] : null;

        this.setState({
          orderDetail,
          orderSKUList,
          orderLogList,
          orderInfo,
          orderStatus,
          orderStatusStr,
          productTotalAmount,
          orderTotalAmount
        })
      })
      .catch(() => {
        this._hidePageLoading();
      })
  }
  /*基本信息****************************************************************************************************************/

  _showPageLoading = () => {
    this.setState({
      showLoading: true
    })
  }

  _hidePageLoading = () => {
    this.setState({
      showLoading: false
    })
  }

  /*修改商品****************************************************************************************************************/

  // 表格相关列
  columns = [
    { title: "类型", align: "center", dataIndex: "productType", render: data => "商品" },
    { title: "商品编码", align: "center", dataIndex: "productNumber", render: data => data || "--" },
    { title: "商品名称", align: "center", dataIndex: "productName", render: data => data || "--" },
    { title: "商品规格", align: "center", dataIndex: "specValue", render: data => data || "--" },
    { title: "单位", align: "center", dataIndex: "baseUnit", render: data => data || "--" },
    { title: "单价（元）", align: "center", dataIndex: "unitPrice", render: data => data ? NumberFilter(data) : "--" },
    { title: "数量", align: "center", dataIndex: "buyQty", render: data => data || "--" },
    { title: "外部订单", align: "center", dataIndex: "text1", render: data => data || "--" },
    { title: "相关活动", align: "center", dataIndex: "text2", render: data => data || "--" },
    { title: "优惠价格（元）", align: "center", dataIndex: "text3", render: data => data || "--" },
    { title: "小计（元）", align: "center", dataIndex: "totalPrice", render: data => data ? NumberFilter(data) : "--" },
    { title: "状态", align: "center", dataIndex: "status", render: data => this.state.orderStatusStr || "--" },
    {
      title: '操作', align: "center",
      render: (text, record, index) => '--'
    }
  ]


  /*备注*********************************************************************************************************************************/
  // 表格相关列
  remarkColumns = [
    { title: "操作时间", width: 160, dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "操作类型", width: 140, dataIndex: "operationType", render: data => data || data == 0 ? OrderOperTypeEnum[data] : '--' },
    { title: "相关信息", dataIndex: "content", render: data => data || "--" }
  ]


  onRemarkChange = (remark) => {

    this.setState({
      remark
    })
  }

  addLogClick = () => {
    let { remark, orderInfo } = this.state;
    let { orderNo, id } = orderInfo;

    let params = {
      orderId: id,
      orderNo,
      content: remark
    }
    addOrderLog(params)
      .then(() => {
        Toast("添加成功！");
        this.setState({
          remark: null
        })
        this.getDetail(id);
      })

  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orderInfo, orderStatusStr, productTotalAmount, orderTotalAmount } = this.state;

    return (
      <CommonPage title={_title} description={_description} >
        <Spin spinning={this.state.showLoading}>
          <div>
            {
              orderInfo ?
                <div>
                  <div className='line-height40 font-18 color333 font-bold'>基本信息</div>
                  <div className='line-height40'>
                    <span className='margin-right20'>
                      <span className='font-bold'>用户：</span>{orderInfo.userCustomerName ? orderInfo.userCustomerName : "--"}
                      <span className='margin-left'>{orderInfo.userContactPhone || ''}</span>
                    </span>
                    <span className='margin-right20'>
                      <span className='font-bold'>业务员：</span>
                      {orderInfo.salesman ? orderInfo.salesman : "--"}</span>
                    <span className='margin-right20'>
                      <span className='font-bold'>审单员：</span>
                      {orderInfo.examinerName ? orderInfo.examinerName : "--"}</span>
                  </div>
                  <div className='line-height40' style={{ minWidth: 940 }}>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单号</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.orderNo || '--'}
                      </Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>收货人</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.contactPerson || '--'}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>下单时间</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.gmtCreate ? dateUtil.getDateTime(orderInfo.gmtCreate) : "--"}
                      </Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>联系电话</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.contactPhone || '--'}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单状态</Col>
                      <Col span={8} className='padding-left' >
                        {orderStatusStr || '--'}
                      </Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>省市区</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.contactProvince + "-" + orderInfo.contactCity + "-" + orderInfo.contactArea}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>支付状态</Col>
                      <Col span={8} className='padding-left' ></Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>详细地址</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.contactAddress || '--'}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单总金额</Col>
                      <Col span={8} className='padding-left'>
                        ￥{NumberFilter(orderTotalAmount)}
                      </Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>运费</Col>
                      <Col span={8} className='padding-left'>
                        ￥{NumberFilter(orderInfo.freightPrice)}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>商品总金额</Col>
                      <Col span={8} className='padding-left'> ￥{NumberFilter(productTotalAmount)}</Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>累计优惠</Col>
                      <Col span={8} className='padding-left'>--</Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>支付方式</Col>
                      <Col span={8} className='padding-left'></Col>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>买家备注</Col>
                      <Col span={8} className='padding-left'>
                        {orderInfo.buyerRemark || '--'}
                      </Col>
                    </Row>
                    <Row style={{ borderTop: '1px solid #f2f2f2', borderBottom: '1px solid #f2f2f2' }}>
                      <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>发货仓库</Col>
                      <Col span={20} className='padding-left'>
                        {orderInfo.storageName || '--'}
                      </Col>
                    </Row>
                  </div>
                </div>
                :
                null
            }


            <div className='margin-top20'>
              <div className='line-height40 font-18 color333 font-bold'>商品信息</div>
              <div>
                <Table
                  indentSize={10}
                  rowKey="_id"
                  bordered={true}
                  columns={this.columns}
                  loading={this.state.tableLoading}
                  pagination={false}
                  dataSource={this.state.orderSKUList}
                />
              </div>
            </div>

            <div className='margin-top20'>
              <div className='line-height40 font-18 color333 font-bold'>优惠券信息</div>
              <div>--</div>
            </div>
            <div className='margin-top20'>
              <div className='line-height40 font-18 color333 font-bold'>包裹信息</div>
              <div>发货后生成包裹信息</div>
            </div>
            <div className='margin-top20 flex-middle'>
              <div className='line-height40 font-18 color333 font-bold'>操作日志</div>
              {/* <Select style={{ width: 100, marginLeft: 10 }}>
                <Select.Option value={1}>备注</Select.Option>
                <Select.Option value={2}>备注</Select.Option>
              </Select> */}
              <span className='margin-left'>备注：</span>
              <Input className='margin-left' value={this.state.remark}
                onChange={(e) => this.onRemarkChange(e.target.value)} style={{ width: 200 }} />
              <Button onClick={this.addLogClick} className='margin-left' type='primary'>添加日志</Button>
            </div>
          </div>
          <div className='margin-top'>
            <Table
              style={{ width: 800 }}
              indentSize={10}
              rowKey="id"
              columns={this.remarkColumns}
              loading={this.state.tableLoading}
              pagination={false}
              dataSource={this.state.orderLogList}
            />
          </div>
        </Spin>
      </CommonPage >
    )
  }



  _showUserModal = () => {
    this.setState({
      userModalIsVisible: true
    })
  }

  _hideUserModal = () => {
    this.setState({
      userModalIsVisible: false
    })
  }


  _showSalerModal = () => {
    this.setState({
      salerModalIsVisible: true
    })
  }

  _hideSalerModal = () => {
    this.setState({
      salerModalIsVisible: false
    })
  }

  _showSKUModal = () => {
    this.setState({
      skuModalIsVisible: true
    })
  }

  _hideSKUModal = () => {
    this.setState({
      skuModalIsVisible: false
    })
  }


}
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));