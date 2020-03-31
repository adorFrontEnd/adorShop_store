import React, { Component } from "react";
import { Col, Row, Checkbox, Card, Modal, Select, Spin, Form, Button, Input, InputNumber, Table, Radio } from 'antd';
import Toast from '../../utils/toast';
import CommonPage from '../../components/common-page';
import { SearchForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import PictureWall from '../../components/upload/PictureWall';
import SingleDistrictSelect from '../../components/areaSelect/SingleDistrictSelect';
import { getGradeList } from "../../api/user/grade";
import { searchUser, createUser, getUserDetail, detectPhone } from '../../api/user/user';
import { md5 } from "../../utils/signMD5.js";

const _description = "";
const _statusEnum = {
  "0": "正常",
  "1": "待审核"
}

class Page extends Component {
  state = {
    id: 0,
    showLoading: false,
    areaModalIsVisible: false,
    selectAreaData: null,
    gradeList: [],
    hasSuperiorId: false,
    headUrl: "xxxx",
    isPhoneValid: false,
    superiorCustomerName: null,
    userDetail: null,
    headUrl: ""
  }

  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id && id != 0;
    this.setState({
      id,
      _title: isEdit ? "编辑客户" : "添加客户",
      showLoading: false
    })

  }

  componentDidMount() {
    this.getGradeList();
    this.getUserDetail();
  }

  getGradeList = () => {
    getGradeList()
      .then(gradeList => {
        this.setState({
          gradeList
        })
      })
  }

  getUserDetail = (id) => {
    id = id || this.state.id;
    if (!id || id == 0) {
      this.setState({
        userDetail: null
      })
      return;
    }

    this._showLoading();

    getUserDetail({ shopUserId: id })
      .then(userDetail => {
        let { customerName, accountNumber, gradeId, status, remark, superiorId, area, headUrl, superiorCustomerName } = userDetail;

        let hasSuperiorId = !!superiorId;
        let selectAreaData = this.formatSelectAreaData(area)
        this.setState({
          headUrl,
          userDetail,
          hasSuperiorId,
          selectAreaData,
          selectSuperiorId: superiorId,
          superiorCustomerName,
          isPhoneValid: true
        })

        this.props.form.setFieldsValue({
          customerName,
          remark,
          gradeId,
          status: status || status == 0 ? status.toString() : null,
          accountNumber
        });

        this._hideLoading();
      })
      .catch(() => {
        this._hideLoading();
      })
  }

  _showLoading = () => {
    this.setState({
      showLoading: true
    })
  }

  _hideLoading = () => {
    this.setState({
      showLoading: false
    })
  }

  // 返回
  goEditBack = () => {
    window.history.back();
  }

  /**保存数据 ***************************************************************************************************************/
  saveDataClicked = () => {
    this.props.form.validateFields((err, params) => {

      if (err) {
        return;
      }
      let { customerName, accountNumber, gradeId, status, remark } = params;
      let { hasSuperiorId, selectAreaData, headUrl, selectSuperiorId, userDetail, isPhoneValid } = this.state;

      if (!isPhoneValid) {
        Toast('请检测登录账号是否可用！');
        return;
      }

      if (hasSuperiorId && !selectSuperiorId) {
        Toast('请选择上级客户！');
        return;
      }
      let password = md5(accountNumber.toString());
      let superiorId = hasSuperiorId ? selectSuperiorId : null;
      let area = this.getAreaData(selectAreaData);

      if (!area) {
        Toast('请选择客户地区！');
        return;
      }


      let shopUserId = userDetail && userDetail.shopUserId;
      let id = userDetail && userDetail.id
      let data = {
        id, shopUserId, customerName, accountNumber, gradeId, status, remark, superiorId, area, headUrl, password
      }
      this._showLoading();
      createUser(data)
        .then(() => {
          Toast("保存成功！");
          this.goEditBack();
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

  formatSelectAreaData = (areaData) => {
    if (!areaData) {
      return;
    }
    let arr = areaData.split(',');
    if (!arr[0] || !arr[1]) {
      return;
    }
    let [proviceId, cityId, districtId] = arr[0].split('-');
    let [proviceName, cityName, districtName] = arr[1].split('-');
    return {
      districtId, proviceId, cityId, proviceName, cityName, districtName
    }

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
    detectPhone({ phone: accountNumber })
      .then(data => {

        let isPhoneValid = data && data.status == '0';
        this.setState({ isPhoneValid });
      })
  }

  hasSuperiorIdRadioChange = (e) => {
    let hasSuperiorId = e.target.value;
    this.setState({
      hasSuperiorId
    })
  }

  searchSuperiorIdClicked = (e) => {
    let { superiorCustomerName } = this.state;

    if (!superiorCustomerName) {
      Toast("请输入客户名称！");
      return;
    }
    this.setState({
      selectSuperiorId: null
    })

    searchUser({ superiorCustomerName })
      .then(superiors => {

        this.setState({
          superiors
        })
        if (!superiors || !superiors.length) {
          Toast("暂未搜索出该客户！");
          return;
        }

      })
  }

  superiorCustomerNameChange = (e) => {
    let superiorCustomerName = e.target.value;
    this.setState({
      superiorCustomerName
    })
  }

  superiorChange = (e) => {

    let selectSuperiorId = e.target.value;
    this.setState({
      selectSuperiorId
    })
  }

  onAccountNumberChange = () => {
    this.setState({
      isPhoneValid: false
    })
  }


  // 上传图片
  uploadActivityLogoPic = (picList) => {
    let headUrl = picList && picList.length ? picList[0] : "";
    this.setState({
      headUrl
    })
  }

  /***渲染*************************************************************************************************** */

  render() {
    const { getFieldDecorator } = this.props.form;
    let { labelList, selectAreaData } = this.state;

    return (
      <CommonPage path='user.userManage.userEdit' title={this.state._title} pathTitle={this.state._title} description={_description} >
        <div style={{ width: 650 }}>
          <Spin spinning={this.state.showLoading}>
            <Row className='line-height40 padding10-0'>
              <Col offset={8}>
                <Button type='primary' style={{ width: 100 }} onClick={this.saveDataClicked}>保存</Button>
                <Button type='primary' className='yellow-btn margin-left' style={{ width: 100 }} onClick={this.goEditBack}>返回</Button>
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
                        <InputNumber disabled={!!this.state.userDetail} onChange={this.onAccountNumberChange} style={{ width: 200 }} precision={0} min={0} minLength={0} maxLength={11} />
                      )
                    }
                  </Form.Item>
                </Col>
                {
                  !this.state.userDetail ?
                    <Col span={8} className='line-height40'>
                      <Button type='primary' className='margin0-10' onClick={this.checkCliked}>检测</Button>
                      <span>
                        {
                          this.state.isPhoneValid ?
                            <span className='color-green'>此账号可用</span> :
                            <span className='color-red'>请确保是手机号格式</span>
                        }
                      </span>
                    </Col>
                    : null
                }
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
                            <Select.Option key={item.id.toString()} value={item.id}>{item.name}</Select.Option>
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
                    value={this.state.superiorCustomerName}
                    onChange={this.superiorCustomerNameChange}
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
              {
                this.state.superiors && this.state.superiors.length ?
                  <Row className='margin-bottom'>
                    <Col span={8} className={`${this.state.hasSuperiorId ? "label-required" : ""} text-right`} >选择上级：</Col>
                    <Col span={16} className='flex-middle'>
                      <Radio.Group value={this.state.selectSuperiorId} onChange={this.superiorChange}>
                        {
                          this.state.superiors.map(item =>
                            <Radio key={item.id.toString()} value={item.id}>{item.name}</Radio>
                          )
                        }
                      </Radio.Group>
                    </Col>
                  </Row>
                  :
                  null
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
              <Row className='line-height40 margin-top margin-bottom'>
                <Col span={8} className='text-right'>
                  <span className='label-color'>头像：</span>
                </Col>
                <Col span={16} >
                  <PictureWall
                    allowType={['1', '2']}
                    folder='shop'
                    pictureList={this.state.headUrl ? [this.state.headUrl] : null}
                    uploadCallback={this.uploadActivityLogoPic}
                  />
                  <div className='color-red' style={{ lineHeight: "16px" }}>建议尺寸420px*420px，图片格式png、jpg，大小不超过3MB</div>
                </Col>
              </Row>
            </Form>
          </Spin>
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