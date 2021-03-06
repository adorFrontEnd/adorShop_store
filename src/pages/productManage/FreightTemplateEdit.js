import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio, Spin } from "antd";
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';
import dateUtil from '../../utils/dateUtil';
import { cityIdsIsRepeat } from '../../components/areaSelect/areaUtils';
import moment from 'moment';
import { saveOrUpdateFreightItem, getFreightItemDetail, getFreightDetail, deleteTemplateItem } from '../../api/product/freight';
import AreaTransferModal from '../../components/areaSelect/AreaTransferModal';

const _title = "运费模板";
class Page extends Component {

  state = {
    showLoading: false,
    freightDetail: null,
    itemList: [],
    AreaAndDisctrictSelectModalVisible: false,
    name: null,
    caculateUnit: 0,
    areaModalVisible: false,
    selectAreaIds: null,
    selectIndex: null,
    showLoading: false
  }


  componentWillMount() {
    let id = this.props.match.params.id;
    let isEdit = !!id;
    this.setState({
      id,
      isEdit
    })

    this.getDetail(id);
  }

  componentDidMount() {
    this.getDetail();
  }

  params = {
    page: 1
  }

  // 获取页面列表
  getDetail = (id) => {

    if (!id || id == '0') {
      return;
    }

    this._showLoading();
    getFreightDetail({ id })
      .then((freightDetail) => {
        let { itemList, name, caculateUnit } = freightDetail;
        itemList = itemList.map(item => {
          return {
            ...item,
            _id: item.id
          }
        })
        this.setState({
          name, caculateUnit, itemList
        })
        this.columns[2]['title'] = caculateUnit == 0 ? "首件（个）" : "首重（kg）";
        this.columns[4]['title'] = caculateUnit == 0 ? "续件（个）" : "续重（kg）";
        this._hideLoading();
      })
      .catch(() => {
        this._hideLoading();
      })
  }

  _showLoading = () => {
    this.setState({
      showLoading: true
    })
  }

  _hideLoading = () => {
    this.setState({
      showLoading: false
    })
  }

  onTemplateDataChange = (index, key, e) => {

    let { itemList } = this.state;
    itemList[index][key] = e;
    this.setState({
      itemList
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
          <a target='_blank' size="small" onClick={() => { this.editItem(record, index) }} >修改</a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要禁用吗？'
            onConfirm={() => { this.deleteItem(record, index) }}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    },
    {
      title: <span>{this.state.caculateUnit == 0 ? "首件（个）" : "首重（kg）"}</span>, width: 180,
      dataIndex: "firstValue", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "firstValue", e)} style={{ width: 140 }} value={text} precision={0} min={0} /></span>
      )
    },
    {
      title: "运费（元）", dataIndex: "firstPrice", width: 180,
      render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "firstPrice", e)} style={{ width: 140, marginRight: 10 }} value={text} precision={2} min={0} />元</span>
      )
    },
    {
      title: <span>{this.state.caculateUnit == 0 ? "续件（个）" : "续重（kg）"}</span>, width: 180,
      dataIndex: "extendValue", render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "extendValue", e)} style={{ width: 140 }} value={text} precision={0} min={0} /></span>
      )
    },
    {
      title: "续费（元）", dataIndex: "extendPrice", width: 180,
      render: (text, record, index) => (
        <span><InputNumber onChange={(e) => this.onTemplateDataChange(index, "extendPrice", e)} style={{ width: 140, marginRight: 10 }} value={text} precision={2} min={0} />元</span>
      )
    }
  ]

  /**编辑单个数据************************************************************************/
  deleteItem = (record, index) => {
    let { id } = record;
    let { itemList } = this.state;
    if (!id) {
      itemList.splice(index, 1);
      this.setState({
        itemList
      })
      return;
    }
    let templateId = this.state.id;
    deleteTemplateItem({ id })
      .then(() => {
        Toast('删除成功！');
        this.getDetail(templateId);
      })
  }

  editItem = (record, index) => {
    let { cityIdList } = record;
    this.showAreaSelectModal(cityIdList, index)
  }

  /**模板名称,计费方式 *******************************************************************************************************************************/
  onNameChange = (e) => {
    let name = e.target.value;
    this.setState({
      name
    })
  }

  onCaculateUnitChange = (e) => {
    let caculateUnit = e.target.value;
    this.setState({
      caculateUnit
    })

    this.columns[2]['title'] = caculateUnit == 0 ? "首件（个）" : "首重（kg）";
    this.columns[4]['title'] = caculateUnit == 0 ? "续件（个）" : "续重（kg）";
  }

  /**地区选择 *************************************************************************************************************************************/

  showAreaSelectModal = (areaList, index) => {
    let selectIndex = index;
    let selectAreaIds = areaList || [];
    this.setState({
      areaModalVisible: true,
      selectIndex,
      selectAreaIds
    })
  }

  hideAreaSelectModal = () => {
    this.setState({
      areaModalVisible: false
    })
  }
  // 保存modal Area数据
  onAreaModalSaveClick = ({ checkedAreaIds, areaName, idMap }) => {

    let { itemList, selectIndex } = this.state;
    if (!checkedAreaIds || !checkedAreaIds.length) {
      Toast('请设置配送区域！');
      return;
    }

    //新建的情况
    let totalList = this.getTotalList(itemList, selectIndex);
    let repeatCityId = cityIdsIsRepeat(checkedAreaIds, totalList);
    if (repeatCityId) {
      let cityName = idMap[repeatCityId]['name'];
      Toast(`选择地区"${cityName}"重复！`)
      return;
    }
    let cityIdList = checkedAreaIds;
    if (!selectIndex && selectIndex != 0) {
      itemList.push({
        showAddressName: areaName,
        cityIdList,
        _id: Date.now(),
        firstValue: null,
        firstPrice: null,
        extendValue: null,
        extendPrice: null
      });
    } else {
      itemList[selectIndex]["cityIdList"] = cityIdList;
      itemList[selectIndex]["showAddressName"] = areaName;
    }


    this.setState({
      itemList
    })

    this.hideAreaSelectModal()
  }

  getTotalList = (itemList, selectIndex) => {

    let totalList = [];
    if (!itemList || !itemList.length) {
      return []
    }
    itemList.forEach((item, index) => {
      if (index != selectIndex) {
        totalList = totalList.concat(item.cityIdList);
      }
    })
    return totalList
  }

  onSaveClick = () => {
    let { name, caculateUnit, itemList } = this.state;

    if (!name) {
      Toast('请输入模板名称！');
      return
    }

    if (!itemList || !itemList.length) {
      Toast('请设置运费模板配送区域！');
      return
    }
    let isValidStr = this.isfreightListValid(itemList);
    if (isValidStr) {
      Toast(isValidStr);
      return;
    }

    let itemStrList = this.formatFreightList(itemList);
    let id = this.state.id && this.state.id != 0 ? this.state.id : null;
    let params = {
      id,
      name,
      caculateUnit,
      itemStrList
    }
    this._showLoading();
    saveOrUpdateFreightItem(params)
      .then(() => {
        Toast('保存成功！');
        this._hideLoading();
        this.getDetail();
      })
      .catch(() => {
        this._hideLoading();
      })
  }

  formatFreightList = (itemList) => {
    if (!itemList || !itemList.length) {
      return ''
    }
    let list = itemList.map(item => {
      let { _id, cityIdList, ...other } = item;
      let cityIds = cityIdList.join();
      return {
        ...other,
        cityIds
      }
    })
    return JSON.stringify(list);
  }

  isfreightListValid = (freightList) => {

    if (!freightList || !freightList.length) {
      return `请设置可配送区域！`;
    }

    for (let i = 0; i < freightList.length; i++) {

      let { firstValue, firstPrice, extendValue, extendPrice } = freightList[i];
      if (!firstValue) {
        return `请设置第${i + 1}条数据的首件！`
      }

      if (!firstPrice && firstPrice != 0) {
        return `请设置第${i + 1}条数据的运费！`
      }

      if (!extendValue) {
        return `请设置第${i + 1}条数据的续件！`
      }

      if (!extendPrice) {
        return `请设置第${i + 1}条数据的续费！`
      }
    }
    return;
  }

  // 返回
  goBack = () => {
    window.history.back();
  }
  /**渲染******************************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage path='productManage.other.freightTemplateEdit' title={_title} >
        <Spin spinning={this.state.showLoading}>
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
            rowKey="_id"
            columns={this.columns}
            dataSource={this.state.itemList}
            pagination={false}
          />

          <div className='margin-top'>
            <Button type='primary' onClick={() => this.showAreaSelectModal(null, null)}>指定可配送区域和运费</Button>
          </div>

          <div className='flex-end margin-top20 margin-right'>
            <Button type='primary' className='margin-right normal' onClick={this.onSaveClick}>保存</Button>
            <Button type='primary' className='normal' onClick={this.goBack}>返回</Button>
          </div>
        </Spin>

        <AreaTransferModal
          onCancel={this.hideAreaSelectModal}
          areaIds={this.state.selectAreaIds}
          visible={this.state.areaModalVisible}
          onOk={this.onAreaModalSaveClick}
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


