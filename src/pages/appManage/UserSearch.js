import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { searchUserList, updateUserStatus, userTransfer } from '../../api/appManage';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import AcountInOutModal from './AccountInOutModal';
import dateUtil from '../../utils/dateUtil';
import { parseUrl } from '../../utils/urlUtils';
import { md5 } from "../../utils/signMD5";

const _title = "会员查询";
class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    selectUserBalance: null,
    selectUserId: null,
    appName: null
  }

  componentDidMount() {
    this.getPageData();
    this.props.changeRoute({ path: 'appManage.userSearch', title: "会员查询", parentTitle: '应用管理' });
    this.setAppName();
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

  setAppName = () => {
    let urlParams = parseUrl(this.props.location.search);
    if (urlParams && urlParams.args && urlParams.args.appName) {
      let appName = urlParams.args.appName;
      this.setState({
        appName
      })
    }
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

    searchUserList(reqData).then(res => {
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

    { title: "用户ID", dataIndex: "id" },
    { title: "用户昵称", dataIndex: "nickName", render: data => data || "--" },
    { title: "认证状态", dataIndex: "approveStatus", render: data => data == 2 ? "认证" : '未认证' },
    { title: "状态", dataIndex: "status", render: data => data == 1 ? "正常" : '禁用' },
    { title: "账户余额", dataIndex: "balance" },
    { title: "创建时间", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "备注", dataIndex: "remark", render: data => data || '--' },

    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <a onClick={() => this.showInoutModalClicked(record)}>查看收支</a>
          <Divider type="vertical" />
          {
            record.status == '1' ?
              <span>
                <a onClick={() => { this.showTransferModal(record) }}>转账</a>
                <Divider type="vertical" />
                <Popconfirm
                  placement="topLeft" title='确认要禁用吗？'
                  onConfirm={() => { this.disabledUser(record) }} >
                  <a size="small" className="color-red">禁用</a>
                </Popconfirm>
              </span>
              :
              <a onClick={() => { this.enabledUser(record) }}>启用</a>
          }

        </span>
      )
    }
  ]

  // 禁用账户
  disabledUser = (record) => {
    let { id } = record;
    updateUserStatus({ id, status: "0" })
      .then(() => {
        Toast("禁用完毕！");
        this.getPageData()
      })
  }

  // 禁用账户
  enabledUser = (record) => {
    let { id } = record;
    updateUserStatus({ id, status: "1" })
      .then(() => {
        Toast("启动完毕！");
        this.getPageData()
      })
  }

  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { idParam } = params;

    this.params = {
      idParam: idParam || null,
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
    this._showInoutModal(record);
  }

  _showInoutModal = (record) => {
    let { id, balance } = record;
    this.setState({
      selectUserId: id,
      selectUserBalance: balance

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

  onTransferModalOk = () => {
    let { id } = this.state.selectUser;
    let { transferAmount, transferPassword } = this.state;
    if (!transferAmount || transferAmount < 0) {
      Toast("请输入转账金额!");
      return;
    }

    if (!transferPassword) {
      Toast("请输入转账密码!");
      return;
    }
    let params = {
      amount: transferAmount,
      userId: id,
      password: md5(transferPassword)
    }
    userTransfer(params)
      .then(() => {
        this.setState({
          transferModalIsVisible: false
        })
        Toast("转账成功！");
        this.getPageData()
      })
  }

  showTransferModal = (record) => {
    this.setState({
      selectUser: record,
      transferModalIsVisible: true
    })
  }

  hideTransferModal = () => {
    this.setState({
      selectUser: null,
      transferModalIsVisible: false
    })
  }

  onInputAmountChange = (transferAmount) => {
    this.setState({
      transferAmount
    })
  }

  onInputPasswordChange = (e) => {
    let transferPassword = e.currentTarget.value;
    this.setState({
      transferPassword
    })
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage
        title={
          <div className='line-height40'>
            <span className='margin-right20 font-20 '>会员查询</span><span className='font-16'>{this.state.appName || ""}</span>
          </div>
        }
      >
        <div className='margin10-0' >
          <Button type='primary' style={{ width: 100 }} className='margin-right20 yellow-btn' onClick={this.goEditBack}>返回</Button>
        </div>
        <div className='margin10-0' >
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="idParam"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='用户id：'
                >
                  {
                    getFieldDecorator('idParam', {
                    })(
                      <Input allowClear placeholder="输入用户id" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </div>
        <div className='padding10-0'>
          <Button type='primary' className='normal' onClick={this.searchClicked}>筛选</Button>
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
        <AcountInOutModal
          banlance={this.state.selectUserBalance}
          userId={this.state.selectUserId}
          visible={this.state.inOutModalIsVisible}
          onCancel={this._hideInoutModal}
          onOk={this._hideInoutModal}
        />

        <Modal
          title='转账'
          visible={this.state.transferModalIsVisible}
          onCancel={this.hideTransferModal}
          onOk={this.onTransferModalOk}
        >
          <Row className='line-height40 margin-top20'>
            <Col span={8} >
              <span className='label-color text-right label-required'>转账金额：</span>
            </Col>
            <Col span={16}>
              <InputNumber
                precision={2}
                min={0}
                allowClear
                style={{ width: 300 }}
                value={this.state.transferAmount}
                onChange={this.onInputAmountChange}
                placeholder='填入转账金额'
              />

            </Col>
          </Row>
          <Row className='line-height40 margin-top20'>
            <Col span={8} >
              <span className='label-color text-right label-required'>企业账号支付密码：</span>
            </Col>
            <Col span={16}>
              <Input
                type='password'
                precision={2}
                allowClear
                style={{ width: 300 }}
                value={this.state.transferPassword}
                onChange={this.onInputPasswordChange}
                placeholder='填入转账密码'
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


