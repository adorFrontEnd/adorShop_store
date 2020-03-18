import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import { pagination } from '../../utils/pagination';
import { searchProductList } from '../../api/product/product';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';

const OrderEdit = routerConfig["orderManage.orderProduct.orderProductEdit"].path;
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

    let { inputData } = params;
    inputData = inputData || null;
    this.params = {
      page: 1,
      ...params,
      inputData
    }
    this.getPageData();
  }

  getPageData = () => {

    let _this = this;
    this._showTableLoading();

    searchProductList(this.params).then(res => {
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

    let isSelect = this.props.selectId == record.id;

    return (
      <span>
        {
          isSelect ?
            <span className='theme-color'>已选择</span>
            :
            <NavLink to={OrderEdit + "/0/" + record.id} >
              <Button onClick={() => this.selectItem(record, index)} type='primary'>选择</Button>
            </NavLink>
        }
      </span>
    )
  }


  // 表格相关列
  columns = [
    { title: "商品主图", dataIndex: "imageUrl", render: data => this.getImgUrl(data) },
    { title: "商品名称", dataIndex: "name", render: data => data || "--" },
    { title: "商品分类", dataIndex: "categoryNames", render: data => data || "--" },
    { title: "包装规格", dataIndex: "specifications", render: data => data || "--" },
    {
      title: '单选商品',
      render: (text, record, index) => this.renderAction(text, record, index)
    }
  ]

  getImgUrl = (data) => {
    if (!data) {
      return '--';
    }
    let urlArr = data.split('|');
    if (!urlArr || !urlArr.length || !urlArr[0]) {
      return '--'
    }
    return (
      <img src={urlArr[0]} style={{ height: 40, width: 40 }} />
    )
  }

  selectItem = (record, index) => {
    let { id } = record;
    let params = {
      product: record,
      id
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
        width={800}
        title="商品选择"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
      >
        <div>
          <div>
            <SearchForm
              width={500}
              towRow={false}
              searchClicked={this.searchClicked}
              searchText='搜索'
              formItemList={[
                {
                  type: "INPUT",
                  field: "inputData",
                  style: { width: 300 },
                  placeholder: "商品名称/商品编号/商品分类"
                }
              ]}
            />
          </div>
          <div>
            <Table
              indentSize={10}
              rowKey="id"
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
export default Form.create()(SKUModal)