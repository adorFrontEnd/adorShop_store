import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchAttentionList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';

const _title = "客户级别";
const _description = "";
const integralRecordPath = routerConfig["user.userManage.userList"].path;
const giftRecordPath = routerConfig["user.userManage.userList"].path;
const settingDrainagePath = routerConfig["user.userManage.userList"].path;

class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    purchaseWay:"1"
  }

  componentDidMount() {
    this.props.changeRoute({ path: 'user.userManage.userGrade', title: '客户级别', parentTitle: '会员管理' });

  }

  goIntegralRecord = () => {
    let title = '积分记录';
    this.props.changeRoute({ path: 'marketManage.integralRecord', title, parentTitle: '市场营销' });
  }

  goGiftRecord = () => {
    let title = '兑奖记录';
    this.props.changeRoute({ path: 'marketManage.giftRecord', title, parentTitle: '市场营销' });
  }

  params = {
    page: 1
  }

  /******查询表单操作****************************************************************************************************************** */


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchAttentionList().then(res => {

    })
      .catch(() => {

      })
  }

  /**************************************************************************************** */



  onPurchaseWayChange = (e)=>{
    let purchaseWay = e.target.value;
    this.setState({
      purchaseWay
    })
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <div className="flex-middle margin10-0">
            <span>上级级别不小于下级级别：</span>
            <Checkbox >开启</Checkbox>
            <span className='margin-left color-red'>存在用户上级级别大于下级级别的情况将无法开启</span>
          </div>
          <div className='color-red'>
            指等级发生变化后是否需要保持上级的等级不低于自身的等级<br/>  
            开启后等级提升时，如果自身等级大于原上级，则依次查找原上级的各个上级，直到这个上级的等级不小于提升后的等级；<br/>  
            同理开启后等级下降，如果自身等级小于了某个下级的等级，则将此下级的上级设为下降等级客户的上级。<br/>
          </div>
          <div className="flex-middle margin20-0">
            <span>进货方式：</span>
            <Radio.Group value={this.state.purchaseWay} onChange={this.onPurchaseWayChange}>
              <Radio value="1">平台进货</Radio>
              <Radio value="2"> 上级进货</Radio>
            </Radio.Group>
            <span className='margin-left color-red'>存在用户上级级别大于下级级别的情况将无法开启</span>
          </div>
          <div className='color-gray'>级别从上到下依次降低，该级别存在用户时无法删除</div>
          <div>

          </div>
        </div>
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