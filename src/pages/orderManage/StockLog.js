import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, AutoComplete, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, DatePicker } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { changeRoute } from '../../store/actions/route-actions';
import { getStockLogList, batchDeleteStatus } from '../../api/order/StockManage';
import { getSpecValue } from '../../utils/productUtils';

const _title = "库存日志";
const _description = "";
const { RangePicker } = DatePicker;


class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    inputType: null
  }

  componentDidMount() {
    this.getPageData()

  }



  params = {
    page: 1
  }

  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getStockLogList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })
      this.setState({
        tableDataList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }

  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  // 打开modal
  showAuthModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
  }

  // 隐藏modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }


  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "操作人", dataIndex: "shopOperName", render: data => data || "--" },
    { title: "类型", dataIndex: "typeStr", render: data => data || '--' },
    { title: "订单编号", dataIndex: "orderNo", render: data => data || "--" },
    {
      title: "SKU(编号)", dataIndex: "channel",
      render: (text, record, index) => (
        <div>
          <div>{record.productName}</div>
          <div>{record.productNumber}</div>
          <div style={{ color: "#aaa" }}>{record.specValue ? getSpecValue(record.specValue) : ""}</div>
        </div>
      )
    },
    { title: "变更前", dataIndex: "changesBefore", render: data => data || data == 0 ? data : "--" },
    { title: "变更后", dataIndex: "changesAfter", render: data => data || data == 0 ? data : "--" },
    { title: "变更数", dataIndex: "changesNumber", render: data => data || data == 0 ? data : "--" },
    { title: "变更时间", dataIndex: "gmtModified", render: data => data ? dateUtil.getDateTime(data) : "--" },

  ]

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
  //查询按钮点击事件
  searchClicked = () => {
    let params = this.props.form.getFieldsValue();
    let { time, type, inputType, inputData } = params;
    let [startCreateTimeStamp, endCreateTimeStamp] = dateUtil.parseDateRange(time);
    let data = { startCreateTimeStamp, endCreateTimeStamp, type };
    if (inputType && inputData) {
      data[inputType] = inputData;
    }
    this.params = {
      page: 1,
      ...data
    }
    this.getPageData();
  }

  resetClicked = () => {
    this.props.form.resetFields();
    this.setState({
      inputType:null
    })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  // 批量删除
  batchDeleteStatus = () => {
    let { selectedRowKeys } = this.state;
    if (!selectedRowKeys) {
      Toast('请选择要删除的日志！')
      return;
    }
    let ids = selectedRowKeys.join();
    batchDeleteStatus({ ids })
      .then(data => {
        Toast('删除成功')
        this.getPageData()
      })
  }
  onInputTypeChange = (inputType) => {

    this.setState({
      inputType
    })
  }

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };


    return (
      <CommonPage path='orderManage.stockManage.stockLog' title={_title} description={_description} >

        <div>

          <div className='margin10-0'>
            <Form layout='inline'>
              <div>
                <Form.Item
                  field="type"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ width: 220 }}
                  label='操作类型：'
                >
                  {
                    getFieldDecorator('type', {
                      initialValue: null
                    })(
                      <Select>
                        <Select.Option value={null}>全部</Select.Option>
                        <Select.Option value='0'>库存管理</Select.Option>
                        <Select.Option value='1'>订货交易</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
                <Form.Item
                  field="inputType"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ width: 220 }}
                  label='筛选类型：'
                >
                  {
                    getFieldDecorator('inputType', {
                      initialValue: null
                    })(
                      <Select onChange={this.onInputTypeChange}>
                        <Select.Option value={null}>全部</Select.Option>
                        <Select.Option value='orderNo'>订单编号</Select.Option>
                        <Select.Option value='productName'>商品名称</Select.Option>
                        <Select.Option value='productNumber'>商品编号</Select.Option>
                      </Select>
                    )
                  }
                </Form.Item>
                {
                  this.state.inputType ?
                    <Form.Item
                      field="inputData"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                    >
                      {
                        getFieldDecorator('inputData', {
                        })(
                          <Input allowClear style={{ width: "240px" }} />
                        )
                      }
                    </Form.Item>
                    :
                    null
                }

                <Form.Item
                  field="time"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 18 }}
                  style={{ width: 400 }}
                  label='选择时间:'
                >
                  {
                    getFieldDecorator('time', {
                      initialValue: null
                    })(
                      <DatePicker.RangePicker
                        showTime={{ format: 'HH:mm:ss' }}
                        format="YYYY-MM-DD HH:mm:ss"
                      />
                    )
                  }
                </Form.Item>
              </div>

            </Form>
          </div>
          <div className='margin10-0'>
            <Button type='primary' className='normal' onClick={this.searchClicked}>筛选</Button>
            <Button className='margin0-20' onClick={this.resetClicked}>清除所有筛选</Button>
            <Button onClick={this.batchDeleteStatus} className='normal' type='primary'>批量删除</Button>
          </div>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.tableDataList}
          rowSelection={rowSelection}
        />
      </CommonPage >
    )
  }
}

export default (Form.create()(Page));