import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";

import Toast from '../../utils/toast';
const _title = "审核配置";

class Page extends Component {

  state = {
    status: false,
    pageData: null
  }

  componentDidMount() {
  }


  onSyncStatusChange = (status) => {

    let title = status ? "开启" : "关闭";
    Toast(`${title}审核配置成功！`);

    this.setState({
      status
    })
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <>
          <>
            <div className='line-height40'>
              <span className='margin-right20'>开启自动审单</span>
              <Switch checked={this.state.status} onChange={this.onSyncStatusChange} />
            </div>
          </>

        </>
      </CommonPage>
    )
  }

}

export default Form.create()(Page);