import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import { pagination } from '../../utils/pagination';
import { getPrdSkuList } from '../../api/order/order';
import { getSpecValue } from '../../utils/productUtils';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class SKUModal extends Component {

  state = {
    tableLoading: false
  }

  componentDidMount() {
    this.getPageData();
  }

  params = {
    page: 1
  }

  //查询按钮点击事件
  searchClicked = (params) => {

    let { likeName } = params;
    likeName = likeName || null;
    this.params = {
      page: 1,
      ...params,
      likeName
    }
    this.getPageData();
  }

  getPageData = () => {

    let _this = this;
    this._showTableLoading();

    getPrdSkuList(this.params).then(res => {
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

  _showTableLoading = () => {
    this.setState({
      tableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      tableLoading: false
    })
  }

  renderAction = (text, record, index) => {

    let isSelect = false;
    if (this.props.selectIds && this.props.selectIds.length > 0) {
      isSelect = this.props.selectIds.indexOf(record.sellPrdSkuId) != -1;
    }

    return (
      <span>
        {
          isSelect ?
            <span className='theme-color'>已选择</span>
            :
            <Button onClick={() => this.selectItem(record, index)} type='primary'>选择</Button>
        }
      </span>
    )
  }

   // 表格相关列
  columns = [
    { title: "商品编号", align: "center", dataIndex: "number", render: data => data || "--" },
    { title: "商品主图", align: "center", dataIndex: "imageUrl", render: data => data ? <img src={data} style={{ height: 40, width: 40 }} /> : '--' },
    { title: "商品名称", align: "center", dataIndex: "name", render: data => data || "--" },
    { title: "商品分类", align: "center", dataIndex: "prdCategory", render: data => data || "--" },
    { title: "商品规格", align: "center", dataIndex: "specValue", render: data => data ? getSpecValue(data) : "--" },
    {
      title: '单选商品', align: "center",
      render: (text, record, index) => this.renderAction(text, record, index)
    }
  ]

  selectItem = (record, index) => {
    let { sellPrdSkuId } = record;
    let params = {
      skuData: record,
      id: sellPrdSkuId
    }
    this.props.selectItem(params, index);
  }

  onCancel = () => {
    this.props.onCancel();
  }

  render() {
    return (
      <Modal
        maskClosable={false}
        width={700}
        title="预测商品SKU选择"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
      >
        <div>
          <div>
            <SearchForm
              width={600}
              towRow={false}
              searchClicked={this.searchClicked}
              searchText='搜索'
              formItemList={[
                {
                  type: "INPUT",
                  field: "likeName",
                  style: { width: 300 },
                  placeholder: "商品名称/商品编号/商品分类"
                }
              ]}
            />
          </div>
          <div>
            <Table
              bordered={true}
              className='small-table'
              indentSize={10}
              rowKey="sellPrdSkuId"
              columns={this.columns}
              loading={this.state.tableLoading}
              pagination={this.state.pagination}
              dataSource={this.state.tableDataList}
            />
          </div>
        </div>

      </Modal>
    )
  }
}
export default SKUModal