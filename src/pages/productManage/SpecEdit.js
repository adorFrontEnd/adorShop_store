import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Tag, Modal, Select, Spin, Icon, Form, Button, Input, Table, Radio, InputNumber, Popconfirm } from 'antd';
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import ProductPictureWall from '../../components/upload/ProductPictureWall';


class Page extends Component {
  state = {
    isMultiProduct: false,
    singleSpecData: {
      specTitle: "无",
      productUrl: "",
      productCode: "",
      barCode: "",
      originalPrice: null,
      costPrice: null,
      weight: null
    },
    multiSpecClasses: [],
    multiSpecData: [],
    uploadModalIsVisible: false
  }

  muiltiChecked = (e) => {
    let isMultiProduct = e.target.checked;
    if (isMultiProduct) {
      this.revertMultiData()
    }
    this.setState({
      isMultiProduct
    })
  }

  revertMultiData = (data) => {
    if (!data) {
      this.setState({
        multiSpecClasses: [{
          specName: "",
          specValues: [],
          inputSpecValue: ""
        }],
        multiSpecData: [{
          specTitle: "",
          productUrl: [],
          productCode: "",
          barCode: "",
          originalPrice: null,
          costPrice: null,
        }]
      })
    }
  }

  // 增加规格值
  addSpecValue = (specIndex) => {
    let { multiSpecClasses } = this.state;
    let inputSpecValue = multiSpecClasses[specIndex]['inputSpecValue'];
    let specValues = multiSpecClasses[specIndex]['specValues'];

    if (!inputSpecValue) {
      Toast('请输入规格值');
      return
    }

    if (specValues.indexOf(inputSpecValue) !== -1) {
      Toast('规格值重复！');
      return
    }
    multiSpecClasses[specIndex]['specValues'] = [...specValues, inputSpecValue];
    multiSpecClasses[specIndex]['inputSpecValue'] = null;

    let multiSpecData = this.getSpecDataBySpecClasses(multiSpecClasses);
    this.setState({
      multiSpecClasses,
      multiSpecData
    })
  }


  onMultiSpecClassesChange = (action, specIndex, e, index) => {

    let { multiSpecClasses } = this.state;

    switch (action) {

      case "add":
        multiSpecClasses.push(
          {
            specName: "",
            specValues: [],
            inputSpecValue: ""
          }
        )
        break;

      case 'inputSpecValueChange':
        multiSpecClasses[specIndex]["inputSpecValue"] = e.target.value.trim();
        break;

      case 'deleteItem':
        multiSpecClasses[specIndex]["specValues"].splice(index, 1);
        break;

      case 'delete':
        multiSpecClasses.splice(specIndex, 1);
        break;

      case "specNameChange":
        multiSpecClasses[specIndex]['specName'] = e.target.value.trim();;
        break;

    }

    this.setState({
      multiSpecClasses
    })

    if (action == 'deleteItem' || action == 'delete' || action == 'specNameChange') {
      let multiSpecData = this.getSpecDataBySpecClasses(multiSpecClasses);
      this.setState({
        multiSpecData
      })
    }
  }

  getSpecDataBySpecClasses = (multiSpecClasses, seprator) => {
    let list = multiSpecClasses.map(item => item.specValues);
    let titles = this._getSpecDataTitles(list, seprator);
    let specData = this._getSpecDataByTitles(titles);
    return specData;
  }

  //修改规格详细数据
  onMultiSpecDataChange = (index, key, e) => {
    let { multiSpecData } = this.state;

    switch (key) {
      case 'productCode':
      case 'barCode':
        let val = e.target.value;
        multiSpecData[index][key] = val;
        break;

      case 'originalPrice':
      case 'costPrice':
      case "weight":
        multiSpecData[index][key] = e;
        break;

      case 'delete':
        multiSpecData.splice(index, 1);
        break
    }

    this.setState({
      multiSpecData
    })
  }

  uploadPic = (specIndex, picList) => {

    let { multiSpecData } = this.state;
    let picUrl = picList && picList.length ? picList[0] : "";
    multiSpecData[specIndex]['productUrl'] = picUrl;
    this.setState({
      multiSpecData
    })
  }

  uploadSinglePic = (picList) => {
    let { singleSpecData } = this.state;
    let picUrl = picList && picList.length ? picList[0] : "";
    singleSpecData['productUrl'] = picUrl;
    this.setState({
      singleSpecData
    })
  }

  //修改规格详细数据
  onSingleSpecDataChange = (key, e) => {
    let { singleSpecData } = this.state;

    switch (key) {
      case 'productCode':
      case 'barCode':
        let val = e.target.value;
        singleSpecData[key] = val;
        break;

      case 'originalPrice':
      case 'costPrice':
      case 'weight':
        singleSpecData[key] = e;
        break;
    }

    this.setState({
      singleSpecData
    })
  }

  showUploadModal = () => {
    this.setState({
      uploadModalIsVisible: true
    })
  }

  hideUploadModal = () => {
    this.setState({
      uploadModalIsVisible: false
    })
  }
  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specValues, multiSpecClasses, multiSpecData, singleSpecData } = this.state;

    return (
      <div className='padding'>
        <div style={{ background: "#f2f2f2" }} className='color333 padding border-radius font-16'>
          <Checkbox checked={this.state.isMultiProduct} onChange={this.muiltiChecked}>多规格</Checkbox>
        </div>
        <div style={{ minHeight: 300 }}>
          {
            !this.state.isMultiProduct ?
              <div>
                <Row style={{ border: "1px solid #d9d9d9", marginTop: "10px" }}>
                  <Col span={1} className='padding'></Col>
                  <Col span={2} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>主图</Col>
                  <Col span={2} className='padding' >规格</Col>
                  <Col span={4} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>商品编码</Col>
                  <Col span={4} className='padding' >条形码</Col>
                  <Col span={4} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>划线价</Col>
                  <Col span={4} className='padding'>成本价</Col>
                  <Col span={3} className='padding' style={{ borderLeft: "1px solid #d9d9d9" }}>重量</Col>
                </Row>
                <Row style={{ border: "1px solid #d9d9d9", marginTop: "-1px", display: 'flex', alignItems: 'auto' }}>
                  <Col span={1} className='padding flex-center align-center'>1</Col>
                  <Col span={2} className='flex-middle align-center' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10, cursor: "pointer" }} onClick={this.showUploadModal}>
                      <Icon type='plus' style={{ fontSize: 20 }} />
                    </div>
                  </Col>
                  <Col span={2} className='padding flex-center align-center'><div>{singleSpecData.specTitle}</div></Col>
                  <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <Input placeholder='输入商品编码' value={singleSpecData['productCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onSingleSpecDataChange('productCode', e)} />
                  </Col>
                  <Col span={4} className='padding flex-middle'>
                    <Input placeholder='输入条形码' value={singleSpecData['barCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onSingleSpecDataChange('barCode', e)} />
                  </Col>
                  <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <InputNumber value={singleSpecData['originalPrice']} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onSingleSpecDataChange('originalPrice', e)} />
                    元
                  </Col>
                  <Col span={4} className='padding flex-middle'>
                    <InputNumber value={singleSpecData['costPrice']} precision={2} min={0} placeholder='输入成本价' style={{ width: 120 }} onChange={(e) => this.onSingleSpecDataChange('costPrice', e)} />
                    元
                  </Col>
                  <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                    <InputNumber value={singleSpecData['weight']} precision={2} min={0} placeholder='输入重量' style={{ width: 120 }} onChange={(e) => this.onSingleSpecDataChange('weight', e)} />
                    kg
                  </Col>
                </Row>
              </div>
              :
              <div>
                <Row style={{ border: "1px solid #d9d9d9" }}>
                  <Col offset={2} span={6} className='padding'>规格名称</Col>
                  <Col span={16} className='padding'>规格值<span className='color-red'>（可使用键盘“回车键”快速添加规格值）</span></Col>
                </Row>

                <div className='margin-bottom'>
                  {
                    multiSpecClasses && multiSpecClasses.length ?
                      multiSpecClasses.map((specItem, specIndex) =>
                        <Row key={specIndex} style={{ border: "1px solid #d9d9d9", marginTop: "-1px" }}>
                          <Col span={2} className='padding text-center'>
                            <Popconfirm
                              placement="topLeft" title='确认删除该规格吗？'
                              onConfirm={() => this.onMultiSpecClassesChange('delete', specIndex)}
                            >
                              <div>
                                <DeleteItem
                                  title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
                                />
                              </div>
                            </Popconfirm>
                          </Col>
                          <Col span={6} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                            <Input placeholder='输入规格名称' value={specItem.specName} onChange={(e) => this.onMultiSpecClassesChange('specNameChange', specIndex, e)} style={{ minWidth: 100, maxWidth: 140 }} />
                          </Col>
                          <Col span={16} className='padding flex-middle'>
                            {
                              multiSpecClasses[specIndex]['specValues'] && multiSpecClasses[specIndex]['specValues'].length ?
                                multiSpecClasses[specIndex]['specValues'].map((item, index) =>
                                  <div key={item} style={{ marginRight: "14px", background: "#ff8716", color: "#fff", position: "relative", borderRadius: "3px", padding: "6px 10px" }}
                                  >
                                    <span >{item}</span>
                                    <a onClick={() => this.onMultiSpecClassesChange('deleteItem', specIndex, null, index)} style={{ right: "-8px", top: "-4px", position: "absolute", textAlign: "center", fontSize: "20px", borderRadius: "50%", background: "#d96609", color: "#fff", display: 'inline-block', width: '20px', height: 20, lineHeight: "16px" }}>
                                      ×
                                    </a>
                                  </div>
                                )
                                : null
                            }
                            <Input placeholder='输入规格值' value={multiSpecClasses[specIndex]['inputSpecValue']} style={{ maxWidth: 140 }} onChange={(e) => this.onMultiSpecClassesChange('inputSpecValueChange', specIndex, e)} onPressEnter={() => this.addSpecValue(specIndex)} />
                          </Col>
                        </Row>
                      )
                      :
                      <div className='text-center line-height40 color-gray'>暂无数据</div>
                  }
                </div>
                {
                  multiSpecClasses.length <= 2 ?
                    <Button className='margin-left' type='primary' onClick={() => this.onMultiSpecClassesChange('add')}>添加规格</Button>
                    : null
                }
                <Row style={{ border: "1px solid #d9d9d9", marginTop: "10px" }}>
                  <Col span={1} className='padding'></Col>
                  <Col span={3} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>主图</Col>
                  <Col span={3} className='padding' >规格</Col>
                  <Col span={4} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>商品编码</Col>
                  <Col span={4} className='padding' >条形码</Col>
                  <Col span={3} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>划线价</Col>
                  <Col span={3} className='padding'>成本价</Col>
                  <Col span={3} className='padding'>重量</Col>
                </Row>

                {
                  multiSpecData && multiSpecData.length ?
                    multiSpecData.map((specDataItem, specIndex) =>
                      <Row key={specIndex} style={{ border: "1px solid #d9d9d9", marginTop: "-1px", display: 'flex', alignItems: 'auto' }}>
                        <Col span={1} className='padding flex-center align-center'>
                          <Popconfirm
                            placement="topLeft" title='确认删除该规格吗？'
                            onConfirm={() => this.onMultiSpecDataChange(specIndex, 'delete')}
                          >
                            <div>
                              <DeleteItem
                                title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
                              />
                            </div>
                          </Popconfirm>
                        </Col>
                        <Col span={3} className='flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10, cursor: "pointer" }} onClick={this.showUploadModal}>
                            <Icon type='plus' style={{ fontSize: 20 }} />
                          </div>
                        </Col>
                        <Col span={3} className='padding flex-center align-center'><div>{specDataItem.specTitle}</div></Col>
                        <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <Input placeholder='输入商品编码' value={specDataItem['productCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'productCode', e)} />
                        </Col>
                        <Col span={4} className='padding flex-middle'>
                          <Input placeholder='输入条形码' value={specDataItem['barCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'barCode', e)} />
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <InputNumber value={specDataItem['originalPrice']} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'originalPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle'>
                          <InputNumber value={specDataItem['costPrice']} precision={2} min={0} placeholder='输入成本价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'costPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                          <InputNumber value={specDataItem['weight']} precision={2} min={0} placeholder='输入重量' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'weight', e)} />
                          kg
                        </Col>
                      </Row>

                    )
                    :
                    <div className='text-center line-height40 color-gray'>暂无数据</div>
                }
              </div>
          }
        </div>
        <div className='color-red line-height24 padding-top'>
          注意：<br />
          1、可够渠道中勾选了直购，则可编辑直购价格；<br />
          2、可够渠道中勾选了订货，则可编辑分销订货价格；<br />
          3、可够渠道中勾选了云市场，则可编辑云市场结算价格。<br />
        </div>
        <Modal
          visible={this.state.uploadModalIsVisible}
          onCancel={this.hideUploadModal}
          width={800}
        >
          <ProductPictureWall
            limitFileLength={15}
            folder='product'
          />
        </Modal>
      </div >
    )
  }



  _getSpecDataByTitles = (titles) => {
    if (!titles || !titles.length) {
      return []
    }

    let specData = titles.map(specTitle => {
      return {
        specTitle,
        productUrl: [],
        productCode: "",
        barCode: "",
        originalPrice: null,
        costPrice: null,
      }
    })
    return specData
  }

  _getSpecDataTitles = (multiSpecClasses, seprator) => {
    if (!multiSpecClasses || !multiSpecClasses.length) {
      return
    }
    let list1_2 = this._getSpecDataTitlesFormLists(multiSpecClasses[0], multiSpecClasses[1]);

    if (multiSpecClasses.length <= 2) {
      return list1_2;
    }

    let list3 = this._getSpecDataTitlesFormLists(list1_2, multiSpecClasses[2]);
    return list3
  }

  _getSpecDataTitlesFormLists = (list1, list2, seprator) => {
    seprator = seprator || " "
    if ((!list1 || list1.length == 0) && (!list2 || list2.length == 0)) {
      return
    }

    if ((!list1 || list1.length == 0) && list2 && list2.length > 0) {
      return list2
    }

    if ((!list2 || list2.length == 0) && list1 && list1.length > 0) {
      return list1
    }

    if (list1 && list1.length > 0 && list2 && list2.length > 0) {
      let arr = [];
      list1.forEach(item1 => {
        list2.forEach(item2 => {
          arr.push(`${item1}${seprator}${item2}`)
        })
      })
      return arr
    }
  }

}

export default Form.create()(Page);

class DeleteItem extends Component {

  state = {
    hovered: false
  }

  onMouseOver = () => {
    this.setState({
      hovered: true
    })
  }

  onMouseLeave = () => {
    this.setState({
      hovered: false
    })
  }

  render() {
    return (
      <div onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
        {
          this.state.hovered ?
            <a>删除</a>
            :
            <span>{this.props.title}</span>
        }
      </div>
    )
  }
}