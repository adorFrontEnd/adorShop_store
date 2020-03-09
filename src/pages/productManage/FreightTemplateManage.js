import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio, Switch } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { examinationPassed, adjustmentAmount, searchSettlementAuditList, exportSettlementAudit } from '../../api/settlement';
import { SearchForm, SubmitForm } from '../../components/common-form';

import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';
import AreaAndDisctrictSelectModal from '../../components/areaSelect/AreaAndDisctrictSelectModal';

const freightTemplateEditPath = routerConfig["productManage.other.freightTemplateEdit"].path;

const _title = "运费模板";
class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    companyList: null,
    freightType: "0",
    AreaAndDisctrictSelectModalVisible: false
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchSettlementAuditList(this.params).then(res => {
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
  passedClicked = (record) => {
    let { id } = record;
    examinationPassed({ id })
      .then(() => {
        this.getPageData()
      })
  }


  exportSettlementClick = (record) => {
    let { id } = record;
    exportSettlementAudit({ id })
  }

  // 表格相关列
  columns = [
    { title: "模板名称", dataIndex: "createTime", render: data => data => data || "--" },
    { title: "计费方式", dataIndex: "autoSettlementAmount", render: data => data || "--" },
    { title: "创建时间", dataIndex: "manualSettlementAmount", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: "操作",
      render: (text, record, index) => (
        <span>
          <a target='_blank' size="small" onClick={() => { this.editItem(record) }} >修改</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要禁用吗？'
            onConfirm={() => { this.deleteItem(record) }}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    },


  ]


  /**搜索，过滤 *******************************************************************************************************************************/
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();

    let { time, nameParam } = params;
    if (time && time.length) {
      let [startTime, stopTime] = time;
      let startCreateTimeStamp = startTime ? dateUtil.getDayStartStamp(Date.parse(startTime)) : null;
      let endCreateTimeStamp = stopTime ? dateUtil.getDayStopStamp(Date.parse(stopTime)) : null;
      this.params = {
        ...params,
        startCreateTimeStamp,
        endCreateTimeStamp,
        time: null
      }
    } else {
      this.params = {
        ...params,
        time: null
      }
    }
    this.params.page = 1;
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  showAreaAndDisctrictSelectModal = () => {
    this.setState({
      AreaAndDisctrictSelectModalVisible: true
    })
  }

  hideAreaAndDisctrictSelectModal = () => {
    this.setState({
      AreaAndDisctrictSelectModalVisible: false
    })
  }

  onSaveClick = (selectAreaList) => {
    let selectAreaIds = this.getSelectAreaListLevel2Ids(selectAreaList);
    let selectAreaNames = this.getSelectAreaListName(selectAreaList)
    this.setState({
      selectAreaList,
      selectAreaIds,
      selectAreaNames
    })
  }


  onFreightTypeChange = (e) => {
    let freightType = e.target.value;
    this.setState({
      freightType
    })
  }

  addFreightTemplate = (id) => {
    let title = id == '0' ? '新建模板' : "编辑模板"
    this.props.changeRoute({ path: 'productManage.other.freightTemplateEdit', title: '运费模板', parentTitle: '其他' });
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;


    return (
      <CommonPage title={_title} >
        <div className='margin10-0' >
          <div className='line-height40 flex-between align-center bgcolorF2F2F2 padding border-radius'>
            <div>
              <div>启用后，买家下单可以选择快递发货，由你安排快递送货上门。</div>
              <div>计费方式：
              <Radio.Group value={this.state.freightType} onChange={this.onFreightTypeChange}>
                  <Radio value='0'>按商品累加运费</Radio>
                  <Radio value='1'>组合运费（推荐使用）</Radio>
                </Radio.Group>
              </div>
            </div>
            <div className='margin-right20'>
              <Switch />
            </div>
          </div>
        </div>
        <div className='padding10-0'>
          <NavLink to={freightTemplateEditPath + "/0"}>
            <Button type='primary' onClick={()=>this.addFreightTemplate('0')}>新建运费模板</Button>
          </NavLink>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
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


