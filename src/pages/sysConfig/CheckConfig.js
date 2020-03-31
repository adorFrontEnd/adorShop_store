import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";
import { getAuditConfig, updateConfig } from '../../api/sysConfig/sysConfig'
import Toast from '../../utils/toast';
const _title = "审核配置";

class Page extends Component {

  state = {
    swichStatus: false,
    pageData: null
  }

  componentDidMount() {
    this.getPageData()
  }
  getPageData = () => {
    getAuditConfig()
      .then(pageData => {
        if (pageData.status == 0) {
          this.setState({ swichStatus: false })
        } else {
          this.setState({ swichStatus: true })
        }
        this.setState({
          pageData
        })

      })
  }


  onSyncStatusChange = (swichStatus) => {
    let { pageData } = this.state
    let title = swichStatus ? "开启" : "关闭";
    let status = swichStatus ? 1 : 0
    updateConfig({ status, id: pageData.id })
      .then(data => {
        Toast(`${title}审核配置成功！`);
        this.getPageData()
      })

    this.setState({
      swichStatus
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage path='sysConfig.checkConfig.checkConfig' title={_title} >

        <div className='line-height40'>
          <span className='margin-right20'>开启自动审单</span>
          <Switch checked={this.state.swichStatus} onChange={this.onSyncStatusChange} />
        </div>

      </CommonPage>
    )
  }

}

export default Form.create()(Page);