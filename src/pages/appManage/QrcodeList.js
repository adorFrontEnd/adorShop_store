import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { searchQrCodeList, updateQrcodeStatus, saveOrUpdateQrcode, searchUserById, getQRCodeUrl } from '../../api/appManage';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import AcountInOutModal from './AccountInOutModal';
import dateUtil from '../../utils/dateUtil';
import { parseUrl } from '../../utils/urlUtils';
import { getCacheUserInfo } from '../../middleware/localStorage/login';


const _title = "应用二维码";
class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    qrcodeModalIsVisible: false,
    inputAccount: null,
    cacheUserInfo: null,
    inputRemark: null,
    selectUserId: null,
    appId: null,
    userList: null
  }

  componentDidMount() {
    this.getPageData();
    this.getCacheUserInfo();
    this.props.changeRoute({ path: 'appManage.qrcodeList', title: "应用二维码", parentTitle: '应用管理' });
  }

  params = {
    page: 1
  }


  getUrlAppId = () => {
    let urlParams = parseUrl(this.props.location.search);
    if (urlParams && urlParams.args && urlParams.args.appId) {
      return urlParams.args.appId
    }
  }

  getCacheUserInfo = () => {
    let cacheUserInfo = getCacheUserInfo();

    this.setState({
      cacheUserInfo,
      selectUserId: 'self'
    })
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    let appId = null;
    if (!this.state.appId) {
      appId = this.getUrlAppId();
      this.setState({
        appId
      })
    } else {
      appId = this.state.appId;
    }
    let reqData = {
      ...this.params,
      appId
    }

    searchQrCodeList(reqData).then(res => {
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
    { title: "二维码", dataIndex: "qrcode", render: data => data ? <img style={{ width: 80, height: 80 }} src={getQRCodeUrl({ source: data })} /> : '--' },
    { title: "关联账号", dataIndex: "userAccount" },
    { title: "交易流水", dataIndex: "balance" },
    { title: "创建方式", dataIndex: "type", render: data => data == '1' ? "接口创建" : "手工创建" },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "备注", dataIndex: "remark", render: data => data || '--' },
    { title: "状态", dataIndex: "status", render: data => data == '1' ? "可使用" : "禁用" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.status == '1' ?
              <Popconfirm
                placement="topLeft" title='确认要作废吗？'
                onConfirm={() => { this.disabledQrcode(record) }} >
                <a size="small" className="color-red">作废</a>
              </Popconfirm>
              :
              <a size="small" onClick={() => { this.disabledQrcode(record) }} >启用</a>
          }
        </span>
      )
    }
  ]

  // 禁用账户
  disabledQrcode = (record) => {
    let { id } = record;
    let status = record.status == '1' ? "0" : "1";
    let title = record.status == '1' ? "作废成功！" : "启用成功！";
    updateQrcodeStatus({ id, status })
      .then(() => {
        Toast(title);
        this.getPageData();
      })
  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { id } = params;

    this.params = {
      id: id || null,
      page: 1
    }

    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  goEditBack = () => {
    window.history.back();
  }
  /**查看收支******************************************************************************************************************************/
  showInoutModalClicked = (record) => {
    this._showInoutModal();
  }

  _showInoutModal = () => {
    this.setState({
      inOutModalIsVisible: true
    })
  }

  _hideInoutModal = () => {
    this.setState({
      inOutModalIsVisible: false
    })
  }
  /**新建二维码 ****************************************************************************************************************************/
  createQrcdeClicked = () => {
    this.setState({
      qrcodeModalIsVisible: true
    })
  }

  _hideQrcdeModal = () => {
    this.setState({
      qrcodeModalIsVisible: false
    })
  }

  qrcodeModalConfirm = () => {
    let remark = this.state.inputRemark;
    let { companyUserId } = this.state.cacheUserInfo;
    let { appId, selectUserId } = this.state;

    let userAccount = selectUserId == "self" ? companyUserId : selectUserId;
    if (!userAccount) {
      Toast("请选择相关账户！");
      return;
    }

    saveOrUpdateQrcode({
      userAccount,
      remark,
      appId
    })
      .then(() => {
        Toast("新建成功！");
        this._hideQrcdeModal();
        this.getPageData();
      })

  }

  onInputAccountChange = (e) => {
    let inputAccount = e.currentTarget.value;
    this.setState({
      inputAccount
    })
  }

  searchUserByIdClicked = () => {
    let id = this.state.inputAccount;
    if (!id) {
      Toast('请输入用户账号搜索！');
      return;
    }

    searchUserById({ id })
      .then(data => {
        let userList = data.filter(item => Boolean(item.name))
        this.setState({
          userList
        })
      })
  }


  onInputRemarkChange = (e) => {
    let inputRemark = e.currentTarget.value;
    this.setState({
      inputRemark
    })
  }

  onSelectUserIdChange = (e) => {

    let selectUserId = e.target.value;
    this.setState({
      selectUserId
    })
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage title={_title} >
        <div className='margin10-0' >
          <div className='margin-bottom'>
            <Button type='primary' style={{ width: 100 }} className='margin-right20 yellow-btn' onClick={this.goEditBack}>返回</Button>
          </div>
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="appName"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='关联账号：'
                >
                  {
                    getFieldDecorator('appName', {
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
                  label='交易金额：'
                  field='amount'>

                  <Input.Group compact style={{ width: 240 }}>
                    <InputNumber style={{ width: 106, textAlign: 'center' }} />
                    <InputNumber
                      style={{
                        width: 30,
                        pointerEvents: 'none',
                        backgroundColor: '#fff',
                      }}
                      placeholder="~"
                      disabled
                    />
                    <InputNumber style={{ width: 106, textAlign: 'center' }} />
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

            <Row className="margin-top margin-bottom">
              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='APP_ID'
                  field='time'>
                  {
                    getFieldDecorator('appId', {
                    })(
                      <Input allowClear placeholder="输入appId" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='padding10-0'>
          <Button className='normal' type='primary' onClick={this.createQrcdeClicked}>新建二维码</Button>
          <Button className='normal margin0-10' type='primary' onClick={this.searchClicked}>筛选</Button>
          <Button onClick={this.resetClicked}>清除所有筛选</Button>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />
        <AcountInOutModal
          visible={this.state.inOutModalIsVisible}
          onCancel={this._hideInoutModal}
        />

        <Modal
          maskClosable={false}
          title='创建二维码'
          visible={this.state.qrcodeModalIsVisible}
          onCancel={this._hideQrcdeModal}
          onOk={this.qrcodeModalConfirm}
        >
          <Row className='line-height40 margin-top20'>
            <Col span={24} >
              <span className='label-color'>查询绑定相关账号（本企业及本企业应用相关会员）：</span>
            </Col>
            <Col span={24}>
              <Input
                allowClear
                style={{ width: 300 }}
                value={this.state.inputAccount}
                onChange={this.onInputAccountChange}
                placeholder='输入完整账号查询'
              />
              <Button onClick={this.searchUserByIdClicked} className='normal margin-left' type='primary'>查询</Button>
            </Col>
            <Col span={24}>

              <div>
                <Radio.Group value={this.state.selectUserId} onChange={this.onSelectUserIdChange}>
                  <Radio value='self'>本企业</Radio>
                  {
                    this.state.userList && this.state.userList.length ?
                      this.state.userList.map(item =>
                        <Radio key={item.id} value={item.id}>{item.name}</Radio>
                      )
                      : null
                  }
                </Radio.Group>
              </div>
            </Col>

            <Col span={24} >
              <span className='label-color'>填写备注：</span>
            </Col>
            <Col span={24}>
              <Input.TextArea
                style={{ width: "100%", minHeight: "200px" }}
                value={this.state.inputRemark}
                onChange={this.onInputRemarkChange}
                placeholder='填写备注'
              />

            </Col>
          </Row>
        </Modal>
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


