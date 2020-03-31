import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Spin, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { getGradeDetail, createAndUpdateGrade, deleteGrade } from '../../api/user/grade';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';

const _title = "客户级别";
const _description = "";

class Page extends Component {

  state = {
    purchaseMethod: 0,
    gradeDataArr: [],
    gradeSwitchStatus: false,
    showLoading: false
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }

  /******页面数据操作****************************************************************************************************************** */


  // 获取页面列表
  getPageData = () => {

    this.setState({
      showLoading: true
    })
    getGradeDetail().then(res => {

      this.setState({
        showLoading: false
      })

      if (!res) {
        return;
      }
      let { list, purchaseMethod, gradeSwitch } = res;
      let gradeSwitchStatus = gradeSwitch == '0';
      let gradeDataArr = list.map(item => {
        let { id, gradeName, term, money } = item;
        return {
          id, gradeName, term, money
        }
      });
      this.setState({
        gradeDataArr, purchaseMethod, gradeSwitchStatus
      })
    })
      .catch(() => {
        this.setState({
          showLoading: false
        })
      })
  }

  deleteGrade = (id) => {
    if (!id) {
      return;
    }
    deleteGrade({ id })
      .then(() => {
        Toast('删除成功！');
        this.getPageData();
      })
  }

  //保存页面诗句
  saveDataClicked = () => {
    let { gradeDataArr, purchaseMethod, gradeSwitchStatus } = this.state;
    if (!this.gradeDataArrValidate(gradeDataArr)) {
      return;
    }
    let params = {
      data: JSON.stringify(gradeDataArr),
      purchaseMethod,
      gradeSwitch: gradeSwitchStatus ? "0" : "1"
    }

    this.setState({
      showLoading: true
    })

    createAndUpdateGrade(params)
      .then(() => {
        this.setState({
          showLoading: false
        })
        Toast("保存成功！");
      })
      .catch(() => {
        this.setState({
          showLoading: false
        })
      })
  }

  /**************************************************************************************** */



  onpurchaseMethodChange = (e) => {
    let purchaseMethod = e.target.value;
    this.setState({
      purchaseMethod
    })
  }

  onGradeDataChange = (action, index) => {
    let gradeDataArr = this.state.gradeDataArr;
    switch (action) {

      default:
      case "add":
        gradeDataArr.push({
          id: null,
          gradeName: null,
          term: 0,
          money: 0
        })
        break;

      case "delete":
        if (!gradeDataArr[index].id) {
          gradeDataArr.splice(index, 1);
        } else {
          this.deleteGrade(gradeDataArr[index].id);
        }
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


  gradeSwitchStatusChange = (gradeSwitchStatus) => {
    this.setState({
      gradeSwitchStatus
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
      if (!item.gradeName) {
        Toast(`请设置第${i + 1}条数据级别名称！`);
        return;
      }

      if (!item.money || item.money <= 0) {
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
      <CommonPage path='user.userManage.userGrade' title={_title} description={_description} >

        <div>
          <Spin spinning={this.state.showLoading}>
            <Button type='primary' className='normal' onClick={this.saveDataClicked}>保存</Button>
            <div className="flex-middle margin10-0">
              <span>上级级别不小于下级级别：</span>
              <Checkbox checked={this.state.gradeSwitchStatus} onChange={(e) => this.gradeSwitchStatusChange(e.target.checked)}>开启</Checkbox>
              <span className='margin-left color-red'>存在用户上级级别大于下级级别的情况将无法开启</span>
            </div>
            <div className='color-red'>
              指等级发生变化后是否需要保持上级的等级不低于自身的等级<br />
              开启后等级提升时，如果自身等级大于原上级，则依次查找原上级的各个上级，直到这个上级的等级不小于提升后的等级；<br />
              同理开启后等级下降，如果自身等级小于了某个下级的等级，则将此下级的上级设为下降等级客户的上级。<br />
            </div>
            <div className="flex margin20-0">
              <div style={{minWidth:270}}>
                <span>进货方式：</span>
                <Radio.Group value={this.state.purchaseMethod} onChange={this.onpurchaseMethodChange}>
                  <Radio value={0}>平台进货</Radio>
                  <Radio value={1}> 上级进货</Radio>
                </Radio.Group>
              </div>
              <span className='margin-left color-red'>选择上级进货时如果上级等级比自身低，则找最近的比自身等级高的上级（即上级的某个上级）进行进货</span>
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
                          <Input onChange={(e) => this.onGradeDataKeyChange('gradeName', index, e.target.value)} placeholder='请输入' style={{ width: 200 }} value={item.gradeName} />
                        </div>
                        <div className='flex-middle'>
                          <Select style={{ width: 100, marginRight: "10px" }} onChange={(e) => this.onGradeDataKeyChange('term', index, e)} value={item.term}>
                            <Select.Option value={0}>每月</Select.Option>
                            <Select.Option value={1}>每年</Select.Option>
                          </Select>
                          <span>消费额：</span>
                          <InputNumber onChange={(e) => this.onGradeDataKeyChange('money', index, e)} value={item.money} precision={2} min={0} style={{ width: 120 }} />
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
          </Spin>
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