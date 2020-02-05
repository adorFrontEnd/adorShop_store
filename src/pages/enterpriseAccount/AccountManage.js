import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Tabs, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio, Spin } from "antd";
import { getBalance, getDetail, saveOrUpdate, searchWithdrawApplicationList, withdrawApplicationReq, companyRecharge } from '../../api/accountManage';
import Toast from "../../utils/toast";
import WithdrawApplicationList from './WithdrawApplicationList';
import numberFilter from '../../utils/filter/number';
import FuncComponent from './FunComponent';
const _title = "账户管理";
class Page extends Component {

  state = {

  }

  componentDidMount() {

  }



  render() {
    return (
      <CommonPage title={_title} >
        <FuncComponent />
      </CommonPage>
    )
  }

}

export default Form.create()(Page);