import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, Table, Radio, InputNumber } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import RelativeCategoryModal from "../../components/category/RelativeCategoryModal";
import SpecEdit from './SpecEdit';
import ProductPictureWall from '../../components/upload/ProductPictureWall';
import UploadVideo from '../../components/upload/UploadVideo';
import RichText from '../../components/RichText/RichText';

// import PictureWall from '../../components/upload/PictureWall';


const _description = "";
const _statusEnum = {
  "0": "正常",
  "2": "待审核",
  "3": "未通过",
  "4": "已停用"
}
const _unitEnum = {
  "0": "箱",
  "1": "包",
  "2": "罐"
}

class Page extends Component {
  state = {
    id: 0,
    showLoading: false,
    baseUnitId: "",
    baseUnitQty: null,
    packageUnitId: "",
    hasPackageUnit: false,

    areaModalIsVisible: false,
    selectAreaData: null,
    cModalIsVisible: false,
    category: null,
    categoryIds: [],
    specData: null,
    productUrls: [],
    videoFile: null,
    details: null
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      _title: isEdit ? "编辑商品" : "创建商品",
      showLoading: false
    })
    // this.getDetail(id);
    // this._getOrganization(id);
  }


  getDetail = (id) => {
    id = id || this.state.id;
    if (!id || id == 0) {
      return;
    }

    this._showDetailLoading();
    // getDealerDetails({ id })
    //   .then(dealerDetail => {

    //     let { dealerName, name, unit, tencentLng, tencentLat, address, shipStatus, storeStatus } = dealerDetail;
    //     let location = { address, tencentLng, tencentLat };
    //     this.setState({
    //       dealerDetail,
    //       location
    //     })
    //     this.revertAuth(shipStatus, storeStatus);
    //     this.props.form.setFieldsValue({
    //       dealerName,
    //       name,
    //       unit
    //     });
    //     this._hideDetailLoading();

    //   })
    //   .catch(() => {
    //     this._hideDetailLoading();
    //   })
  }

  _showDetailLoading = () => {
    this.setState({
      showLoading: true
    })
  }

  _hideDetailLoading = () => {
    this.setState({
      showLoading: false
    })
  }



  // 返回
  goBack = () => {
    window.history.back();
  }

  saveDataClicked = () => {

    this.props.form.validateFields((err, params) => {
      if (err) {
        return;
      }
      // addDealerAndUpdate({ ...params, ...authObj, ...station, id, labelId })
      //   .then(res => {
      //     if (res.status == "SUCCEED") {
      //       Toast(`${id ? "保存" : "添加"}成功!`, "success");
      //       this.goBack();
      //     }
      //   })
    })
  }

  /**基础信息 ********************************************************************************************************************/

  /**单位更改 **************/
  onUnitChange = (e) => {
    let baseUnitId = e;
    this.setState({
      baseUnitId
    })
  }

  onPackageUnitChange = (e) => {
    let packageUnitId = e;
    this.setState({
      packageUnitId
    })
  }

  onHasPackageUnitChange = (e) => {
    let hasPackageUnit = e.target.checked;
    this.setState({
      hasPackageUnit
    })
  }

  onBaseUnitQtyChange = (e) => {
    let baseUnitQty = e;
    this.setState({
      baseUnitQty
    })
  }

  /**选择分类 ***********/

  showCModal = () => {
    this.setState({ cModalIsVisible: true })
  }

  cModalSaveClick = (params) => {
    let { categoryIds, category } = params;
    this.setState({ cModalIsVisible: false, category, categoryIds });
  }

  hideCModal = () => {
    this.setState({ cModalIsVisible: false })
  }

  /**规格信息**********************************************************************************************************/
  onSpecDataChange = (specData) => {

    this.setState({
      specData
    })
  }

  /**商品图及详情*********************************************************************************************************/

  /**上传图片，视频**************/
  uploadPicture = (productUrls) => {
    productUrls = productUrls || [];
    this.setState({
      productUrls
    })
  }

  uploadVideo = (videoFile) => {
    this.setState({
      videoFile
    })
  }

  /**富文本 **************/
  onTextChange = (details) => {
    this.setState({
      details
    })
  }
  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList, selectAreaData } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <Row style={{ width: 700 }} className='line-height40 padding10-0'>
          <Col offset={3}>
            <Button type='primary' style={{ width: 100 }} onClick={this.saveDataClicked}>保存</Button>
            <Button type='primary' className='yellow-btn margin-left20' style={{ width: 100 }} onClick={this.goBack}>返回</Button>
          </Col>
        </Row>
        <Form className='common-form'>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>基础信息</div>
          <Form.Item
            style={{ width: 700 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
            label='商品名称：'
            field='name'>
            {
              getFieldDecorator('name', {
                rules: [
                  { required: true, message: '请输入商品名称!' }
                ]
              })(
                <Input minLength={0} maxLength={20} />
              )
            }
          </Form.Item>
          <Form.Item
            style={{ width: 700 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label='计量单位：'
            field='unit'>
            {
              getFieldDecorator('unit', {
                initialValue: null,
                rules: [
                  { required: true, message: '请输入计量单位!' }
                ]
              })(
                <Select style={{ width: 90 }} onChange={this.onUnitChange}>
                  <Select.Option value={null}>请选择</Select.Option>
                  {
                    Object.keys(_unitEnum).map(item => <Select.Option key={item} value={item}>{_unitEnum[item]}</Select.Option>)
                  }
                </Select>
              )
            }
            <Checkbox style={{ marginLeft: 10 }} checked={this.state.hasPackageUnit} onChange={this.onHasPackageUnitChange}>容器单位</Checkbox>
            {
              this.state.hasPackageUnit ?
                <span>
                  <span style={{ margin: "0 10px" }}>1</span>
                  <Select style={{ width: 90 }} defaultValue={null} onChange={this.onPackageUnitChange}>
                    <Select.Option value={null}>请选择</Select.Option>
                    {
                      Object.keys(_unitEnum).map(item => <Select.Option key={item} disabled={item == this.state.baseUnitId} value={item}>{_unitEnum[item]}</Select.Option>)
                    }
                  </Select>
                  <span style={{ margin: "0 10px" }}>=</span>
                  <InputNumber min={0} value={this.state.baseUnitQty} onChange={this.onBaseUnitQtyChange} />
                  {
                    this.state.baseUnitId ?
                      <span>{_unitEnum[this.state.baseUnitId]}</span>
                      : null
                  }
                </span>
                : null
            }
          </Form.Item>
          <Form.Item
            style={{ width: 700 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 8 }}
            label='包装规格'
            field='specifications'>
            {
              getFieldDecorator('specifications', {
                rules: [
                  { required: true, message: '请输入包装规格!' }
                ]
              })(
                <Input minLength={0} maxLength={11} />
              )
            }
          </Form.Item>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='label-required text-right'>商品分类：</Col>
            <Col span={16}>
              <span><Button type='primary' onClick={this.showCModal}>选择分类</Button></span>
              <span className='margin-left'>
                {
                  this.state.category ?
                    <span>
                      {this.state.category}
                    </span>
                    :
                    "暂未选择商品分类"
                }
              </span>
            </Col>
          </Row>

          <Form.Item
            style={{ width: 700 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label='可购渠道：'
            field='channel'>
            {
              getFieldDecorator('channel', {
                rules: [
                  { required: true, message: '可购渠道至少选择一项!' }
                ]
              })(
                <Checkbox.Group>
                  <Checkbox disabled={true} value='0'>直购</Checkbox>
                  <Checkbox value='1'>订货</Checkbox>
                  <Checkbox disabled={true} value='2'>云市场</Checkbox>
                </Checkbox.Group>
              )
            }
            <span className='margin-left color-red'>可购渠道至少选择一项</span>
          </Form.Item>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>规格信息</div>
          <div>
            <SpecEdit
              specData={this.state.specData}
              onChange={this.onSpecDataChange}
            />
          </div>


          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>商品图及详情</div>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='label-required text-right'>商品图片：</Col>
            <Col span={18}>
              <div className='color-red'>
                第一个为主图，其余为商品的轮播图，最多上传15张<br />
                当SKU不存在轮播图时展示商品默认轮播图
              </div>
              <ProductPictureWall
                uploadCallback={this.uploadPicture}
                pictureList={this.state.productUrls || []}
                limitFileLength={15}
                folder='product'
                allowType={['1', '2']}
              />
            </Col>
          </Row>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>商品视频：</Col>
            <Col span={18}>
              <UploadVideo
                folder='video'
                videoFile={this.state.videoFile}
                uploadCallback={this.uploadVideo}
              />
            </Col>
          </Row>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='label-required text-right'>商品详情：</Col>
            <Col span={18}>
              <RichText
                textValue={this.state.details}
                onTextChange={this.onTextChange}
              />
            </Col>
          </Row>

          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>其它信息</div>
          <Row className='line-height30 margin-bottom20' style={{ width: 700 }}>
            <Col span={6} className='label-required text-right'>快递运费：</Col>
            <Col span={18}>
              <Radio.Group defaultValue={1}>
                <Radio value={1} style={{ display: 'block', height: '40px', lineHeight: '30px' }}>
                  <span>统一运费</span><InputNumber precision={2} style={{ width: 140,marginLeft:10,marginRight:10 }} placeholder='填写运费价格' />元
                </Radio>
                <Radio value={2} style={{ display: 'block', height: '40px', lineHeight: '30px' }}>
                  <span>运费模板</span>
                  <Select defaultValue={null} style={{ width: 140 ,marginLeft:10 }}>
                    <Select.Option value={null}>请选择</Select.Option>
                    <Select.Option value={1}>模板1</Select.Option>
                    <Select.Option value={2}>模板2</Select.Option>
                  </Select>
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
        </Form>

        <RelativeCategoryModal
          maxLength={5}
          categoryIds={this.state.categoryIds}
          onOk={this.cModalSaveClick}
          onCancel={this.hideCModal}
          visible={this.state.cModalIsVisible}
        />
      </CommonPage >)
  }
}

export default Form.create()(Page);