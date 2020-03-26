import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, AutoComplete, Table, Radio, InputNumber } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import RelativeCategoryModal from "../../components/category/RelativeCategoryModal";
import SpecEdit from './SpecEdit';
import ProductPictureWall from '../../components/upload/ProductPictureWall';
import UploadVideo from '../../components/upload/UploadVideo';
import RichText from '../../components/RichText/RichText';
import { searchFreightList } from '../../api/product/freight';
import { getUnitConfigList } from '../../api/sysConfig/sysConfig';
import { saveOrUpdateProduct, getProductDetail } from '../../api/product/product';
import { getSaveData, getParseDetailData } from './productUtils';

const _description = "";
const _statusEnum = {
  "0": "正常",
  "2": "待审核",
  "3": "未通过",
  "4": "已停用"
}

class Page extends Component {
  state = {
    id: 0,
    productDetail: {},
    showLoading: false,

    baseUnit: "",
    baseUnitQty: null,
    containerUnitName: "",
    isContainerUnit: false,

    areaModalIsVisible: false,
    selectAreaData: null,

    cModalIsVisible: false,
    categoryNames: null,
    categoryIds: [],

    specData: null,

    imageUrl: [],
    videoFile: null,
    details: null,

    freightList: [],
    unitList: [],
    freightType: 0,
    freightPrice: null,
    freightTemplateId: null,
    isSpecChange: false
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      _title: isEdit ? "编辑商品" : "创建商品",
      showLoading: false
    })
    this.getDetail(id);
  }

  componentDidMount() {
    this.searchFreightList();
    this.getUnitConfigList();
  }


  getDetail = (id) => {
    id = id || this.state.id;
    if (!id || id == 0) {
      return;
    }

    this._showDetailLoading();
    getProductDetail({ id })
      .then(productDetail => {
        this._hideDetailLoading();
        this.revertProductDetail(productDetail);
        this.setState({
          productDetail
        })
      })
      .catch(() => {
        this._hideDetailLoading();
      })
  }

  revertProductDetail = (productDetail) => {

    let { formData, stateData, specData } = getParseDetailData(productDetail);

    this.setState(stateData);
    this.setState({
      specData,
      isSpecChange: true
    }, () => {
      this.setState({
        isSpecChange: false
      })
    })
    this.props.form.setFieldsValue(formData);
  }

  // 返回
  goBack = () => {
    window.history.back();
  }

  refreshPageData = () => {
    this.getDetail();
  }

  saveDataClicked = () => {
    let specData = this.refs.specEditInstance.getSpecData();
    console.log(specData);
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      //*规格信息**/
      let specData = this.refs.specEditInstance.getSpecData();

      let { productDetail, isContainerUnit, containerUnitName, baseUnitQty,
        categoryIds, categoryNames, imageUrl, videoFile, details, freightType, freightPrice, freightTemplateId } = this.state;
      let stateData = {
        isContainerUnit, containerUnitName, baseUnitQty,
        categoryIds, categoryNames, specData, imageUrl, videoFile, details, freightType, freightPrice, freightTemplateId
      };
      let id = productDetail && productDetail.id ? productDetail.id : null;
      let isEdit = !!id;
      let params = getSaveData(data, stateData, isEdit);

      if (!params) {
        return;
      }

      this._showDetailLoading();
      saveOrUpdateProduct({ ...params, id })
        .then(() => {
          Toast('保存成功！');
          this._hideDetailLoading();
          this.goBack();

        })
        .catch(() => {
          this._hideDetailLoading();
        })
    })
  }



  /**基础信息 ********************************************************************************************************************/

  /**单位更改 **************/
  onUnitChange = (e) => {
    let baseUnit = e;
    this.setState({
      baseUnit
    })
  }

  onContainerUnitChange = (e) => {
    let containerUnitName = e;
    this.setState({
      containerUnitName
    })
  }

  onHasPackageUnitChange = (e) => {
    let isContainerUnit = e.target.checked;
    this.setState({
      isContainerUnit
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
    this.setState({ cModalIsVisible: false, categoryNames: category, categoryIds });
  }

  hideCModal = () => {
    this.setState({ cModalIsVisible: false })
  }




  /**商品图及详情*********************************************************************************************************/

  /**上传图片，视频**************/
  uploadPicture = (imageUrl) => {
    imageUrl = imageUrl || [];
    this.setState({
      imageUrl
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

  onFreightTypeChange = (e) => {
    let freightType = e.target.value;
    this.setState({
      freightType
    })
  }

  onfreightPriceChange = (freightPrice) => {

    this.setState({
      freightPrice
    })
  }

  onManagementIdChange = (e) => {
    let freightTemplateId = e;
    this.setState({
      freightTemplateId
    })
  }
  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList, selectAreaData, unitList, showLoading } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <div style={{ position: "fixed", bottom: "10%", right: "10%", zIndex: "999" }}>
          <Button type='primary' shape="circle" style={{ width: 80, height: 80 }} onClick={this.saveDataClicked}>保存</Button>
          <Button type='primary' shape="circle" style={{ width: 80, height: 80 }} className='yellow-btn margin-left20' onClick={this.goBack}>返回</Button>
        </div>
        <Spin spinning={showLoading}>
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
              wrapperCol={{ span: 18 }}
              label='计量单位：'
              field='baseUnit'>
              {
                getFieldDecorator('baseUnit', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '输入计量单位!' }
                  ]
                })(
                  <AutoComplete
                    allowClear
                    onChange={this.onUnitChange}
                    style={{ width: 130 }}
                    dataSource={unitList}
                    placeholder="输入计量单位"
                    filterOption={(inputValue, option) =>
                      option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                  />
                )
              }
              <Checkbox style={{ marginLeft: 10 }} checked={this.state.isContainerUnit} onChange={this.onHasPackageUnitChange}>容器单位</Checkbox>
              {
                this.state.isContainerUnit ?
                  <span>
                    <span style={{ margin: "0 10px" }}>1</span>
                    <AutoComplete
                      allowClear
                      style={{ width: 130 }}
                      value={this.state.containerUnitName}
                      onChange={this.onContainerUnitChange}
                      dataSource={unitList}
                      placeholder="输入计量单位"
                      filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                    <span style={{ margin: "0 10px" }}>=</span>
                    <InputNumber min={0} value={this.state.baseUnitQty} onChange={this.onBaseUnitQtyChange} />
                    <span>{this.state.baseUnit}</span>
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
                  <Input minLength={0} maxLength={30} />
                )
              }
            </Form.Item>
            <Row className='line-height40' style={{ width: 700 }}>
              <Col span={6} className='label-required text-right'>商品分类：</Col>
              <Col span={16}>
                <span><Button type='primary' onClick={this.showCModal}>选择分类</Button></span>
                <span className='margin-left'>
                  {
                    this.state.categoryNames ?
                      <span>
                        {this.state.categoryNames}
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
                    <Checkbox disabled={true} value={1}>直购</Checkbox>
                    <Checkbox value={2}>订货</Checkbox>
                    <Checkbox disabled={true} value={4}>云市场</Checkbox>
                  </Checkbox.Group>
                )
              }
              <span className='margin-left color-red'>可购渠道至少选择一项</span>
            </Form.Item>
            <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>规格信息</div>
            <div>
              <SpecEdit
                refresh={this.refreshPageData}
                ref='specEditInstance'
                shouldChange={this.state.isSpecChange}
                specData={this.state.specData}
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
                  pictureList={this.state.imageUrl || []}
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
                <Radio.Group value={this.state.freightType} onChange={this.onFreightTypeChange}>
                  <Radio value={0} style={{ display: 'block', height: '40px', lineHeight: '30px' }}>
                    <span>统一运费</span>
                    <InputNumber
                      precision={2}
                      value={this.state.freightPrice}
                      onChange={this.onfreightPriceChange}
                      style={{ width: 140, marginLeft: 10, marginRight: 10 }}
                      min={0}
                      placeholder='填写运费价格'
                    />元
                </Radio>
                  <Radio value={1} style={{ display: 'block', height: '40px', lineHeight: '30px' }}>
                    <span>运费模板</span>
                    <Select value={this.state.freightTemplateId} onChange={this.onManagementIdChange} style={{ width: 140, marginLeft: 10 }}>
                      <Select.Option value={null}>请选择</Select.Option>
                      {
                        this.state.freightList && this.state.freightList.length ?
                          this.state.freightList.map(item =>
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                          )
                          : null
                      }

                    </Select>
                  </Radio>
                </Radio.Group>
              </Col>
            </Row>
          </Form>
        </Spin>


        <RelativeCategoryModal
          showList={true}
          maxLength={5}
          categoryIds={this.state.categoryIds}
          onOk={this.cModalSaveClick}
          onCancel={this.hideCModal}
          visible={this.state.cModalIsVisible}
        />
      </CommonPage >)
  }

  searchFreightList = () => {
    searchFreightList({ page: 1, size: 100 })
      .then((res) => {
        let freightList = res.data;
        this.setState({
          freightList
        })
      })
  }

  getUnitConfigList = () => {
    getUnitConfigList({ page: 1, size: 100 })
      .then((res) => {
        let arr = res.data;
        let unitList = arr.map(item => item.name);
        this.setState({
          unitList
        })
      })
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

}

export default Form.create()(Page);