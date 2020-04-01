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
    showTableLoading: false
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
          <div>{record.barCode}</div>
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
  searchClicked = (params) => {
    let { time, type, inputData } = params;
    let [startCreateStamp, endCreateStamp] = dateUtil.parseDateRange(time);
    inputData = inputData || null;

    this.params = {
      page: 1,
      startCreateStamp,
      endCreateStamp,
      type,
      inputData
    }
    this.getPageData();
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

  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "type",
      style: { width: 120 },
      optionList: [{ id: null, name: '全部' }, { id: "0", name: '库存管理' }, { id: "1", name: '订货交易' }]
    },
    {
      type: "DATE_RANGE",
      field: "time",
      label: "时间范围"
    },
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "订单编号/SKU编号"
    }]

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

        <div className='margin10-0 flex-between align-center'>
          <Button onClick={this.batchDeleteStatus} type='primary'>批量删除</Button>
          <div style={{ minWidth: 1110 }} className='margin-left'>
            <SearchForm
              width={1110}
              searchText='筛选'
              towRow={false}
              searchClicked={this.searchClicked}
              formItemList={this.formItemList}
            />
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