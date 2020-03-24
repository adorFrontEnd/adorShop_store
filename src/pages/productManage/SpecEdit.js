import React, { Component } from "react";
import { Col, Row, Checkbox, Modal, Select, Spin, Icon, Form, Button, Badge, Input, Radio, InputNumber, Popconfirm } from 'antd';
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import ProductPictureWall from '../../components/upload/ProductPictureWall';
import { _getSpecDataBySpecClasses } from './specUtils';

class Page extends Component {

  state = {
    isMultiSpec: false,
    singleSpecData: {},
    multiSpecClasses: [],
    multiSpecData: [],
    uploadModalIsVisible: false,
    selectProductUrls: [],
    selectSpecIndex: 0
  }

  componentDidMount() {
    this.onSpecDataRevert(this.props.specData);
  }

  componentWillReceiveProps(props) {
    if (props.shouldChange) {
      this.onSpecDataRevert(props.specData);
    }
  }

  getSpecData = () => {
    let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    return {
      isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
    }
  }

  //规格数据回滚
  onSpecDataRevert = (data) => {

    let isMultiSpec = false;
    if (!data) {
      this._initSpecData();
    } else {
      let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = data;
      this.setState({
        isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
      })


    }
  }

  _initSpecData = () => {
    let isMultiSpec = false;
    let singleSpecData = {
      specValue: "无",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
      weight: null
    };
    let multiSpecData = [];
    let multiSpecClasses = [];
    let data = {
      isMultiSpec: false,
      singleSpecData,
      multiSpecClasses,
      multiSpecData,
      uploadModalIsVisible: false,
      selectProductUrls: [],
      selectSpecIndex: 0
    }
    this.setState(data);

  }

  muiltiChecked = (e) => {
    let isMultiSpec = e.target.checked;
    let { singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    if (isMultiSpec) {
      this.initMultiData()
    }
    this.setState({
      isMultiSpec
    })
   
  }

  initMultiData = () => {

    let { isMultiSpec, singleSpecData } = this.state;

    let multiSpecClasses = [{
      specName: "",
      specValues: [],
      inputSpecValue: ""
    }];

    let multiSpecData = [{
      specValue: "",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
    }];

    this.setState({
      multiSpecClasses,
      multiSpecData
    })
 
  }



  // 增加规格值
  addSpecValue = (specIndex) => {
    let { isMultiSpec, multiSpecClasses, singleSpecData } = this.state;
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

    let multiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
    this.setState({
      multiSpecClasses,
      multiSpecData
    })
  
  }


  onMultiSpecClassesChange = (action, specIndex, e, index) => {

    let { multiSpecClasses, isMultiSpec, singleSpecData } = this.state;

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
      let multiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
      this.setState({
        multiSpecData
      })
 
    }
  }



  //修改规格详细数据
  onMultiSpecDataChange = (index, key, e) => {
    let { multiSpecData, isMultiSpec, singleSpecData, multiSpecClasses } = this.state;

    switch (key) {
      case 'number':
      case 'barCode':
        let val = e.target.value;
        multiSpecData[index][key] = val;
        break;

      case 'marketPrice':
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

  //修改规格详细数据
  onSingleSpecDataChange = (key, e) => {
    let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;

    switch (key) {
      case 'number':
      case 'barCode':
        let val = e.target.value;
        singleSpecData[key] = val;
        break;

      case 'marketPrice':
      case 'costPrice':
      case 'weight':
        singleSpecData[key] = e;
        break;
    }

    this.setState({
      singleSpecData
    })

  }


  //上传图片的modal
  showUploadModal = (isMultiSpec, selectSpecIndex) => {

    let { singleSpecData, multiSpecData } = this.state;
    let selectProductUrls = [];
    if (!isMultiSpec) {
      selectProductUrls = singleSpecData['imageUrl'] || [];
    } else {
      selectProductUrls = multiSpecData[selectSpecIndex]["imageUrl"] || [];
    }

    this.setState({
      selectSpecIndex,
      selectProductUrls
    })
    this._showUploadModal();
  }


  uploadPicture = (picList) => {
    let selectProductUrls = picList || [];
    this.setState({
      selectProductUrls
    })
  }

  onSavePitureModal = () => {
    let { selectProductUrls, selectSpecIndex, isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    if (!isMultiSpec) {
      singleSpecData['imageUrl'] = selectProductUrls;
      this.setState({
        singleSpecData
      })
    } else {
      multiSpecData[selectSpecIndex]['imageUrl'] = selectProductUrls;
      this.setState({
        multiSpecData
      })
    }

    this.hideUploadModal();
  }


  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specValues, multiSpecClasses, multiSpecData, singleSpecData } = this.state;

    return (
      <div className='padding'>
        <div style={{ background: "#f2f2f2" }} className='color333 padding border-radius font-16'>
          <Checkbox checked={this.state.isMultiSpec} onChange={this.muiltiChecked}>多规格</Checkbox>
        </div>
        <div style={{ minHeight: 300 }}>
          {
            !this.state.isMultiSpec ?
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
                  <Col span={1} className='padding flex-middle flex-center'>1</Col>
                  <Col span={2} className='flex-middle flex-center' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal()}>
                      {
                        singleSpecData['imageUrl'] && singleSpecData['imageUrl'].length ?
                          <div className='padding'>
                            <Badge count={singleSpecData['imageUrl'].length}>
                              <img src={singleSpecData['imageUrl'][0]} style={{ height: 50, width: 50 }} />
                            </Badge>
                          </div>
                          :
                          <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10 }}>
                            <Icon type='plus' style={{ fontSize: 20 }} />
                          </div>
                      }
                    </div>
                  </Col>
                  <Col span={2} className='padding flex-center align-center'><div>{singleSpecData.specValue}</div></Col>
                  <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <Input placeholder='输入商品编码' value={singleSpecData['number']} style={{ maxWidth: "100%" }} onChange={(e) => this.onSingleSpecDataChange('number', e)} />
                  </Col>
                  <Col span={4} className='padding flex-middle'>
                    <Input placeholder='输入条形码' value={singleSpecData['barCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onSingleSpecDataChange('barCode', e)} />
                  </Col>
                  <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                    <InputNumber value={singleSpecData['marketPrice']} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onSingleSpecDataChange('marketPrice', e)} />
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
                      <div className='text-center line-height40 color-gray' style={{ border: "1px solid #ccc", marginTop: "-1px" }}>暂无数据</div>
                  }
                </div>
                {
                  multiSpecClasses.length <= 2 ?
                    <Button className='margin-left' type='primary' onClick={() => this.onMultiSpecClassesChange('add')}>添加规格</Button>
                    : null
                }
                <Row style={{ border: "1px solid #d9d9d9", marginTop: "10px" }}>
                  <Col span={1} className='padding'></Col>
                  <Col span={2} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>主图</Col>
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
                        <Col span={2} className='flex-middle flex-center' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal(true, specIndex)}>
                            {
                              specDataItem['imageUrl'] && specDataItem['imageUrl'].length ?
                                <div className='padding'>
                                  <Badge count={specDataItem['imageUrl'].length}>
                                    <img src={specDataItem['imageUrl'][0]} style={{ height: 50, width: 50 }} />
                                  </Badge>
                                </div>
                                :
                                <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10 }}>
                                  <Icon type='plus' style={{ fontSize: 20 }} />
                                </div>
                            }
                          </div>
                        </Col>
                        <Col span={3} className='padding flex-center align-center'><div>{specDataItem.specValue}</div></Col>
                        <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <Input placeholder='输入商品编码' value={specDataItem['number']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'number', e)} />
                        </Col>
                        <Col span={4} className='padding flex-middle'>
                          <Input placeholder='输入条形码' value={specDataItem['barCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'barCode', e)} />
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <InputNumber value={specDataItem['marketPrice']} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'marketPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle'>
                          <InputNumber value={specDataItem['costPrice']} precision={2} min={0} placeholder='输入成本价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'costPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                          <InputNumber suffix="kg" value={specDataItem['weight']} precision={2} min={0} placeholder='输入重量' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'weight', e)} />
                          kg
                        </Col>
                      </Row>

                    )
                    :
                    <div className='text-center line-height40 color-gray' style={{ border: "1px solid #ccc", marginTop: "-1px" }}>暂无数据</div>
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
          okText='保存'
          onOk={this.onSavePitureModal}
          onCancel={this.hideUploadModal}
          width={640}
          title='SKU图片信息'
        >
          <div className='color-red line-height40'>
            第一个为主图，其余为SKU的轮播图，最多上传15张
            <Button onClick={this.resetPictures} type="primary" className='margin-left'>清空所有图片</Button>
          </div>
          <ProductPictureWall
            allowType={['1', '2']}
            uploadCallback={this.uploadPicture}
            pictureList={this.state.selectProductUrls || []}
            limitFileLength={15}
            folder='product'
          />
        </Modal>
      </div >
    )
  }


  _showUploadModal = () => {
    this.setState({
      uploadModalIsVisible: true
    })
  }

  hideUploadModal = () => {
    this.setState({
      uploadModalIsVisible: false
    })
  }

  resetPictures = () => {
    let { selectProductUrls } = this.state;
    this.setState({
      selectProductUrls: []
    })
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