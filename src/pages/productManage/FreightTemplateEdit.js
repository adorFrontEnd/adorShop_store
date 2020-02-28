import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Modal, Checkbox, InputNumber, DatePicker, Radio } from "antd";
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

const userSearchPath = routerConfig["appManage.userSearch"].path;

const _title = "运费模板";
class Page extends Component {

  state = {
    showTableLoading: false,
    inOutModalIsVisible: false,
    companyList: null,
    AreaAndDisctrictSelectModalVisible:false
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
    { title: "可配送区域", dataIndex: "createTime", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: null,
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
    { title: "首重（kg）", dataIndex: "autoSettlementAmount" },
    { title: "运费（元）", dataIndex: "manualSettlementAmount" },
    { title: "续重（kg）", dataIndex: "refundSettlementAmount" },
    { title: "续费（元）", dataIndex: "commission" },


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



  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;


    return (
      <CommonPage title={_title} >
        <div className='margin10-0' >
          <Form layout='inline' style={{ maxWidth: 1200, minWidth: 956 }}>
            <Row>
              <Col span={8}>
                <Form.Item
                  field="company"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='企业名'
                >
                  {
                    getFieldDecorator('company', {
                    })(
                      <Input allowClear placeholder="输入企业名" style={{ width: "240px" }} />
                    )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  label='创建时间'
                  field='time'>
                  {
                    getFieldDecorator('time')(
                      <DatePicker.RangePicker style={{ width: 240 }} />
                    )
                  }
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  style={{ width: 200 }}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  label='审核状态'
                  field='status'
                >
                  {
                    getFieldDecorator('status', {
                      initialValue: null
                    })(
                      <Select>
                        <Select.Option value={null}>选择审核状态</Select.Option>
                        <Select.Option value='0'>待审核</Select.Option>
                        <Select.Option value='1'>审核完成</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>

            </Row>
          </Form>
        </div>
        <div className='padding10-0'>
          <Button type='primary' className='normal' onClick={this.searchClicked}>筛选</Button>
          <Button className='margin-left' onClick={this.resetClicked}>清除所有筛选</Button>
        </div>
        <Table
          indentSize={20}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />
        <div className='margin-top'>
          <Button type='primary' onClick={this.showAreaAndDisctrictSelectModal}>指定可配送区域和运费</Button>
        </div>

        <AreaAndDisctrictSelectModal
          shouldNotSave={this.state.isEdit}
          checkedAreaData={this.state.checkedAreaData}
          hide={this.hideAreaAndDisctrictSelectModal}
          visible={this.state.AreaAndDisctrictSelectModalVisible}
          onSaveClick={this.onSaveClick}
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

