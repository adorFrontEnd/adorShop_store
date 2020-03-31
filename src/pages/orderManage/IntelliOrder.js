import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Spin, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { smartOrder, parseSmartOrderText } from '../../api/order/order';
import NumberFilter from '../../utils/filter/number';
import { getOrderSaveData, parseSmartOrderResult } from './orderUtils';
import { getSelectList } from '../../api/storeManage/storeManage';
import { getSpecValue } from '../../utils/productUtils';

import UserSelectModal from '../../components/order/UserSelectModal';
import SalerSelectModal from '../../components/order/SalerSelectModal';
import SKUSelectModal from '../../components/order/SKUSelectModal';
import SingleDistrictSelect from '../../components/areaSelect/SingleDistrictSelect';

const _title = "智能下单";
const _description = '';

class Page extends Component {

  state = {
    showLoading: false,
    userModalIsVisible: false,
    salerModalIsVisible: false,
    skuModalIsVisible: false,
    areaModalIsVisible: false,
    demoModalIsVisible: false,
    selectUser: null,
    selectSaler: null,
    storageList: [],
    orderRemarkList: [],
    orderSKUList: [],
    orderSKUIds: [],
    orderBaseInfo: {},
    selectAreaData: null,
    remark: null,
    storageId: null,
    selectIndex: null,
    intelliOrderText: null,
    parseLoading: false
  }

  componentDidMount() {
    this.getStoreSelectList();
  }

  /**x下单 */
  saveDataClicked = () => {
    let { orderBaseInfo, orderSKUList, storageId, selectAreaData, remark, selectUser, selectSaler, intelliOrderText } = this.state;
    let params = getOrderSaveData({ orderBaseInfo, storageId, orderSKUList, selectAreaData, remark, selectSaler, selectUser });

    if (!params) {
      return;
    }

    this._showPageLoading();
    smartOrder(params)
      .then(() => {
        Toast('下单成功！');
        this.resetPageData();
        this._hidePageLoading();
      })
      .catch(() => {
        this._hidePageLoading();
      })
  }

  resetPageData = () => {

    this.setState({
      orderSKUList: [],
      orderSKUIds: [],
      orderBaseInfo: {},
      selectAreaData: null,
      remark: null,
      storageId: 1,
      selectIndex: null
    })
  }
  /*基本信息****************************************************************************************************************/

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

  onOrderInfoChange = (key, e) => {

    let { orderBaseInfo } = this.state;
    orderBaseInfo[key] = e;
    this.setState({
      orderBaseInfo
    })
  }

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

  //仓库
  getStoreSelectList = () => {
    getSelectList()
      .then(storageList => {
        this.setState({
          storageList
        })
      })
  }

  onStorageChange = (storageId) => {
    this.setState({
      storageId
    })
  }
  /*修改商品****************************************************************************************************************/

  // 表格相关列
  columns = [
    { title: "类型", align: "center", dataIndex: "productType", render: data => "商品" },
    { title: "商品编码", align: "center", dataIndex: "number", render: data => data || "--" },
    { title: "商品名称", align: "center", dataIndex: "name", render: data => data || "--" },
    { title: "商品规格", align: "center", dataIndex: "specValue", render: data => getSpecValue(data) || '--' },
    { title: "单位", align: "center", dataIndex: "baseUnit", render: data => data || "--" },
    { title: "单价（元）", align: "center", dataIndex: "unitPrice", render: (text, record, index) => <InputNumber value={text} onChange={(e) => this.onOrderProductChange('unitPrice', index, e)} precision={2} min={0} /> },
    { title: "数量", align: "center", dataIndex: "buyQty", render: (text, record, index) => <InputNumber value={text} onChange={(e) => this.onOrderProductChange('buyQty', index, e)} precision={0} min={0} /> },
    { title: "外部订单", align: "center", dataIndex: "text1", render: data => data || "--" },
    { title: "相关活动", align: "center", dataIndex: "text2", render: data => data || "--" },
    { title: "优惠价格（元）", align: "center", dataIndex: "text3", render: data => data || "--" },
    { title: "小计（元）", align: "center", dataIndex: "total", render: data => (data || data == 0) ? NumberFilter(data) : "--" },
    { title: "状态", align: "center", dataIndex: "status", render: data => data || "--" },
    {
      title: '操作', align: "center",
      render: (text, record, index) => (
        <span>
          <a onClick={() => this.editProduct(record, index)}>预测商品</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteTableItem(index) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  deleteTableItem = (index) => {
    let { orderSKUList, orderSKUIds } = this.state;
    orderSKUList.splice(index, 1);
    orderSKUIds.splice(index, 1);
    this.setState({
      orderSKUList,
      orderSKUIds
    })
  }

  // 修改商品表格
  onOrderProductChange = (action, index, e) => {

    let { orderSKUList } = this.state;
    switch (action) {
      case "unitPrice":
      case "buyQty":
        orderSKUList[index][action] = e;
        let { unitPrice, buyQty } = orderSKUList[index];
        orderSKUList[index]['total'] = parseInt(unitPrice * 100) * buyQty * 0.01;
        break;
    }

    this.setState({
      orderSKUList
    })
  }

  addProduct = () => {
    let selectIndex = null;
    this.setState({
      selectIndex
    })
    this._showSKUModal();
  }

  editProduct = (record, index) => {
    let selectIndex = index;
    this.setState({
      selectIndex
    })
    this._showSKUModal();
  }

  selectSKUClicked = (selectSKU) => {

    if (!selectSKU) {
      return;
    }

    let { skuData, id } = selectSKU;
    let { orderSKUList, selectIndex } = this.state;
    let item = {
      sellPrdSkuId: id,
      unitPrice: 0,
      buyQty: 1,
      total: 0,
      _id: Date.now(),
      ...skuData
    }
    if (selectIndex || selectIndex == 0) {
      let oldItem = orderSKUList[selectIndex];
      orderSKUList[selectIndex] = {
        ...oldItem,
        ...skuData
      };
    } else {
      orderSKUList.push(item);
    }

    let orderSKUIds = orderSKUList.map(item => item.sellPrdSkuId);

    this.setState({
      orderSKUList,
      orderSKUIds
    })
    this._hideSKUModal();
  }
  /*备注*********************************************************************************************************************************/
  // 表格相关列
  remarkColumns = [
    { title: "操作时间", width: 140, dataIndex: "time", render: data => data || "--" },
    { title: "操作类型", width: 140, dataIndex: "type", render: data => data || "--" },
    { title: "相关信息", dataIndex: "info", render: data => data || "--" }
  ]

  /**选择地区 ***************************************************************************************************************************/
  showAreaSelectModal = () => {
    this.setState({
      areaModalIsVisible: true
    })
  }

  _hideAreaSelectModal = () => {
    this.setState({
      areaModalIsVisible: false
    })
  }

  selectArea = () => {
    this.showAreaSelectModal()
  }

  selectAreaSaveClicked = (selectAreaData) => {
    if (!selectAreaData || !selectAreaData.districtId) {
      return;
    }

    this.setState({
      selectAreaData
    })
    this._hideAreaSelectModal()
  }

  onRemarkChange = (remark) => {
    this.setState({
      remark
    })
  }
  intelliOrderTextChange = (e) => {

    let intelliOrderText = e.target.value;

    this.setState({
      intelliOrderText
    })
  }

  intelliOrderTextClick = () => {
    let { intelliOrderText } = this.state;
    if (!intelliOrderText || !intelliOrderText.trim()) {
      Toast('请输入需要识别的订单描述文档！');
      return;
    }

    this.setState({
      parseLoading: true
    })
    parseSmartOrderText({ text: intelliOrderText })
      .then((data) => {
        this.setState({
          parseLoading: false
        })
        let result = parseSmartOrderResult(data);
        let { contactAddress, contactCity, contactPerson, contactPhone, contactProvince, productIds, quantity, specNames } = result;
        let { orderBaseInfo } = this.state;
        orderBaseInfo = {
          ...orderBaseInfo,
          contactAddress,
          contactPerson,
          contactPhone
        }
        this.setState({
          orderBaseInfo
        })
      })
      .catch(()=>{
        this.setState({
          parseLoading: false
        })
      })
  }

  showDemoModal = () => {
    this.setState({
      demoModalIsVisible: true
    })
  }

  hideDemoModal = () => {
    this.setState({
      demoModalIsVisible: false
    })
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectUser, selectSaler, selectSKU, selectAreaData, orderBaseInfo, storageList } = this.state;
    let selectUserId = (selectUser && selectUser.id) ? selectUser.id : null;
    let selectSalerId = (selectSaler && selectSaler.id) ? selectSaler.id : null;

    return (
      <CommonPage path='orderManage.order.intelliOrder' title={_title} description={_description} >
        <Spin spinning={this.state.showLoading}>
          <div>
            <div style={{ position: "fixed", bottom: "10%", right: "5%", zIndex: "999" }}>
              <Button type='primary' shape="circle" style={{ width: 80, height: 80 }} onClick={this.saveDataClicked}>
                确认<br />
              收款
            </Button>
            </div>
            <Spin spinning={this.state.parseLoading}>
              <div>
                <Input.TextArea
                  value={this.state.intelliOrderText}
                  onChange={this.intelliOrderTextChange}
                  style={{ minHeight: 120, width: 700 }}
                />
              </div>
              <div className='margin-top'>
                <Button type='primary' onClick={this.intelliOrderTextClick}>智能识别</Button>
                <Button type="link" onClick={this.showDemoModal}>查看示例</Button>
              </div>
            </Spin>

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
            <div className='line-height40' style={{ minWidth: 940 }}>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单号</Col>
                <Col span={8} className='padding-left'>
                  <Input value={orderBaseInfo.mark} onChange={(e) => this.onOrderInfoChange("mark", e.target.value)} style={{ width: 140, marginRight: 10 }} placeholder='填写订单标志' />此部分订单号自动生成</Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>收货人</Col>
                <Col span={8} className='padding-left'>
                  <Input value={orderBaseInfo.contactPerson} onChange={(e) => this.onOrderInfoChange("contactPerson", e.target.value)} style={{ width: 200 }} placeholder='收货人' />
                </Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>下单时间</Col>
                <Col span={8} className='padding-left'></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>联系电话</Col>
                <Col span={8} className='padding-left'>
                  <Input value={orderBaseInfo.contactPhone} onChange={(e) => this.onOrderInfoChange("contactPhone", e.target.value)} style={{ width: 200 }} />
                </Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单状态</Col>
                <Col span={8} className='padding-left' ></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>省市区</Col>
                <Col span={8} className='padding-left'>
                  {
                    selectAreaData ?
                      <span>
                        {`${selectAreaData.proviceName}-${selectAreaData.cityName}-${selectAreaData.districtName}`}
                      </span>
                      :
                      "暂未选择地区"
                  }
                  <Button onClick={this.selectArea} type='primary' className='margin-left'>修改</Button>
                </Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>支付状态</Col>
                <Col span={8} className='padding-left' ></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>详细地址</Col>
                <Col span={8} className='padding-left'>
                  <Input value={orderBaseInfo.contactAddress} onChange={(e) => this.onOrderInfoChange("contactAddress", e.target.value)} style={{ width: "95%" }} /></Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>订单总金额</Col>
                <Col span={8} className='padding-left'></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>运费</Col>
                <Col span={8} className='padding-left'>
                  <InputNumber value={orderBaseInfo.fare} precision={2} onChange={(e) => this.onOrderInfoChange("fare", e)} min={0} style={{ width: 140 }} />
                </Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>商品总金额</Col>
                <Col span={8} className='padding-left'></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>累计优惠</Col>
                <Col span={8} className='padding-left'></Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>支付方式</Col>
                <Col span={8} className='padding-left'></Col>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>买家备注</Col>
                <Col span={8} className='padding-left'></Col>
              </Row>
              <Row style={{ borderTop: '1px solid #f2f2f2', borderBottom: '1px solid #f2f2f2' }}>
                <Col span={4} style={{ backgroundColor: "#f2f2f2", textAlign: "center" }}>发货仓库</Col>
                <Col span={20} className='padding-left'>
                  <Select value={this.state.storageId} onChange={this.onStorageChange} style={{ width: 200 }}>
                    <Select.Option value={null}>请选择仓库</Select.Option>
                    {
                      storageList && storageList.length ?
                        storageList.map(item =>
                          <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        ) : null
                    }
                  </Select>
                </Col>
              </Row>
            </div>
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
              <div><Button onClick={this.addProduct} type='primary' className='normal margin-top'>添加</Button></div>
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
            </Select>
            <Input className='margin-left' style={{ width: 200 }} />
            <Button className='margin-left' type='primary'>添加日志</Button> */}
              <div><span className='margin0-10'>备注:</span> <Input value={this.state.remark} onChange={(e) => this.onRemarkChange(e.target.value)} style={{ width: 400 }} />
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
                dataSource={this.state.orderRemarkList}
              />
            </div>
          </div>
        </Spin>

        <UserSelectModal
          visible={this.state.userModalIsVisible}
          onCancel={this._hideUserModal}
          selectItem={this.selectUserClicked}
          selectIds={[selectUserId]}
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
          selectIds={this.state.orderSKUIds}
        />

        <SingleDistrictSelect
          checkedAreaData={this.state.selectAreaData}
          visible={this.state.areaModalIsVisible}
          hide={this._hideAreaSelectModal}
          onOk={this.selectAreaSaveClicked}
        />

        <Modal
          maskClosable={false}
          title='查看示例'
          visible={this.state.demoModalIsVisible}
          footer={null}
          onCancel={this.hideDemoModal}
        >
          <div>
            收货人：夏梨花<br />
            手机号码：18800000001<br />
            所在地区：四川省成都市武侯区世外桃源广场<br />
            大鱼海棠纸尿裤 s码 4包<br />
          </div>
        </Modal>
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

export default (Form.create()(Page));