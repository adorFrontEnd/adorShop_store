import { Upload, Radio, InputNumber, Form, Col, Input, Row, Icon, Spin, Modal, Popconfirm, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import { pagination } from '../../utils/pagination';
import { getPrdSkuList } from '../../api/order/order';
import { getOrderShippingData, deleteDeliveryRecord } from '../../api/order/order';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class DeliveryModal extends Component {

  state = {
    modalIsLoading: false,
    orderId: null,
    shippingData: {},
    packageItemData: null,
    editShippingData: [],
    lastQtyMap: {}
  }

  componentDidMount() {
    this.getShippingData({ id: this.props.orderId })
  }

  componentWillReceiveProps(props) {
    if (props.orderId != this.props.orderId || (props.visible && !this.props.visible)) {
      this.getShippingData({ id: props.orderId })
    }
  }

  params = {
    page: 1
  }

  getShippingData = ({ id }) => {
    if (!id) {
      return;
    }
    this.setState({
      orderId: id
    })
    this._showLoading();
    getOrderShippingData({ id })
      .then(shippingData => {

        this._hideLoading();
        let { list, shipList } = shippingData;
        let { lastQtyMap, packageItemData } = this.getLastQtyMap(list);
        let editShippingData = this.getRevertEditShippingData(shipList, lastQtyMap);

        this.setState({
          packageItemData,
          lastQtyMap,
          editShippingData,
          shippingData
        })

      })
      .catch(() => {
        this._hideLoading();
      })
  }


  _showLoading = () => {
    this.setState({
      modalIsLoading: true
    })
  }

  _hideLoading = () => {
    this.setState({
      modalIsLoading: false
    })
  }


  // 表格相关列
  columns = [
    { title: "商品", dataIndex: "productName", render: data => data || "--" },
    { title: "剩余数量", dataIndex: "lastQty", render: data => data || "--" },
    {
      title: "填写数量", render: (text, record, index) => (
        <InputNumber value={record.sendQty} onChange={(e) => this.onSendQtyChange(index, e)} placeholder='填入数量' style={{ width: 100 }} />
      )
    }
  ]

  onSendQtyChange = (mainIndex, index, sendQty) => {

    let { editShippingData } = this.state;
    editShippingData[mainIndex]['item'][index]['sendQty'] = sendQty;
    this.setState({
      editShippingData
    })
  }

  sendAll = (mainIndex, index) => {
    let { editShippingData } = this.state;
    editShippingData[mainIndex]['item'][index]['sendQty'] = editShippingData[mainIndex]['item'][index]['lastQty'];
    this.setState({
      editShippingData
    })
  }

  onCancel = () => {
    this.props.onCancel();
  }

  addShippingDataItem = () => {
    let { editShippingData, packageItemData } = this.state;
    let item = JSON.parse(JSON.stringify(packageItemData));
    editShippingData.push({
      sendWay: 1,
      logisticsName: null,
      logisticsNumber: null,
      item
    })
    this.setState({
      editShippingData
    })
  }

  onEditShippingDataChange = (action, index, e) => {

    let { editShippingData } = this.state;

    switch (action) {
      case 'sendWay':
      case 'logisticsName':
      case 'logisticsNumber':
      case 'remark':
        editShippingData[index][action] = e.target.value;
        break
    }

    this.setState({
      editShippingData
    })
  }

  deleteItem = (element, index) => {
    let { editShippingData } = this.state;
    let { id } = element;
    if (!id) {
      editShippingData.splice(index, 1);
      this.setState({
        editShippingData
      })
      return;
    }
    this._showLoading();
    deleteDeliveryRecord({ id })
      .then(() => {
        Toast("删除成功！");
        this._hideLoading();
        this.getShippingData({ id: this.state.orderId });
      })
      .catch(() => {
        this._hideLoading();
      })

  }


  onOk = () => {
    let { editShippingData, lastQtyMap } = this.state;
    console.log(lastQtyMap);
    let data = this.validateShippingData(editShippingData, lastQtyMap);
    if (!data) {
      return;
    }

    this.props.onOk(data);
  }

  enableEditShipDataClick = (mainIndex) => {
    let { editShippingData } = this.state;
    editShippingData[mainIndex]['isEdit'] = true;
    this.setState({
      editShippingData
    })
  }


  render() {
    const { shippingData, modalIsLoading, editShippingData } = this.state;
    return (
      <Modal
        maskClosable={false}
        width={950}
        title="商品发货"
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
      >
        <Spin spinning={modalIsLoading}>
          <div>
            <div className='flex line-height24 margin-bottom'>
              <div className='margin-right20 font-bold'>收货信息</div>
              <div>
                <div>{shippingData.address}</div>
                <div>{shippingData.contactPerson}（{shippingData.contactPhone}）</div>
              </div>
            </div>
            <div>
              {
                editShippingData && editShippingData.length ?
                  editShippingData.map((element, mainIndex) =>
                    this.renderShipElement(element, mainIndex)
                  )
                  : null
              }

              <div
                onClick={this.addShippingDataItem}
                className='margin-top20 line-height40'
                style={{ border: "1px dashed #ff8716", color: "#ff8716", textAlign: "center", cursor: "pointer" }}>
                <Icon type='plus' />添加包裹
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    )
  }

  renderShipElement = (element, mainIndex) => {
    let { id, isEdit } = element;
    if (id && !isEdit) {
      return this.renderNormalShipElement(element, mainIndex);
    }
    return this.renderEditShipElement(element, mainIndex);
  }

  //渲染已经保存的发货数据
  renderNormalShipElement = (element, mainIndex) => {
    return (
      <div key={mainIndex} style={{ border: "1px solid #d9d9d9" }} className='margin-top padding10-20 line-height30 border-radius'>
        <div className='flex-between'>
          <div className='font-bold font-16'>包裹{mainIndex + 1}</div>
          <div>
            <a className='margin-right' onClick={() => this.enableEditShipDataClick(mainIndex)}>编辑</a>
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => { this.deleteItem(element, mainIndex) }} >
              <a>删除</a>
            </Popconfirm>
          </div>
        </div>
        <div className='margin-bottom'>
          <span className='margin-right'>发货方式：</span>
          {
            element.sendWay == 1 ? "需要物流" : "无需物流"
          }
        </div>
        <div className='flex margin-bottom'>
          <div className='margin-right'>物流公司：</div>
          <div className='margin-right' style={{ width: 120 }}>{element.logisticsName || '--'}</div>
          <div className='margin-right'>快递单号：</div>
          <div className='margin-right' style={{ width: 240 }}>{element.logisticsNumber || '--'}</div>
          <div className='margin-right' >备注：</div>
          <div className='margin-right' style={{ width: 240 }}>{element.remark || '--'}</div>
        </div>
        <div>
          <Row style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #d9d9d9" }}>
            <Col style={{ padding: "5px 10px" }} span={14}>商品</Col>
            <Col style={{ padding: "5px 10px" }} span={6}>发货数量</Col>
          </Row>
          {
            element.item && element.item.length ?
              element.item.map((item, index) => (
                <Row key={index} style={{ borderBottom: "1px solid #d9d9d9" }}>
                  <Col style={{ padding: "5px 10px" }} span={14}>{item.productName}</Col>
                  <Col style={{ padding: "5px 10px" }} span={6}>{item.sendQty} </Col>
                </Row>
              ))
              : "暂无数据"
          }
        </div>
      </div >
    )
  }

  //渲染需要编辑的的发货数据
  renderEditShipElement = (element, mainIndex) => {

    return (
      <div key={mainIndex} style={{ border: "1px solid #d9d9d9" }} className='margin-top padding10-20 line-height30 border-radius'>
        <div className='flex-between'>
          <div className='font-bold font-16'>包裹{mainIndex + 1}</div>
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteItem(element, mainIndex) }} >
            <a>删除</a>
          </Popconfirm>
        </div>
        <div className='margin-bottom'>
          <span className='margin-right'>发货方式：</span>
          <Radio.Group value={element.sendWay} onChange={(e) => this.onEditShippingDataChange('sendWay', mainIndex, e)}>
            <Radio value={1}>需要物流</Radio>
            <Radio value={2}>无需物流</Radio>
          </Radio.Group>
        </div>
        <div className='flex margin-bottom'>
          <div className='margin-right'>物流公司：</div>
          <Input disabled={element.sendWay == 2} value={element.logisticsName}
            onChange={(e) => this.onEditShippingDataChange('logisticsName', mainIndex, e)}
            className='margin-right' placeholder='输入物流公司' style={{ width: 120 }}
          />
          <div className='margin-right'>快递单号：</div>
          <Input disabled={element.sendWay == 2}
            value={element.logisticsNumber}
            onChange={(e) => this.onEditShippingDataChange('logisticsNumber', mainIndex, e)}
            className='margin-right' placeholder='输入快递单号' style={{ width: 240 }} />
          <div className='margin-right'>备注：</div>
          <Input disabled={element.sendWay == 2}
            value={element.remark}
            onChange={(e) => this.onEditShippingDataChange('remark', mainIndex, e)}
            placeholder='输入备注' style={{ width: 240 }} />
        </div>
        <div>
          <Row style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid #d9d9d9" }}>
            <Col style={{ padding: "5px 10px" }} span={14}>商品</Col>
            <Col style={{ padding: "5px 10px" }} span={4}>剩余数量</Col>
            <Col style={{ padding: "5px 10px" }} span={6}>填写数量</Col>
          </Row>
          {
            element.item && element.item.length ?
              element.item.map((item, index) => (
                <Row key={index} style={{ borderBottom: "1px solid #d9d9d9" }}>
                  <Col style={{ padding: "5px 10px" }} span={14}>{item.productName}</Col>
                  <Col style={{ padding: "5px 10px" }} span={4}>{item.lastQty}</Col>
                  <Col style={{ padding: "5px 10px" }} span={6}>
                    <InputNumber
                      value={item.sendQty}
                      precision={0}
                      min={0}
                      max={item.lastQty}
                      onChange={(e) => this.onSendQtyChange(mainIndex, index, e)}
                      placeholder='填入数量' style={{ width: 100 }}
                    />
                    <a className='margin-left' onClick={() => this.sendAll(mainIndex, index)}>全发</a>
                  </Col>
                </Row>
              ))
              : "暂无数据"
          }
        </div>
      </div>
    )
  }

  getRevertEditShippingData = (shipList, lastQtyMap) => {
    let editShippingData = [];

    if (shipList && shipList.length) {
      editShippingData = shipList.map(element => {
        let { list, ...other } = element;
        let item = list.map(itemData => {
          let { orderItemId } = itemData;
          let lastQty = lastQtyMap[orderItemId]['lastQty'];
          return {
            lastQty,
            ...itemData
          }
        })
        return {
          ...other,
          item,
          isEdit: false
        }
      })
    }
    return editShippingData
  }

  getLastQtyMap = (list) => {
    let lastQtyMap = {};
    let packageItemData = list.map(item => {
      lastQtyMap[item.id] = {
        lastQty: item.lastQty,
        productName: item.productName,
        sumQty: 0
      }

      return {
        ...item,
        id: null,
        orderItemId: item.id,
        sendQty: 0
      }
    })
    return {
      packageItemData,
      lastQtyMap
    }
  }

  validateShippingData = (editShippingData, map) => {
    if (!editShippingData || !editShippingData.length) {
      return;
    }
    let lastQtyMap = JSON.parse(JSON.stringify(map));
    for (let i = 0; i < editShippingData.length; i++) {
      let element = editShippingData[i];

      if (element.sendWay == 1) {
        if (!element.logisticsName) {
          Toast(`包裹${i + 1}缺少发货物流公司！`);
          return;
        }

        if (!element.logisticsNumber) {
          Toast(`包裹${i + 1}缺少发货快递单号！`);
          return;
        }
      }

      let item = element.item;
      let totalQty = 0;
      item.forEach(itemData => {
        let orderItemId = itemData.orderItemId;
        if (itemData.sendQty || itemData.sendQty == 0) {
          lastQtyMap[orderItemId]['sumQty'] = lastQtyMap[orderItemId]['sumQty'] + itemData.sendQty;
          totalQty += itemData.sendQty;
        }
      });

      if (totalQty <= 0) {
        Toast(`包裹${i + 1}实际发货总数为0！`);
        return;
      }
    }

    let title = '';
    Object.values(lastQtyMap).forEach(_item => {
      let { sumQty, lastQty, productName } = _item;
      if (sumQty > lastQty) {
        title = (`商品"${productName}"总发货数大于剩余数量！`);
        return
      }
    })

    if (title) {
      Toast(title);
      return;
    }
    let result = this.getEditShippingData(editShippingData);
    return result;
  }

  getEditShippingData = (shippingData) => {

    if (!shippingData || !shippingData.length) {
      return;
    }
    let data = shippingData.map(element => {
      let { sendWay, logisticsName, logisticsNumber, remark, item, id } = element;
      item = item.map(itemData => {
        let { orderItemId, sendQty } = itemData;
        let result = {
          orderItemId, sendQty
        }
        if (itemData && itemData.id) {
          result.id = itemData.id;
        }
        return result;
      })
      let elementResult = { sendWay, logisticsName, logisticsNumber, remark, item }
      if (id) {
        elementResult.id = id
      }
      return elementResult
    })
    return data;
  }

}
export default Form.create()(DeliveryModal)