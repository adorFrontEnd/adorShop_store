import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, Table, Radio } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import RelativeCategoryModal from "../../components/category/RelativeCategoryModal";
import SpecEdit from './SpecEdit';

// import PictureWall from '../../components/upload/PictureWall';


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
    showLoading: false,
    areaModalIsVisible: false,
    selectAreaData: null,
    cModalIsVisible: false,
    category: null,
    categoryIds: []
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      _title: isEdit ? "编辑商品" : "创建商品",
      showLoading: false
    })
    // this.getDealerDetail(id);
    // this._getOrganization(id);
  }


  getDealerDetail = (id) => {
    id = id || this.state.id;
    if (!id || id == 0) {
      return;
    }

    this._showLoading();
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
    //     this._hideDealerDetailLoading();

    //   })
    //   .catch(() => {
    //     this._hideDealerDetailLoading();
    //   })
  }

  _showLoading = () => {
    this.setState({
      showLoading: true
    })
  }

  _hideDealerDetailLoading = () => {
    this.setState({
      showLoading: false
    })
  }



  // 返回
  dealerEditBack = () => {
    window.history.back();
  }

  saveDataClicked = () => {
  
    this.props.form.validateFields((err, params) => {
      if (err) {
        return;
      }
      params.id = this.state.id;
      if (params.id == 0) {
        if (!params.password) {
          Toast("密码必填!", "");
          return;
        }
      }
      let auth = this.state.auth;
      if (!auth || !auth.length) {
        Toast("请至少选择一种权限！");
        return;
      }

      let authObj = this.getAuthStatus(this.state.auth);
      let { storeStatus } = authObj;
      let station = this.state.location;
      if (storeStatus == '1') {
        station = null;
      }
      let id = !this.state.id || this.state.id == '0' ? null : this.state.id;
      let { labelId } = this.state.dealerDetail || {};

      // addDealerAndUpdate({ ...params, ...authObj, ...station, id, labelId })
      //   .then(res => {
      //     if (res.status == "SUCCEED") {
      //       Toast(`${id ? "保存" : "添加"}成功!`, "success");
      //       this.dealerEditBack();
      //     }
      //   })
    })
  }


  /**选择地区 */
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

  /**选择分类 *******************************************************************************************************/

  // 选择经营分类
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

  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList, selectAreaData } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <Row style={{ width: 600 }} className='line-height40 padding10-0'>
          <Col offset={3}>
            <Button type='primary' style={{ width: 100 }} onClick={this.saveDataClicked}>保存</Button>
            <Button type='primary' className='yellow-btn margin-left20' style={{ width: 100 }} onClick={this.dealerEditBack}>返回</Button>
          </Col>
        </Row>
        <Form className='common-form'>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>基础信息</div>
          <Form.Item
            style={{ width: 600 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
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
            style={{ width: 600 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
            label='计量单位：'
            field='unit'>
            {
              getFieldDecorator('unit', {
                rules: [
                  { required: true, message: '请输入计量单位!' }
                ]
              })(
                <Input minLength={0} maxLength={11} />
              )
            }
          </Form.Item>
          <Form.Item
            style={{ width: 600 }}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 10 }}
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
          <Row className='line-height40' style={{ width: 600 }}>
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
            style={{ width: 600 }}
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
                  <Checkbox value='0'>直购</Checkbox>
                  <Checkbox value='1'>订货</Checkbox>
                  <Checkbox value='2'>云市场</Checkbox>
                </Checkbox.Group>
              )
            }
            <span className='margin-left color-red'>可购渠道至少选择一项</span>
          </Form.Item>
          <div style={{ background: "#f2f2f2", borderLeft: "6px solid #ff8716" }} className='color333 padding border-radius font-16 margin-bottom'>规格信息</div>
          <div>
            <SpecEdit />
          </div>
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