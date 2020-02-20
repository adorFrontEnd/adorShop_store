import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, Table, Radio } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
// import PictureWall from '../../components/upload/PictureWall';
import SingleDistrictSelect from '../../components/areaSelect/SingleDistrictSelect';


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
    selectAreaData:null
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      _title: isEdit ? "编辑客户" : "添加客户",
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

    //     let { dealerName, name, phone, tencentLng, tencentLat, address, shipStatus, storeStatus } = dealerDetail;
    //     let location = { address, tencentLng, tencentLat };
    //     this.setState({
    //       dealerDetail,
    //       location
    //     })
    //     this.revertAuth(shipStatus, storeStatus);
    //     this.props.form.setFieldsValue({
    //       dealerName,
    //       name,
    //       phone
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
    if (!selectAreaData) {
      return;
    }
    this.setState({
      selectAreaData
    })
    this._hideAreaSelectModal()
  }

  /***渲染*************************************************************************************************** */

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList,selectAreaData } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <div style={{ width: 600 }}>

          <Row className='line-height40 padding10-0'>
            <Col offset={8}>
              <Button type='primary' style={{ width: 100 }} onClick={this.saveDataClicked}>保存</Button>
              <Button type='primary' className='yellow-btn margin-left' style={{ width: 100 }} onClick={this.dealerEditBack}>返回</Button>
            </Col>
          </Row>

          <Form className='common-form'>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='客户名称：'
              field='name'>
              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入客户名称!' }
                  ]
                })(
                  <Input minLength={0} maxLength={20} />
                )
              }
            </Form.Item>
            <Row>
              <Col span={16}>
                <Form.Item
                  labelCol={{ span: 12 }}
                  wrapperCol={{ span: 12 }}
                  label='登录账号：'
                  field='phone'>
                  {
                    getFieldDecorator('phone', {
                      rules: [
                        { required: true, message: '请输入登录账号!' }
                      ]
                    })(
                      <Input minLength={0} maxLength={11} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8} className='line-height40'>
                <Button type='primary' className='margin-left'>检测</Button>
                <span>请确保是手机号格式</span>
              </Col>
            </Row>

            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='登录密码'
              field='password'>
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入登录密码!' }
                  ]
                })(
                  <Input />
                )
              }
            </Form.Item>
            <Row className='line-height40'>
              <Col span={8} className='label-required text-right'>地区：</Col>
              <Col span={16}>
                <span><Button type='primary' onClick={this.selectArea}>选择地区</Button></span>
                <span className='margin-left'>
                  {
                    selectAreaData?
                    <span>
                      {`${selectAreaData.proviceName}-${selectAreaData.cityName}-${selectAreaData.districtName}`}
                    </span>
                    :
                    "暂未选择地区"
                  }                
                </span>
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='身份证号：'
              field='idCard'>
              {
                getFieldDecorator('idCard', {
                  rules: [
                    { required: true, message: '请输入身份证号!' }
                  ]
                })(
                  <Input minLength={0} maxLength={18} />
                )
              }
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='客户级别：'
              field='grade'>
              {
                getFieldDecorator('grade', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                  <Select>
                    <Select.Option value={null}>请选择</Select.Option>
                    <Select.Option value={1}>一级</Select.Option>
                    <Select.Option value={2}>二级</Select.Option>
                    <Select.Option value={3}>三级</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Row className='line-height40'>
              <Col span={8} className='label-required text-right'>上级：</Col>
              <Col span={16} className='flex-middle'>
                <Input style={{ width: 200, marginRight: '10px' }} />
                <Radio.Group defaultValue={false}>
                  <Radio value={false}>有上级</Radio>
                  <Radio value={true}>无上级</Radio>
                </Radio.Group>
              </Col>
            </Row>
            <Row className='line-height20 margin-bottom'>

              <Col offset={8} span={16} className='flex-middle'>
                <span className='color-red'>回车搜索上级用户</span>
              </Col>
            </Row>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='状态'
              field='status'>
              {
                getFieldDecorator('status', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                  <Select>
                    <Select.Option value={null}>请选择</Select.Option>
                    {
                      Object.keys(_statusEnum).map(item => (
                        <Select.Option key={item} value={item}>{_statusEnum[item]}</Select.Option>
                      ))
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='备注：'
              field='remark'>
              {
                getFieldDecorator('remark')(
                  <Input minLength={0} />
                )
              }
            </Form.Item>
            {/* <Row className='line-height40 margin-top margin-bottom'>
              <Col span={5} className='text-right'>
                <span className='label-color label-required'>头像：</span>
              </Col>
              <Col span={19} >
                <PictureWall
                  allowType={['1', '2']}
                  folder='trace'
                  pictureList={this.state.avatar ? [this.state.avatar] : null}
                  uploadCallback={this.uploadActivityLogoPic}
                />
                <div className='color-red' style={{ lineHeight: "16px" }}>建议尺寸420px*420px，图片格式png、jpg，大小不超过3MB</div>               
              </Col>
            </Row> */}
          </Form>
        </div>
        <SingleDistrictSelect
          visible={this.state.areaModalIsVisible}
          hide={this._hideAreaSelectModal}
          onOk={this.selectAreaSaveClicked}
        />

      </CommonPage >)
  }
}

export default Form.create()(Page);