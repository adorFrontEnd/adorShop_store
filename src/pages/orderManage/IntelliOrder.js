import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import UserSelectModal from '../../components/order/UserSelectModal';

const _title = "智能下单";
const _description = '';

class Page extends Component {

  state = {
    userModalIsVisible: false
  }

  componentDidMount() {

  }



  _showUserModal = () => {
    this.setState({
      userModalIsVisible: true
    })
  }

  _hideUserModal = () => {
    this.setState({
      userModalIsVisible: true
    })
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <Input.TextArea style={{ minHeight: 160, width: 700 }}></Input.TextArea>
        </div>

        <div className='margin-top'><Button type='primary'>智能识别</Button></div>

        <div className='margin-top20'>
          <div className='line-height40 font-20 color333'>基本信息</div>
          <div>
            <span>兰鹏飞</span>
            <span className='margin0-10'>18888888888</span>
            <a onClick={this._showUserModal}>选择会员</a>
            <span className='margin0-10'>--</span><a>选择业务员</a></div>
        </div>

        <UserSelectModal
          visible={this.state.userModalIsVisible}
          onCancel={this._hideUserModal}
        />
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