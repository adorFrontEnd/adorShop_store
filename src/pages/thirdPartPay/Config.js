import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Tabs, Col, Switch, Row, Icon, Button, Divider, Popconfirm, Modal, Spin, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import WechatPayConfig from './WechatPayConfig';
import AliPayConfig from './AliPayConfig';
import UnionPayConfig from './UnionPayConfig';
import { getPayConfigDetail, saveOrUpdatePayConfig, getAisleConfigDetail, saveOrUpdateAisleConfig } from '../../api/thirdPartPay';
import Toast from '../../utils/toast';
import { isSpecAuthExistByName } from '../../middleware/localStorage/cacheAuth';

const _title = "支付配置";

class Page extends Component {

  state = {
    wechatPayConfig: null,
    aliPayConfig: null,
    unionPayConfig: null,
    configLoading: false,
    wechatStatus: false,
    aliStatus: false,
    unionStatus: false,
    payAisle: "0",
    billingLogic: "0",
    payAisleConfig: null,
    hasNativePayConfigAuth: false
  }

  onMainTabsChange = (type) => {
    switch (type) {
      case "1":
        this.getPayConfigDetail("1", true);
        break;

      case "2":
        this.getAisleConfigDetail()
        break;
    }
  }

  componentDidMount() {

    let hasNativePayConfigAuth = !!isSpecAuthExistByName("nativePayConfig");

    this.setState({
      hasNativePayConfigAuth
    })

    if (!hasNativePayConfigAuth) {
      return;
    }

    this.getPayConfigDetail("1");
  }

  onPayTabsChange = (type) => {
    this.getPayConfigDetail(type);
  }

  getPayConfigDetail = (type, isReset) => {

    this.setState({
      configLoading: true
    })

    getPayConfigDetail({ type })
      .then(res => {

        let data = {
          configLoading: false
        };
        let status = !!(res && (res.status == '1'));
        if (isReset) {
          res._s = Date.now();
        }
        switch (type) {
          case "1":

            data.wechatPayConfig = res;
            data.wechatStatus = status;
            break;

          case "2":
            data.aliPayConfig = res;
            data.aliStatus = status;

            break;

          case "3":
            data.unionPayConfig = res;
            data.unionStatus = status;

            break;
        }

        this.setState(data)
      })
      .catch(() => {
        this.setState({
          configLoading: false
        })
      })
  }

  /*微信支付************************************************************************************************/

  resetWechat = () => {
    this.getPayConfigDetail("1", true);
  }

  // 微信的配置保存
  wechatPayConfigSave = (data) => {

    let id = null;
    if (this.state.wechatPayConfig) {
      id = this.state.wechatPayConfig.id;
    }

    saveOrUpdatePayConfig({ ...data, type: 1, id, status: "1" })
      .then(() => {
        Toast('保存成功！');
      })
  }

  wechatStatusRevert = (wechatStatus) => {

    this.setState({
      wechatStatus
    })

    let status = wechatStatus ? "1" : "2";
    let wechatPayConfig = this.state.wechatPayConfig;
    if (wechatPayConfig && wechatPayConfig.id) {
      saveOrUpdatePayConfig({ status, type: 1, id: wechatPayConfig.id })
        .then(() => {
          Toast(`${wechatStatus ? "打开" : "关闭"}微信支付成功！`);
        })
    }
  }

  /*支付宝支付************************************************************************************************/

  resetAli = () => {
    this.getPayConfigDetail("2", true);
  }

  // 支付宝的配置保存
  aliPayConfigSave = (data) => {

    let id = null;
    if (this.state.aliPayConfig) {
      id = this.state.aliPayConfig.id;
    }

    saveOrUpdatePayConfig({ ...data, type: 2, id, status: "1" })
      .then(() => {
        Toast('保存成功！');
      })
  }

  aliStatusRevert = (aliStatus) => {

    this.setState({
      aliStatus
    })

    let status = aliStatus ? "1" : "2";
    let aliPayConfig = this.state.aliPayConfig;
    if (aliPayConfig && aliPayConfig.id) {
      saveOrUpdatePayConfig({ status, type: 2, id: aliPayConfig.id })
        .then(() => {
          Toast(`${aliStatus ? "打开" : "关闭"}支付宝支付成功！`);
        })
    }
  }


  /*银联支付************************************************************************************************/

  resetUnion = () => {
    this.getPayConfigDetail("3", true);
  }

  // 银联的配置保存
  unionPayConfigSave = (data) => {

    let id = null;
    if (this.state.unionPayConfig) {
      id = this.state.unionPayConfig.id;
    }

    saveOrUpdatePayConfig({ ...data, type: 3, id, status: "1" })
      .then(() => {
        Toast('保存成功！');
      })
  }

  unionStatusRevert = (unionStatus) => {

    this.setState({
      unionStatus
    })

    let status = unionStatus ? "1" : "2";
    let unionPayConfig = this.state.unionPayConfig;
    if (unionPayConfig && unionPayConfig.id) {
      saveOrUpdatePayConfig({ status, type: 3, id: unionPayConfig.id })
        .then(() => {
          Toast(`${unionStatus ? "打开" : "关闭"}银联支付成功！`);
        })
    }
  }



  render() {

    const { getFieldDecorator } = this.props.form;
    const { hasNativePayConfigAuth } = this.state;

    return (
      <CommonPage title={_title} >
        {
          hasNativePayConfigAuth ?
            <Tabs tabPosition='left' onChange={this.onMainTabsChange} type="card">
              <Tabs.TabPane tab="原生支付配置" key="1">
                <div style={{ borderLeft: "1px solid #e8e8e8", minHeight: "50vh" }}>
                  <Spin spinning={this.state.configLoading}>
                    <Tabs onChange={this.onPayTabsChange} type="card" style={{ marginLeft: '-1px' }}>
                      <Tabs.TabPane tab="微信支付" key="1">
                        <div className='padding'>
                          <div className='flex align-center'>
                            <img className='margin0-10' src='/image/wxpay.png' style={{ height: 30, width: 30 }} />
                            <span className='line-height40 font-18 font-bold'>微信支付配置</span>
                          </div>
                          <div className='padding margin-left20'>
                            <span className='margin-right'>开启微信支付</span><Switch checked={this.state.wechatStatus} onChange={this.wechatStatusRevert} />
                          </div>
                          {
                            this.state.wechatStatus ?
                              <WechatPayConfig
                                resetData={this.resetWechat}
                                config={this.state.wechatPayConfig}
                                saveClick={this.wechatPayConfigSave}
                              />
                              :
                              null
                          }

                        </div>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="支付宝支付" key="2">
                        <div className='padding'>
                          <div className='flex align-center'>
                            <img className='margin0-10' src='/image/alipay.png' style={{ height: 30, width: 30 }} />
                            <span className='line-height40 font-18 font-bold'>支付宝支付配置</span>
                          </div>
                          <div className='padding margin-left20'>
                            <span className='margin-right'>开启支付宝支付</span><Switch checked={this.state.aliStatus} onChange={this.aliStatusRevert} />
                          </div>
                          {
                            this.state.aliStatus ?
                              <AliPayConfig
                                resetData={this.resetAli}
                                config={this.state.aliPayConfig}
                                saveClick={this.aliPayConfigSave}
                              />
                              :
                              null
                          }

                        </div>
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="银联支付" key="3">
                        <div className='padding'>
                          <div className='flex align-center'>
                            <img className='margin0-10' src='/image/unionPay.jpg' style={{ height: 40, width: "auto" }} />
                            <span className='line-height40 font-18 font-bold'>银联支付配置</span>
                          </div>
                          <div className='padding margin-left20'>
                            <span className='margin-right'>开启银联支付</span><Switch checked={this.state.unionStatus} onChange={this.unionStatusRevert} />
                          </div>
                          {
                            this.state.unionStatus ?
                              <UnionPayConfig
                                resetData={this.resetUnion}
                                config={this.state.unionPayConfig}
                                saveClick={this.unionPayConfigSave}
                              />
                              :
                              null
                          }

                        </div>
                      </Tabs.TabPane>
                    </Tabs>
                  </Spin>
                </div>
              </Tabs.TabPane>
            </Tabs>
            :
            <div className='line-height40 padding20 font-20'>
              暂无权限，请联系超级管理员
            </div>
        }

      </CommonPage>
    )
  }

}

export default Form.create()(Page);