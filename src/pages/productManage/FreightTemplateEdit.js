import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import moment from 'moment';
import AreaTransferModal from '../../components/areaSelect/AreaTransferModal';

const _title = "运费模板";
class Page extends Component {

  state = {
    showTableLoading: false,
    pageDataList: [],
    AreaAndDisctrictSelectModalVisible: false,
    name: null,
    caculateUnit: 0,
    areaModalVisible: false,
    checkedAreaData: {},
    selectIndex:null
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
    let pageDataList = [
      { id: 1, showAddressName: "四川", firstValue: 1, firstPrice: 1.1, extendValue: 2, extendPrice: 2.2 }
    ]
    this.setState({
      pageDataList
    })
    // this._showTableLoading();
    // searchSettlementAuditList(this.params).then(res => {    


    //   this.setState({
    //     pageDataList: res.data
    //   })

    // }).catch(() => {
    //   this._hideTableLoading();
    // })
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

  onTemplateDataChange = (index, key, e) => {

    let { pageDataList } = this.state;
    pageDataList[index][key] = e;
    this.setState({
      pageDataList
    })

  }


  // 表格相关列
  columns = [
    { title: "可配送区域", dataIndex: "showAddressName", render: data => data || "--" },
    {
      title: null,
      width: 100,
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
    {
      title: `${this.state.caculateUnit == 1 ? "首重（kg）" : "首件（个）"}`, dataIndex: "firstValue", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "firstValue", e)} style={{ width: 140 }} value={text} precision={0} min={0} /></span>
      )
    },
    {
      title: "运费（元）", dataIndex: "firstPrice", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "firstPrice", e)} style={{ width: 140, marginRight: 10 }} value={text} precision={2} min={0} />元</span>
      )
    },
    {
      title: `${this.state.caculateUnit == 1 ? "续重（kg）" : "续件（个）"}`, dataIndex: "extendValue", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "extendValue", e)} style={{ width: 140 }} value={text} precision={0} min={0} /></span>
      )
    },
    {
      title: "续费（元）", dataIndex: "extendPrice", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "extendPrice", e)} style={{ width: 140, marginRight: 10 }} value={text} precision={2} min={0} />元</span>
      )
    }

  ]


  /**模板名称,计费方式 *******************************************************************************************************************************/
  onNameChange = (e) => {
    let name = e.target.value;
    this.setState({
      name
    })
  }
  onCaculateUnitChange = (caculateUnit) => {
    this.setState({
      caculateUnit
    })
  }

  /**地区选择 *************************************************************************************************************************************/

  showAreaSelectModal = () => {
    this.setState({
      areaModalVisible: true
    })
  }

  hideAreaSelectModal = () => {
    this.setState({
      areaModalVisible: false
    })
  }

  onSaveClick = ({ checkedAreaIds, areaName }) => {

    let { pageDataList } = this.state;
    pageDataList.push({ showAddressName: areaName, checkedAreaIds, id: Date.now() });
    this.setState({
      pageDataList
    })
    this.hideAreaSelectModal()
  }
  /**渲染******************************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div className='margin10-0' >
          <Row className='line-height30 margin-bottom20' style={{ width: 500 }}>
            <Col span={5} className='label-required text-right'>模板名称：</Col>
            <Col span={18}>
              <Input placeholder='填写模板名称' onChange={this.onNameChange} value={this.state.name} />
            </Col>
          </Row>
          <Row className='line-height30 margin-bottom20' style={{ width: 500 }}>
            <Col span={5} className='label-required text-right'>计费方式：</Col>
            <Col span={18}>
              <Radio.Group defaultValue={0} value={this.state.caculateUnit} onChange={this.onCaculateUnitChange}>
                <Radio value={0}>按件数</Radio>
                <Radio value={1}>按重量</Radio>
              </Radio.Group>
            </Col>
          </Row>
        </div>

        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          dataSource={this.state.pageDataList}
          pagination={false}
        />
        <div className='margin-top'>
          <Button type='primary' onClick={this.showAreaSelectModal}>指定可配送区域和运费</Button>
        </div>

        <AreaTransferModal
          onCancel={this.hideAreaSelectModal}
          checkedAreaData={this.state.checkedAreaData}
          visible={this.state.areaModalVisible}
          onOk={this.onSaveClick}
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


