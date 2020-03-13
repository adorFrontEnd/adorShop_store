import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Popconfirm, Divider, InputNumber } from "antd";
import { NavLink, Link } from 'react-router-dom';
import { pagination } from '../../utils/pagination';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { changeRoute } from '../../store/actions/route-actions';
import { connect } from 'react-redux';
import Toast from '../../utils/toast';
import { updateStock, getStockList, getDetail } from '../../api/order/StockManage';

const _title = "库存管理";
const _storeStatus = {
  "1": "有货",
  "2": "部分缺货",
  "0": "全部缺货"
}
const _storeStatusArr = Object.keys(_storeStatus).map(item => { return { id: item, name: _storeStatus[item] } });

const LexiconConfigPath = routerConfig["sysConfig.orderConfig.lexiconConfig"].path;
class Page extends Component {

  state = {
    status: false,
    pageData: null,
    changedClassifySort: {}
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
    getStockList(this.params).then(res => {
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
  // 表格相关列
  columns = [
    { title: "商品名", dataIndex: "productName", render: data => data || "--" },
    { title: "商品图", dataIndex: "imageUrl", render: data => <span><img style={{ height: 40, width: 40 }} src={data} /></span> },
    { title: "包装规格", dataIndex: "specifications", render: data => data || "--" },
    { title: "库存状态", dataIndex: "storeStrStatus", render: data => data || "--" },
    { title: "SKU数", dataIndex: "skuQty", render: data => data || "--" },
    { title: "缺货SKU数", dataIndex: "lackSkuQty", render: data => data },
    { title: "最近补货时间", dataIndex: "recentReplenishmentDate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: "库存预警", dataIndex: "warning", render: (text, record, index) => (
        <span>
          {
            record.warning > 0 ?
              <img style={{ height: 20, width: 20 }} src='/image/denger.png' /> : null
          }
        </span>
      )
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span onClick={() => { this.showStockModal(record) }} style={{ color: '#FF9530' }}>
          补货
        </span>
      )
    }
  ]
  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "storeStatus",
      style: { width: 140 },
      defaultOption: { id: null, name: "所有类别" },
      placeholder: '选择类别',
      initialValue: null,
      optionList: _storeStatusArr
    },
    {
      type: "INPUT",
      field: "inputData",
      style: { width: 300 },
      placeholder: "商品名称/商品编号"
    }]

  //查询按钮点击事件
  searchClicked = (params) => {
    let { inputData, storeStatus } = params;
    inputData = inputData || null;
    storeStatus = storeStatus || null;
    this.params = {
      page: 1,
      ...params,
      inputData,
      storeStatus
    }
    this.getPageData();
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
  /********************************Modal操作*****************************************************/
  // 打开modal
  showStockModal = (data) => {
    this.setState({ newItemModalVisible: true });
    let selectOper = data || null;
    let { id } = data;
    getDetail({ id })
      .then((data) => {
        this.setState({ stockData: data })
      })
  }
  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }
  saveClicked = () => {
    let order = this.formatSortSaveData(this.state.changedClassifySort)
    console.log(order)
  }
  // 修改库存预警
  stockWarning = (value, id) => {

    let { stockData } = this.state;
    if (!stockData) {
      return;
    }
    let index = this.findClassifyIndexById(id, stockData);
    if (index || index == 0) {
      stockData[index]['alarmQty'] = value;
      let changedClassifySort = this.state.changedClassifySort;
      changedClassifySort['alarmQty'] = value;
      changedClassifySort['id'] = id;
      this.setState({
        changedClassifySort,
        stockData
      })

    }
  }
  //格式化保存分类的数据
  formatSortSaveData = (changedClassifySort) => {
    if (!changedClassifySort || !Object.keys(changedClassifySort).length) {
      return;
    }
    let result = Object.keys(changedClassifySort).map(k => {
      return {
        alarmQty: changedClassifySort['alarmQty'],
        changeQty: changedClassifySort['changeQty'],
        id: changedClassifySort['id']
      }
    });
    return result;
  }
  // 查找分类在数组的索引
  findClassifyIndexById = (id, arr) => {
    if (!id || !arr || !arr.length) {
      return;
    }
    let index = arr.findIndex((item) => {
      return item.id && item.id == id;
    });
    return index >= 0 ? index : null;
  }
  // 修改库存
  changeStock = (e, id) => {
    let { stockData } = this.state;
    if (!stockData) {
      return;
    }
    let index = this.findClassifyIndexById(id, stockData);
    if (index || index == 0) {
      stockData[index]['changeQty'] = e.target.value;
      let changedClassifySort = this.state.changedClassifySort;
      changedClassifySort['changeQty'] = e.target.value;
      this.setState({
        changedClassifySort
      })

    }
  }

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div style={{ marginBottom: '30px' }} className='flex-between'>
          <Button type='primary'>同步网店管家库存</Button>
          <div style={{ minWidth: 700 }}>
            <SearchForm
              width={700}
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
        />


        <Modal maskClosable={false}
          title="补货"
          visible={this.state.newItemModalVisible}
          onCancel={this._hideNewItemModal}
          onOk={this.saveClicked}
          className='noPadding'
          width={1200}
        >
          <div style={{ minHeight: 300, padding: "10px" }}>
            <div style={{ display: 'flex' }}>
              <Button type='primary'>刷新</Button>
              <div style={{ marginLeft: '10px', color: '#FF9530', lineHeight: '32px' }}>刷新当前实际库存</div>
            </div>
            <div>
              <Row style={{ border: "1px solid #d9d9d9", marginTop: "10px" }}>
                <Col span={1} className='_padding10'></Col>
                <Col span={2} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>主图</Col>
                <Col span={2} className='_padding10' >规格</Col>
                <Col span={3} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>商品编码</Col>
                <Col span={3} className='_padding10' >条形码</Col>
                <Col span={2} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>状态</Col>
                <Col span={3} className='_padding10'>预警库存</Col>
                <Col span={2} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9" }}>当前库存</Col>
                <Col span={3} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9" }}>
                  <div>改变库存</div>
                  <div>(格式：+/-数字)</div>
                </Col>
                <Col span={3} className='_padding10' style={{ borderLeft: "1px solid #d9d9d9" }}>修改后库存</Col>
              </Row>
              {
                this.state.stockData && this.state.stockData.length ? this.state.stockData.map(item =>
                  <Row style={{ border: "1px solid #d9d9d9", marginTop: "-1px", display: 'flex', alignItems: 'auto' }} key={item.id}>
                    <Col span={1} className='padding flex-middle flex-center'>{item.id}</Col>
                    <Col span={2} className='flex-middle flex-center' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                      <img style={{ height: 40, width: 40 }} src={item.imageUrl} />
                    </Col>
                    <Col span={2} className='padding flex-center align-center'>{item.specValue || '--'}</Col>
                    <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                      {item.productBarCode}
                    </Col>
                    <Col span={3} className='padding flex-middle'>
                      {item.productNumber}
                    </Col>
                    <Col span={2} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                      {item.skuStatus == 0 ?
                        <div>禁购</div> : <div>正常</div>
                      }
                    </Col>
                    <Col span={3} className='padding flex-middle'>
                      <InputNumber value={item.alarmQty} style={{ width: 120 }} onChange={(e) => this.stockWarning(e, item.id)} />
                    </Col>
                    <Col span={2} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                      {item.qty}
                    </Col>
                    <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                      <Input style={{ width: 120 }} onChange={(e) => this.changeStock(e, item.id)} />
                    </Col>
                    <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                      {item.skuQty}
                    </Col>
                  </Row>
                ) : null
              }

            </div>
          </div>
        </Modal>
      </CommonPage>
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