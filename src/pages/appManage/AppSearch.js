import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { searchApplicationList, saveOrUpdateApplication, updateStatus, resetSecretKey } from '../../api/appManage';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';
import PictureWall from '../../components/upload/PictureWall';
import { getCacheUserInfo } from '../../middleware/localStorage/login';
import AcountInOutModal from './AccountInOutModal';

const userSearchPath = routerConfig["appManage.userSearch"].path;
const qrcodeListPath = routerConfig["appManage.qrcodeList"].path;

const _title = "应用查询";
class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    companyList: null,
    cacheCompanyName: '',
    secretKey: "",
    selectAppId: null,
    selectAppBalance: null
  }

  componentDidMount() {
    this.getPageData();
    this.props.changeRoute({ path: 'appManage.appSearch', title: _title, parentTitle: '应用管理' });
    let { companyName } = getCacheUserInfo();
    this.setState({
      cacheCompanyName: companyName
    })
  }

  params = {
    page: 1
  }


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchApplicationList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize;
        _this.getPageData();
      })

      this.setState({
        pageDataList: res.data,
        pagination: _pagination,

      })

    }).catch(() => {
      this._hideTableLoading();
    })
  }

  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }

  // 表格相关列
  columns = [
    { title: "APP_ID", dataIndex: "appId" },
    { title: "应用名", dataIndex: "name" },
    { title: "所属企业", dataIndex: "companyName" },
    { title: "状态", dataIndex: "status", render: data => data == '1' ? <span className='color-green'>已激活</span> : <span className='color-red'>未激活</span> },
    { title: "未结算金额", dataIndex: "unsettledAmount", render: data => data || '--' },
    { title: "应用会员", dataIndex: "userQuantity", render: (data, record) => < NavLink to={userSearchPath + `?appId=${record.appId}&appName=${record.name}`} >{data || 0}</NavLink > },
    { title: "总收款金额", dataIndex: "balance" },
    { title: "应用账户余额", render: (text, record, index) => <a onClick={() => this.showInoutModalClicked(record)}>查看收支</a> },
    { title: "通知地址", dataIndex: "notificationAddress" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a onClick={() => { this.editApp(record) }}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => { this.showSecret(record) }}>重置Secret</a>
          <Divider type="vertical" />
          < NavLink to={qrcodeListPath + `?appId=${record.appId}`} >查看二维码</NavLink >
          <Divider type="vertical" />
          {
            record.status == '1' ?
              <Popconfirm
                placement="topLeft" title='确认要禁用吗？'
                onConfirm={() => { this.revertAppStatus(record) }} >
                <a size="small" className="color-red">禁用</a>
              </Popconfirm>
              :
              <a onClick={() => { this.revertAppStatus(record) }}>启用</a>
          }
        </span>
      )
    }
  ]

  // 反转账户
  revertAppStatus = (record) => {
    let { id, status } = record;
    status = (status == '1') ? "0" : "1";
    let title = (status == '1') ? "启用完毕！" : "禁用完毕！"
    updateStatus({ id, status })
      .then(() => {
        Toast(title);
        this.getPageData();
      })
  }


  showSecret = (selectData) => {
    this.setState({
      secretModalIsVisible: true,
      selectData
    })
  }

  _hideSecretModal = () => {
    this.setState({
      secretModalIsVisible: false,
      isResetStatus: false,
      secretKey: null,
      selectData: null
    })
  }

  onCopiedClicked = () => {
    this.setState({ copied: true });
    Toast("复制成功！")
  }

  resetSecretClicked = () => {
    let { id } = this.state.selectData;

    resetSecretKey({ id })
      .then(secretKey => {

        this.setState({
          secretKey,
          isResetStatus: true
        })
      })

  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { time, nameParam } = params;
    let { startBalance, endBalance } = this.state;
    if ((endBalance || endBalance == 0) && (startBalance > endBalance)) {
      Toast("开始金额大于结束金额！");
      return;
    }
    if (time && time.length) {
      let [startTime, stopTime] = time;
      let startCreateTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        ...params,
        startBalance,
        endBalance,
        startCreateTimeStamp,
        endCreateTimeStamp,
        time: null
      }
    } else {
      this.params = {
        ...params,
        startBalance,
        endBalance,
        time: null
      }
    }
    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  /**企业账户modal，创建、修改企业账户******************************************************************************************************************************/
  _showAppModal = () => {
    this.setState({
      appModalIsVisible: true
    })
  }

  _hideAppModal = () => {
    this.setState({
      appModalIsVisible: false
    })
  }

  newItemFormList = [
    {
      type: "INPUT",
      field: "name",
      label: "应用名称：",
      placeholder: "请输入应用名称",
      rules: [
        { required: true, message: '请输入应用名称!' }
      ]
    },
    {
      type: "INPUT",
      field: "notificationAddress",
      label: "通知地址",
      placeholder: "请输入通知地址",
      rules: [
        { required: true, message: '请输入通知地址!' }
      ]
    }
  ]
  // 创建应用
  createAppClicked = () => {

    this.setState({
      selectData: null
    })
    this.setState({
      selectData: null,
      logoPicUrl: null,
      editFormValue: null
    })
    this._showAppModal();
  }

  // 编辑账号
  editApp = (selectData) => {
    let { logoUrl } = selectData;
    let editFormValue = { ...selectData, _s: Date.now() };

    this.setState({
      selectData,
      logoPicUrl: logoUrl,
      editFormValue
    })

    this._showAppModal();
  }

  // 确认保存账号
  modalSaveClicked = (params) => {

    let { logoPicUrl, selectData } = this.state;
    if (!logoPicUrl) {
      this.setState({
        showImgValidateInfo: true
      })
      return;
    } else {
      this.setState({
        showImgValidateInfo: false
      })
    }

    let id = null;
    if (selectData) {
      id = selectData.id;
    }

    let reqData = {
      ...params,
      logoUrl: logoPicUrl,
      id
    }
    saveOrUpdateApplication(reqData)
      .then(() => {
        Toast('保存成功！');
        this._hideAppModal();
        this.getPageData();
      })
  }

  uploadLogoPic = (picList) => {
    let logoPicUrl = picList && picList.length ? picList[0] : "";
    this.setState({
      logoPicUrl
    })
  }
  /**查看收支******************************************************************************************************************************/
  showInoutModalClicked = (record) => {
    this._showInoutModal(record);
  }

  _showInoutModal = (record) => {
    let { appId, balance } = record;
    this.setState({
      selectAppId: appId,
      selectAppBalance: balance

    }, () => {
      this.setState({

        inOutModalIsVisible: true
      })
    })
  }

  _hideInoutModal = () => {
    this.setState({
      inOutModalIsVisible: false
    })
  }

  onBalanceChange = (e, k) => {
    let data = {};
    data[k] = e;
    this.setState(data);
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} >
        <div className='margin10-0' >
          <div className='margin-bottom'><Button type='primary' className='normal' onClick={this.createAppClicked}>创建应用</Button></div>
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="nameParam"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='&emsp;应用名：'
                >
                  {
                    getFieldDecorator('nameParam', {
                    })(
                      <Input allowClear placeholder="输入应用名" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='APP_ID'
                  field='appIdParam'>
                  {
                    getFieldDecorator('appIdParam', {
                    })(
                      <Input allowClear placeholder="输入appId" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row className="margin-top margin-bottom">

              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='账户金额：'
                  field='amount'>

                  <Input.Group compact style={{ width: 240 }}>
                    <InputNumber
                      min={0}
                      value={this.state.startBalance} onChange={(e) => { this.onBalanceChange(e, 'startBalance') }} style={{ width: 106, textAlign: 'center' }} />
                    <InputNumber
                      style={{
                        width: 30,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                      }}
                      placeholder="~"
                      disabled
                    />
                    <InputNumber min={0} value={this.state.endBalance} onChange={(e) => { this.onBalanceChange(e, 'endBalance') }} style={{ width: 106, textAlign: 'center' }} />
                  </Input.Group>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='创建时间'
                  field='time'>
                  {
                    getFieldDecorator('time')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='padding10-0'>
          <Button className='normal' type='primary' onClick={this.searchClicked}>筛选</Button>
          <Button className='margin-left' onClick={this.resetClicked}>清除所有筛选</Button>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />

        <Modal
          maskClosable={false}
          width={800}
          title='创建/编辑应用'
          visible={this.state.appModalIsVisible}
          footer={null}
          onCancel={this._hideAppModal}
          className='noPadding'
        >
          <SubmitForm
            addonBefore={
              <Row className='line-height40 margin-top20'>
                <Col span={8} className='text-right'>
                  <span className='label-color label-required'>应用LOGO：</span>
                </Col>
                <Col span={16}>
                  <PictureWall
                    allowType={['1', '2']}
                    folder='adorpay'
                    pictureList={this.state.logoPicUrl ? [this.state.logoPicUrl] : null}
                    uploadCallback={this.uploadLogoPic}
                  />
                  <div className='line-height20 color-red'>120像素*120像素，大小不超过2MB</div>
                  {
                    this.state.showImgValidateInfo ?
                      <div className='line-height18 color-red' style={{ textAlign: "left" }}>请设置应用LOGO</div> :
                      null
                  }
                </Col>
              </Row>
            }
            clearWhenHide={true}
            showForm={this.state.appModalIsVisible}
            setFormValue={this.state.editFormValue}
            formItemList={this.newItemFormList}
            saveClicked={this.modalSaveClicked}
            cancelClicked={this._hideAppModal}
          >
            <Row className='line-height40'>
              <Col span={8} className='text-right'>
                <span className='label-color'>所属企业：</span>
              </Col>
              <Col span={16}>
                {this.state.cacheCompanyName}
              </Col>
            </Row>
          </SubmitForm>
        </Modal>

        <AcountInOutModal
          banlance={this.state.selectAppBalance}
          appId={this.state.selectAppId}
          visible={this.state.inOutModalIsVisible}
          onCancel={this._hideInoutModal}
          onOk={this._hideInoutModal}
        />

        <Modal maskClosable={false}
          width={700}
          visible={this.state.secretModalIsVisible}
          titile='查看key'
          onCancel={this._hideSecretModal}
          footer={null}
        >
          <div className='middle-center padding20'>
            {
              this.state.selectData ?
                <div className='line-height30' style={{ width: "100%" }}>
                  <Row className='line-height30 margin-bottom20'>
                    <Col span={6} className='text-right label'>
                      AppID：
                    </Col>
                    <Col span={18}>
                      {this.state.selectData.appId}
                    </Col>
                  </Row>
                  <Row className='line-height30 margin-bottom20'>
                    <Col span={6} className='text-right label'>
                      AppSecret：
                    </Col>
                    <Col span={18}>
                      {
                        this.state.isResetStatus && this.state.secretKey ?
                          <div>
                            <div className='flex'>
                              <div className='padding-left margin-right'>{this.state.secretKey} </div>
                              <CopyToClipboard text={this.state.secretKey}
                                onCopy={() => { this.onCopiedClicked() }}>
                                <a style={{ cursor: "pointer" }}>复制</a>
                              </CopyToClipboard>
                            </div>
                            <div className='line-height20 color-red'>为保障帐号安全，溯源系统将不再储存AppSecret；如果遗忘，请重置</div>
                          </div>
                          :
                          <Popconfirm
                            placement="bottomLeft" title='您确定要重置吗？重置后原Secret将失效'
                            onConfirm={() => { this.resetSecretClicked() }} >
                            <Button type='primary' >
                              重置Secret
                            </Button>
                          </Popconfirm>
                      }

                    </Col>
                  </Row>

                </div> : null
            }
          </div>
          <div className='text-right margin-top20'>
            <Button type='primary' onClick={this._hideSecretModal}>关闭</Button>
          </div>
        </Modal >
      </CommonPage >
    )
  }
}
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));


