import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal } from "antd";

import Toast from '../../utils/toast';
const _title = "支付配置";

class Page extends Component {

  state = {
  
  }

  componentDidMount() {
  }


  

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
       
      </CommonPage>
    )
  }

}

export default Form.create()(Page);