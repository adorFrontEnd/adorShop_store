import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, InputNumber, Table, Radio } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
// import PictureWall from '../../components/upload/PictureWall';
import SingleDistrictSelect from '../../components/areaSelect/SingleDistrictSelect';
import { getGradeList } from "../../api/user/grade";
import { searchUser, createUser } from '../../api/user/user';
import { md5 } from "../../utils/signMD5.js";

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
    gradeList: [],
    hasSuperiorId: false,
    headUrl: "xxxx"
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

  componentDidMount() {
    this.getGradeList();
  }

  getGradeList = () => {
    getGradeList()
      .then(gradeList => {
        this.setState({
          gradeList
        })
      })
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
      let { customerName, accountNumber, gradeId, status, remark } = params;
      let { hasSuperiorId, selectAreaData, headUrl } = this.state;
      let password = md5(accountNumber.toString());
      let superiorId = null;
      let area = this.getAreaData(selectAreaData);
      let data = {
        customerName, accountNumber, gradeId, status, remark, superiorId, area, headUrl, password
      }
      createUser(data)
        .then(() => {
          Toast("保存成功！");
        })
    })
  }

  getAreaData = (selectAreaData) => {
    if (!selectAreaData || !selectAreaData.districtId) {
      return;
    }
    let { districtId, proviceId, cityId, proviceName, cityName, districtName } = selectAreaData;
    proviceId = proviceId || districtId.toString().substr(0, 2) + "0000";
    cityId = cityId || districtId.toString().substr(0, 4) + "00";
    return `${proviceId}-${cityId}-${districtId},${proviceName}-${cityName}-${districtName}`
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

  checkCliked = () => {
    let { accountNumber } = this.props.form.getFieldsValue();
    if (!accountNumber || accountNumber.toString().length != 11) {
      Toast("请输入正确的手机号！");
    }
  }

  hasSuperiorIdRadioChange = (e) => {
    let hasSuperiorId = e.target.value;
    this.setState({
      hasSuperiorId
    })
  }

  searchSuperiorIdClicked = (e) => {
    let { customerName } = this.state;
    searchUser({ customerName })
      .then(() => {

      })
  }

  customerNameChange = (e) => {
    let customerName = e.target.value;
    this.setState({
      customerName
    })
  }

  /***渲染*************************************************************************************************** */

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList, selectAreaData } = this.state;

    return (
      <CommonPage title={this.state._title} description={_description} >
        <div style={{ width: 650 }}>

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
              field='customerName'>
              {
                getFieldDecorator('customerName', {
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
                  field='accountNumber'>
                  {
                    getFieldDecorator('accountNumber', {
                      rules: [
                        { required: true, message: '请输入登录账号!' }
                      ]
                    })(
                      <InputNumber style={{ width: 200 }} precision={0} min={0} minLength={0} maxLength={11} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8} className='line-height40'>
                <Button type='primary' className='margin0-10' onClick={this.checkCliked}>检测</Button>
                <span className='color-red'>请确保是手机号格式</span>
              </Col>
            </Row>


            <Row className='line-height40'>
              <Col span={8} className='label-required text-right'>地区：</Col>
              <Col span={16}>
                <span><Button type='primary' onClick={this.selectArea}>选择地区</Button></span>
                <span className='margin-left'>
                  {
                    selectAreaData ?
                      <span>
                        {`${selectAreaData.proviceName}-${selectAreaData.cityName}-${selectAreaData.districtName}`}
                      </span>
                      :
                      "暂未选择地区"
                  }
                </span>
              </Col>
            </Row>
            {/* <Form.Item
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
            </Form.Item> */}
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label='客户级别：'
              field='gradeId'>
              {
                getFieldDecorator('gradeId', {
                  initialValue: null,
                  rules: [
                    { required: true, message: '请选择!' }
                  ]
                })(
                  <Select style={{ width: 200 }}>
                    <Select.Option value={null} style={{ width: 200 }}>请选择</Select.Option>
                    {
                      this.state.gradeList && this.state.gradeList.length ?
                        this.state.gradeList.map(item =>
                          <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        )
                        : null
                    }
                  </Select>
                )
              }
            </Form.Item>
            <Row className='line-height40'>
              <Col span={8} className={`${this.state.hasSuperiorId ? "label-required" : ""} text-right`} >上级：</Col>
              <Col span={16} className='flex-middle'>
                <Input
                  value={this.state.customerName}
                  onChange={this.customerNameChange}
                  onPressEnter={this.searchSuperiorIdClicked}
                  disabled={!this.state.hasSuperiorId} style={{ width: 200, marginRight: '10px' }}
                  placeholder='输入上级账户'
                />
                <Radio.Group defaultValue={false} value={this.state.hasSuperiorId} onChange={this.hasSuperiorIdRadioChange}>
                  <Radio value={true}>有上级</Radio>
                  <Radio value={false}>无上级</Radio>
                </Radio.Group>
              </Col>
            </Row>
            {
              this.state.hasSuperiorId ?
                <Row className='line-height20 margin-bottom'>
                  <Col offset={8} span={16} className='flex-middle'>
                    <span className='color-red'>回车搜索上级用户</span>
                  </Col>
                </Row>
                : null
            }

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
                  <Select style={{ width: 200 }}>
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
          checkedAreaData={this.state.selectAreaData}
          visible={this.state.areaModalIsVisible}
          hide={this._hideAreaSelectModal}
          onOk={this.selectAreaSaveClicked}
        />

      </CommonPage >)
  }
}

export default Form.create()(Page);