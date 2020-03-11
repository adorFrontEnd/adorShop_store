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
import UserSelectModal from '../../components/order/UserSelectModal';
import SalerSelectModal from '../../components/order/SalerSelectModal';
import SKUSelectModal from '../../components/order/SKUSelectModal';

const _title = "智能下单";
const _description = '';

class Page extends Component {

  state = {
    userModalIsVisible: false,
    salerModalIsVisible: false,
    skuModalIsVisible: false,
    selectUser: null,
    selectSaler: null,
    selectSKU: null
  }

  componentDidMount() {

  }


  // 表格相关列
  columns = [
    { title: "类型", dataIndex: "customerName", render: data => data || "--" },
    { title: "商品编码", dataIndex: "customerName", render: data => data || "--" },
    { title: "商品名称", dataIndex: "customerName", render: data => data || "--" },
    { title: "商品规格", dataIndex: "customerName", render: data => data || "--" },
    { title: "单位", dataIndex: "customerName", render: data => data || "--" },
    { title: "单价（元）", dataIndex: "customerName", render: data => data || "--" },
    { title: "数量", dataIndex: "customerName", render: data => data || "--" },
    { title: "外部订单", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "相关活动", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "优惠价格（元）", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "小计（元）", dataIndex: "gradeName", render: data => data || "--" },
    { title: "状态", dataIndex: "gradeName", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => this.renderAction(text, record, index)
    }
  ]


  selectUserClicked = (selectUser) => {
    this.setState({
      selectUser
    })
    this._hideUserModal();
  }

  selectSalerClicked = (selectSaler) => {
    this.setState({
      selectSaler
    })
    this._hideSalerModal();
  }

  selectSKUClicked = (selectSKU) => {
    this.setState({
      selectSKU
    })
    this._hideSKUModal();
  }


  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectUser, selectSaler, selectSKU } = this.state;
    let selectUserId = (selectUser && selectUser.id) ? selectUser.id : null;
    let selectSalerId = (selectSaler && selectSaler.id) ? selectSaler.id : null;
    let selectSKUId = (selectSKU && selectSKU.id) ? selectSKU.id : null;

    return (
      <CommonPage title={_title} description={_description} >
        <div>
          <div>
            <Input.TextArea style={{ minHeight: 120, width: 700 }}></Input.TextArea>
          </div>

          <div className='margin-top'><Button type='primary'>智能识别</Button></div>

          <div className='margin-top20'>
            <div className='line-height40 font-18 color333 font-bold'>基本信息</div>
            <div className='line-height40'>
              {
                selectUser ?
                  <span>
                    <span>
                      {selectUser.name}
                    </span>
                    <span className='margin0-10'>{selectUser.phone}</span>
                  </span>
                  : null
              }
              <a onClick={this._showUserModal}>选择会员</a>
              <span className='margin0-10'>--</span>
              {
                selectSaler ?
                  <span>
                    <span>
                      {selectSaler.name}
                    </span>
                    <span className='margin0-10'>{selectSaler.phone}</span>
                  </span>
                  : null
              }
              <a onClick={this._showSalerModal}>选择业务员（可为空）</a></div>
          </div>
          <div>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单号</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>收货人</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>下单时间</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>联系电话</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单状态</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>省市区</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单总金额</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>运费</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>商品总金额</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>累计优惠</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>支付方式</Col>
              <Col span={8} ></Col>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>买家备注</Col>
              <Col span={8}></Col>
            </Row>
            <Row className='line-height30' style={{ borderTop: '1px solid #f2f2f2', borderBottom: '1px solid #f2f2f2' }}>
              <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>发货仓库</Col>
              <Col span={20} ></Col>
            </Row>


          </div>
          <div className='margin-top20'>
            <div className='line-height40 font-18 color333 font-bold'>商品信息</div>
            <div>
              <Table
                indentSize={10}
                rowKey="id"
                columns={this.columns}
                loading={this.state.tableLoading}
                pagination={false}
                dataSource={this.state.tableDataList}
              />
            </div>
            <div><Button onClick={this._showSKUModal} type='primary' className='normal margin-top'>添加</Button></div>
          </div>
          <div className='margin-top20'>
            <div className='line-height40 font-18 color333 font-bold'>优惠券信息</div>
            <div>--</div>
          </div>
          <div className='margin-top20'>
            <div className='line-height40 font-18 color333 font-bold'>包裹信息</div>
            <div>发货后生成包裹信息</div>
          </div>
        </div>




        <UserSelectModal
          visible={this.state.userModalIsVisible}
          onCancel={this._hideUserModal}
          selectItem={this.selectUserClicked}
          selectId={selectUserId}
        />

        <SalerSelectModal
          visible={this.state.salerModalIsVisible}
          onCancel={this._hideSalerModal}
          selectItem={this.selectSalerClicked}
          selectId={selectSalerId}
        />

        <SKUSelectModal
          visible={this.state.skuModalIsVisible}
          onCancel={this._hideSKUModal}
          selectItem={this.selectSKUClicked}
          selectId={selectSKUId}
        />
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