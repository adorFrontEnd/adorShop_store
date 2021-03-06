import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchSellProductList, exportOrderProduct, updateOnsaleStatus, batchDelete, deleteSellProduct, batchOnsaleStatus } from '../../api/product/orderProduct';
import { NavLink, Link } from 'react-router-dom';
import { routerConfig } from '../../config/router.config';

import ProductTemplateSelectModal from '../../components/product/ProductTemplateSelectModal';

const _title = "订货商品";
const _description = "";
const orderProductDetailPath = routerConfig["orderManage.orderProduct.orderProductEdit"].path;
// const _channelEnum = {
//   "0": "直购",
//   "1": "订货",
//   "2": "云市场"
// }
// const _channelEnumArr = Object.keys(_channelEnum).map(item => { return { id: item, name: _channelEnum[item] } });


class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false,
    productModalIsVisible: false,
    selectProductItem: null,
    selectIds: null
  }

  componentDidMount() {
    this.getPageData()
  }

  params = {
    page: 1
  }

  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "onsaleStatus",
      style: { width: 140 },
      placeholder: '选择状态',
      initialValue: null,
      optionList: [
        { id: null, name: "全部" },
        { id: 1, name: "已上架" },
        { id: 0, name: "已下架" }
      ]
    },

    // 0全部缺货 1部分缺货 2有货
    {
      type: "SELECT",
      field: "stockStatus",
      style: { width: 140 },
      placeholder: '选择状态',
      initialValue: null,
      optionList: [
        { id: null, name: "全部" },
        { id: 0, name: "全部缺货" },
        { id: 1, name: "部分有货" },
        { id: 2, name: "有货" }
      ]
    },
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "商品名称/商品编号"
    }]
  //查询按钮点击事件
  searchClicked = (params) => {

    let { inputData } = params;
    inputData = inputData || null;
    this.params = {
      page: 1,
      ...params,
      inputData
    }
    this.getPageData();
  }
  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }


  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    searchSellProductList(this.params).then(res => {
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

  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "商品名称", dataIndex: "name", render: data => data || "--" },
    { title: "商品图", dataIndex: "imageUrl", render: data => data ? (<img src={data} style={{ height: 40, width: 40 }} />) : "--" },
    { title: "包装规格", dataIndex: "specifications", render: data => data || "--" },
    { title: "库存状态", dataIndex: "stockStatusStr", render: data => data ? <span className='theme-color'>{data}</span> : "--" },
    { title: "销量", dataIndex: "soldQty", render: data => data || data == 0 ? data : "--" },
    { title: "单位", dataIndex: "baseUnit", render: data => data || "--" },
    { title: "添加时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    { title: "状态", dataIndex: "onsaleStatus", render: data => data == 1 ? <span className='color-green'>已上架</span> : <span className='theme-color'>已下架</span> },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          {
            record.onsaleStatus == 1 ?
              <a onClick={() => this.updateOnsaleStatus(record, 0)}>下架</a> :
              <a onClick={() => this.updateOnsaleStatus(record, 1)}>上架</a>
          }
          <Divider type="vertical" />
          <span><NavLink to={orderProductDetailPath + "/" + record.id + "/0"}>编辑</NavLink></span>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteSellProduct(record) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]

  goEdit = (id) => {
    let title = id == '0' ? '新建商品' : "编辑商品"
    this.props.changeRoute({ path: 'orderManage.orderProduct.orderProductEdit', title: '商品编辑', parentTitle: '订货商品' });
  }


  updateOnsaleStatus = (record, onsaleStatus) => {
    let { id } = record;
    updateOnsaleStatus({ id, onsaleStatus })
      .then(() => {
        let title = (onsaleStatus == 1 ? "上架" : "下架") + "成功！";
        Toast(title);
        this.getPageData();
      })
  }

  deleteSellProduct = (record) => {
    let { id } = record;
    deleteSellProduct({ id })
      .then(() => {

        Toast("删除成功！");
        this.getPageData();
     
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

  _showProductModal = () => {
    this.setState({
      productModalIsVisible: true
    })
  }
  _hideProductModal = () => {
    this.setState({
      productModalIsVisible: false
    })
  }
  selectProduct = (selectProductItem) => {
    this._hideProductModal();
  }

  onTableRowSelection = (selectedRowKeys, selectedRows) => {
    let selectIds = selectedRowKeys;
    this.setState({
      selectIds
    })
  }

  batchOnsaleStatusClick = (action, value) => {
    let { selectIds } = this.state;
    if (!selectIds || !selectIds.length) {
      Toast("请选择订货商品！");
      return;
    }
    let ids = selectIds.join();
    switch (action) {
      case "status":
        let status = value;
        batchOnsaleStatus({ ids, onsaleStatus: status })
          .then(() => {
            let title = status == 1 ? "批量上架成功！" : "批量下架成功！";
            Toast(title);
            this.getPageData();
          })
        break;

      case "delete":
        batchDelete({ ids })
          .then(() => {
            Toast("删除成功！");
            this.getPageData();
          })
        break;

    }
  }

  exportOrderProduct = () => {
    exportOrderProduct(this.params)
  }
  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectProductItem } = this.state;
    return (
      <CommonPage path='orderManage.orderProduct.orderProduct' title={_title} description={_description} >

        <div>
          <div className="flex-between align-center margin-bottom flex-wrap">
            <div style={{ minWidth: 330 }} className='margin-bottom20'>
              <Button type='primary' onClick={() => this._showProductModal()} >添加商品</Button>
              <Button type='primary' className='margin0-10' onClick={() => this.batchOnsaleStatusClick("delete")} >批量删除</Button>
              <Button type='primary' onClick={() => this.batchOnsaleStatusClick("status", 1)} >批量上架</Button>
              < Button type='primary' className='margin0-10' onClick={() => this.batchOnsaleStatusClick("status", 0)}>批量下架</Button>
              <Button type='primary' className='normal' onClick={this.exportOrderProduct}>导出</Button>
            </div>
            <div style={{ minWidth: 850 }} className='margin-bottom20'>
              <SearchForm
                width={850}
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
            rowSelection={{
              onChange: this.onTableRowSelection
            }}
          />
        </div>

        <ProductTemplateSelectModal
          visible={this.state.productModalIsVisible}
          onCancel={this._hideProductModal}
          selectItem={this.selectProduct}
        />

      </CommonPage >
    )
  }
}

export default (Form.create()(Page));