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

class Page extends Component {

  state = {
    purchaseWay: "1",
    gradeDataArr: [],
    gradeLimit: false
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

  /******页面数据操作****************************************************************************************************************** */


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchAttentionList().then(res => {

    })
      .catch(() => {

      })
  }

  //保存页面诗句
  saveDataClicked = () => {
    let { gradeDataArr, purchaseWay, gradeLimit } = this.state;
    if(!this.gradeDataArrValidate(gradeDataArr)){
      return;
    }
    console.log({ gradeDataArr, purchaseWay, gradeLimit })
  }

  /**************************************************************************************** */



  onPurchaseWayChange = (e) => {
    let purchaseWay = e.target.value;
    this.setState({
      purchaseWay
    })
  }

  onGradeDataChange = (action, index) => {
    let gradeDataArr = this.state.gradeDataArr;
    switch (action) {

      default:
      case "add":
        gradeDataArr.push({
          name: null,
          timeType: "1",
          value: 0
        })
        break;

      case "delete":
        gradeDataArr.splice(index, 1);
        break;
    }
    this.setState({
      gradeDataArr
    })
  }

  onGradeDataKeyChange = (key, index, value) => {

    let gradeDataArr = this.state.gradeDataArr;
    gradeDataArr[index][key] = value;
    this.setState({
      gradeDataArr
    })
  }


  gradeLimitChange = (gradeLimit) => {
    this.setState({
      gradeLimit
    })
  }

  /**数据验证*****************************/

  gradeDataArrValidate = (gradeDataArr) => {
    if (!gradeDataArr || !gradeDataArr.length) {
      Toast("请设置级别！");
      return;
    }

    for (let i = 0; i < gradeDataArr.length; i++) {
      let item = gradeDataArr[i];
      if (!item.name) {
        Toast(`请设置第${i + 1}条数据级别名称！`);
        return;       
      }

      if (!item.amount || item.amount <= 0) {
        Toast(`请设置第${i + 1}条数据消费额！`);
        return;
      }
    }
    return true;
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} description={_description} >

        <div>
          <Button type='primary' className='normal' onClick={this.saveDataClicked}>保存</Button>
          <div className="flex-middle margin10-0">
            <span>上级级别不小于下级级别：</span>
            <Checkbox checked={this.state.gradeLimit} onChange={(e) => this.gradeLimitChange(e.target.checked)}>开启</Checkbox>
            <span className='margin-left color-red'>存在用户上级级别大于下级级别的情况将无法开启</span>
          </div>
          <div className='color-red'>
            指等级发生变化后是否需要保持上级的等级不低于自身的等级<br />
            开启后等级提升时，如果自身等级大于原上级，则依次查找原上级的各个上级，直到这个上级的等级不小于提升后的等级；<br />
            同理开启后等级下降，如果自身等级小于了某个下级的等级，则将此下级的上级设为下降等级客户的上级。<br />
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
          <div className='line-height40' style={{ width: 700 }}>
            <div className='bgcolorF4F4F4 border-bottom padding0-10 flex' >
              <div style={{ width: 300 }}>级别名称</div>
              <div>门槛条件</div>
            </div>
            {
              this.state.gradeDataArr && this.state.gradeDataArr.length ?
                this.state.gradeDataArr.map((item, index) =>

                  (
                    <div key={index} className='padding flex' style={{ border: "1px solid #f2f2f2", borderTop: "none" }}>
                      <div style={{ width: 300 }}>
                        <Input onChange={(e) => this.onGradeDataKeyChange('name', index, e.target.value)} placeholder='请输入' style={{ width: 200 }} value={item.name} />
                      </div>
                      <div className='flex-middle'>
                        <Select style={{ width: 100, marginRight: "10px" }} onChange={(e) => this.onGradeDataKeyChange('timeType', index, e)} value={item.timeType}>
                          <Select.Option value="1">每月</Select.Option>
                          <Select.Option value="2">每年</Select.Option>
                        </Select>
                        <span>消费额：</span>
                        <InputNumber onChange={(e) => this.onGradeDataKeyChange('amount', index, e)} value={item.amount} precision={2} min={0} style={{ width: 120 }} />
                        <span>元</span>
                        <Popconfirm
                          placement="topLeft" title='确认要删除吗？'
                          onConfirm={() => { this.onGradeDataChange('delete', index) }} >
                          <Icon className='font-24 color-red margin-left' type='delete' />
                        </Popconfirm>
                      </div>
                    </div>
                  )
                )
                :
                <div className='text-center' style={{ border: "1px solid #f2f2f2", borderTop: "none" }}>暂无数据</div>
            }
          </div>
          <Button onClick={() => this.onGradeDataChange('add')} className='margin-top normal' type='primary'>添加级别</Button>

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