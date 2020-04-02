import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Popconfirm, Divider, InputNumber, Radio } from "antd";
import { pagination } from '../../utils/pagination';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { SearchForm, SubmitForm } from '../../components/common-form';
import Toast from '../../utils/toast';
import { updateStock, getStockList, getDetail } from '../../api/order/StockManage';
import { getSpecValue } from '../../utils/productUtils';

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
    changedstockWarning: {},
    changedstock: {}
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
        <span>
          <a size="small" className="color-red" onClick={() => { this.showStockModal(record) }}> 补货</a>
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
      placeholder: "商品名称"
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
    this.setState({ id: data.id })
    let { id } = data;
    this.setState({
      tableLoading: true
    })
    getDetail({ id })
      .then((data) => {
        this.setState({ stockData: data, tableLoading: false })
      })
      .catch(() => {
        this.setState({
          tableLoading: false
        })
      })
  }

  refreshStockData = () => {
    let { id } = this.state
    this.setState({
      tableLoading: true
    })
    getDetail({ id })
      .then((data) => {
        this.setState({ stockData: data, tableLoading: false })
      })
      .catch(() => {
        this.setState({
          tableLoading: false
        })
      })
  }
  // 关闭modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }
  // 保存修改
  saveClicked = () => {
    let stockData = this.state.stockData;
    for (var i = 0; i < stockData.length; i++) {
      if (stockData[i]['changeAfter'] < 0) {
        Toast('库存不能小于0！');
        return;
      }

      if (stockData[i]['changeQty'] && stockData[i]['changeQty'] < 0) {
        Toast('修改库存值必须大于等于0！');
        return;
      }
    }



    if (!stockData || !stockData.length) {
      this.setState({
        newItemModalVisible: false
      })
      this.getPageData();
      return;
    }
    let stockStrList = this.formatParams(stockData);
    stockStrList = JSON.stringify(stockStrList);
    updateStock({ stockStrList })
      .then(data => {
        Toast('修改成功');
        this.setState({
          newItemModalVisible: false
        })
        this.getPageData();
      })
  }


  // 格式化参数
  formatParams = (stockData) => {
    if (!stockData || !stockData.length) {
      return []
    }
    let result = stockData.map(item => {
      let { id, alarmQty, changeQty, increaseType } = item;

      changeQty = changeQty || 0;
      alarmQty = alarmQty || 0;

      changeQty = `${increaseType == 0 ? '-' : '+'}${changeQty}`;
      return {
        id, alarmQty, changeQty
      }
    })
    return result;
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
      this.setState({
        stockData
      })
    }
  }

  // 修改库存
  changeStock = (e, index) => {
    let { stockData } = this.state;
    if (!stockData) {
      return;
    }
    let changeQty = e;
    stockData[index]['changeQty'] = e;
    let plusminus = stockData[index]['increaseType'] == 0 ? -1 : 1;
    let changeAfter = plusminus * changeQty + parseInt(stockData[index]['qty']);
    stockData[index]['changeAfter'] = changeAfter;
    this.setState({
      stockData
    })
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

  changeIncreaseType = (e, index) => {
    let increaseType = e.target.value;
    let { stockData } = this.state;
    stockData[index]["increaseType"] = increaseType;
    let changeQty = stockData[index]['changeQty'];
    let plusminus = increaseType == 0 ? -1 : 1;
    let changeAfter = plusminus * changeQty + parseInt(stockData[index]['qty']);
    stockData[index]['changeAfter'] = changeAfter;
    this.setState({
      stockData
    })
  }

  stockColumns = [
    { title: "主图", align: "center", dataIndex: "imageUrl", render: data => <img style={{ height: 40, width: 40 }} src={data} /> },
    { title: "规格", align: "center", dataIndex: "specValue", render: data => getSpecValue(data) || '--' },
    { title: "商品编码", align: "center", dataIndex: "productNumber", render: data => data || "--" },
    { title: "条形码", align: "center", dataIndex: "productBarCode", render: data => data || "--" },
    { title: "状态", align: "center", dataIndex: "skuStatus", render: data => data == 0 ? "禁购" : "正常" },
    {
      title: "预警库存", align: "center", dataIndex: "alarmQty",
      render: (data, record, index) =>
        <InputNumber precision={0} min={0}
          value={data} style={{ width: 120 }}
          onChange={(e) => this.stockWarning(e, record.id)} disabled={record.skuStatus == 0}
        />
    },
    { title: "当前库存", align: "center", dataIndex: "qty", render: data => data || data == 0 ? data : "--" },
    {
      title: <span>改变库存<br /> (格式：+/-数字)</span>, align: "center", render: (data, record, index) => (
        <div className='flex-middle'>
          <div style={{ width: 60 }}>
            <Radio.Group value={record.increaseType == '0' ? 0 : 1} onChange={(e) => this.changeIncreaseType(e, index)}>
              <Radio style={{ width: 50 }} value={0}><span style={{ display: "inline-block", width: 20 }} className='font-18'>-</span></Radio>
              <Radio style={{ width: 50 }} value={1}><span style={{ display: "inline-block", width: 20 }} className='font-18'>+</span></Radio>
            </Radio.Group>
          </div>
          <InputNumber
            style={{ width: 120 }} min={0} precision={0}
            onChange={(e) => this.changeStock(e, index)}
            disabled={record.skuStatus == 0} value={record.changeQty}
          />
        </div>
      )
    },
    {
      title: "修改后库存", align: "center",
      render: (data, record, index) => record.changeAfter ? record.changeAfter : record.qty
    },
  ]

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <CommonPage path='orderManage.stockManage.stockManage' title={_title} >
        <div style={{ marginBottom: '30px' }} className='flex-between align-center'>
          {/* <Button type='primary'>同步网店管家库存</Button> */}
          <div className='color-red'>您的补货记录将记录在库存日志中</div>
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
          width={1000}
          afterClose={() => { this.setState({ stockData: null }) }}
        >
          <div style={{ padding: "10px" }}>
            <div className='margin-bottom flex'>
              <Button type='primary' className='normal' onClick={this.refreshStockData}>刷新</Button>
              <div style={{ marginLeft: '10px', color: '#FF9530', lineHeight: '32px' }}>刷新当前实际库存</div>
            </div>
            <div>
              <Table
                bordered={true}
                rowKey="id"
                columns={this.stockColumns}
                loading={this.state.tableLoading}
                pagination={false}
                dataSource={this.state.stockData}
              />
            </div>
            <div className="color-red" style={{ marginTop: '20px' }}>
              <div>1、该商品如果为有货状态，则代表所有订购商品状态为正常的SKU不存在当前库存为0的情况</div>
              <div>2、该商品如果为部分缺货状态，则代表所有订购商品状态为正常的SKU有且不完全存在当前库存为0的情况</div>
              <div>3、该商品如果为全部缺货状态，则代表所有订购商品状态为正常的SKU的所有当前库存为0</div>
              <div>4、如果某个商品的某个SKU存在该SKU的当前库存小于等于预警库存且不为0时，显示有库存预警</div>
              <div>5、任何时候库存不得小于0</div>
              <div>6、如果改变库存时减少库存，会根据实际库存情况进行减少，比如库存当前库存201，减少200库存，在确认时前台销售数3，则实际库存为0，其中有正常销售减3的记录，此次操作实际减库存为198</div>
            </div>
          </div>
        </Modal>
      </CommonPage >
    )
  }
}

export default (Form.create()(Page));