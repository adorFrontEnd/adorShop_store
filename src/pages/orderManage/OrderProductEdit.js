import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, AutoComplete, Table, Radio, InputNumber } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import RelativeCategoryModal from "../../components/category/RelativeCategoryModal";
import OrderProductSpecEdit from './OrderProductSpecEdit';
import { searchFreightList } from '../../api/product/freight';
import { getUnitConfigList } from '../../api/sysConfig/sysConfig';
import { saveOrUpdateProduct, getProductDetail } from '../../api/product/product';
import { getSellProductDetail } from '../../api/product/orderProduct';
import { getSaveData, getParseDetailData, parseSpecData } from '../productManage/productUtils';
import ReactPlayer from 'react-player';
import RichText from '../../components/RichText/RichText';


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
    specData: null,
    imageUrl: [],
    freightMap: {},
    isSpecChange:false
  }

  componentWillMount() {
    let sellPrdId = this.props.match.params.sellPrdId;
    let tplPrdId = this.props.match.params.tplPrdId;
    let isEdit = sellPrdId != 0;
    let id = sellPrdId == 0 ? tplPrdId : sellPrdId;
    this.setState({
      sellPrdId,
      tplPrdId,
      id,
      _title: isEdit ? "编辑商品" : "创建商品",
      showLoading: false
    })
    this.getDetail(sellPrdId, tplPrdId);
  }

  componentDidMount() {
    this.searchFreightList();
  }


  getDetail = (sellPrdId, tplPrdId) => {
    sellPrdId = sellPrdId || this.state.sellPrdId;
    tplPrdId = tplPrdId || this.state.tplPrdId;

    let _getDetail = sellPrdId == 0 ? getProductDetail : getSellProductDetail;
    let id = sellPrdId == 0 ? tplPrdId : sellPrdId;

    this._showDetailLoading();
    _getDetail({ id })
      .then(productDetail => {
        this._hideDetailLoading();

        let { baseUnit, containerUnit, isContainerUnit, imageUrl, isOpenSpec, paramList } = productDetail;
        let totalUnitStr = isContainerUnit ? this.getTotalUnitStr(baseUnit, containerUnit) : baseUnit;
        imageUrl = imageUrl.split('|');
        let specData = parseSpecData({ isOpenSpec, paramList })
     
        this.setState({
          productDetail,
          totalUnitStr,
          imageUrl          
        })
        this.setState({
          specData,
          isSpecChange: true
        }, () => {
          this.setState({
            isSpecChange: false
          })
        })
      })
      .catch(() => {
        this._hideDetailLoading();
      })
  }

  // 返回
  goBack = () => {
    window.history.back();
  }

  getTotalUnitStr = (baseUnit, containerUnit) => {
    if (!containerUnit) {
      return baseUnit
    }
    containerUnit = JSON.parse(containerUnit);
    let { containerUnitName, baseUnitQty } = containerUnit;
    return `${baseUnit}，1${containerUnitName} = ${baseUnitQty}${baseUnit}`;
  }

  /**规格信息**********************************************************************************************************/
  onSpecDataChange = (specData) => {

    this.setState({
      specData
    })
  }
  // paramList: [{ id: 16, gmtCreate: 1584414199000, gmtModified: 1584414199000, shopId: 18, productId: 25, … }]

  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    let { productDetail, totalUnitStr, imageUrl, freightMap, labelList, unitList, showLoading } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <div style={{ position: "fixed", bottom: "10%", right: "10%", zIndex: "999" }}>
          <Button type='primary' shape="circle" style={{ width: 80, height: 80 }} onClick={this.saveDataClicked}>保存</Button>
          <Button type='primary' shape="circle" style={{ width: 80, height: 80 }} className='yellow-btn margin-left20' onClick={this.goBack}>返回</Button>
        </div>
        <Spin spinning={showLoading}>

          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>基础信息</div>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>商品名称：</Col>
            <Col span={16}>{productDetail.name} </Col>
          </Row>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>计量单位：</Col>
            <Col span={16}>{totalUnitStr}</Col>
          </Row>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>包装规格：</Col>
            <Col span={16}>{productDetail.specifications}</Col>
          </Row>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>商品分类：</Col>
            <Col span={16}>{productDetail.categoryNames}</Col>
          </Row>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>规格信息</div>
          <div>
            <OrderProductSpecEdit
              shouldChange={this.state.isSpecChange}
              specData={this.state.specData}
              onChange={this.onSpecDataChange}
            />
          </div>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>商品图及详情</div>
          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>商品图片：</Col>
            <Col span={18}>
              <div className='flex flex-wrap margin-top'>
                {
                  imageUrl && imageUrl.length ?
                    imageUrl.map((item, index) =>
                      <div key={index} className='margin-right'>
                        <img style={{ width: 100, height: 100 }}
                          className='border-radius'
                          src={item}
                        />
                        <div className='text-center'>
                          {index == 0 ? "主图" : `轮播${index}`}
                        </div>
                      </div>

                    )
                    : null
                }
              </div>
            </Col>
          </Row>
          {
            productDetail.videoUrl ?
              <Row className='line-height40' style={{ width: 700 }}>
                <Col span={6} className='text-right'>商品视频：</Col>
                <Col span={18}>
                  <div style={{ width: 160 }} className='margin-top'>
                    <div style={{ border: "1px solid #bfbfbf", height: 160, width: 160 }} className='flex-middle flex-center border-radius'>
                      <ReactPlayer url={productDetail.videoUrl} width="150px" height="150px" controls />
                    </div>
                  </div>
                </Col>
              </Row> : null
          }

          <Row className='line-height40' style={{ width: 700 }}>
            <Col span={6} className='text-right'>商品详情：</Col>
            <Col span={18} className='margin-top margin-bottom'>
              <RichText
                readOnly={true}
                textValue={productDetail.details}
              />
            </Col>
          </Row>

          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>其它信息</div>
          <Row className='line-height30 margin-bottom20' style={{ width: 700 }}>
            <Col span={6} className='text-right'>快递运费：</Col>
            <Col span={18}>
              {
                productDetail.freightType == 0 ?
                  <div>
                    <span>统一运费：</span><span>{productDetail.freightPrice}元</span>
                  </div>
                  :
                  <div>
                    <span>运费模板：</span><span>{freightMap[productDetail.freightTemplateId]}</span>
                  </div>
              }
            </Col>
          </Row>
        </Spin>

      </CommonPage >)
  }

  searchFreightList = () => {
    searchFreightList({ page: 1, size: 100 })
      .then((res) => {
        let freightList = res.data;
        let freightMap = {};
        freightList.forEach(element => {
          let { id, name } = element;
          freightMap[id] = name;
        });
        this.setState({
          freightMap
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