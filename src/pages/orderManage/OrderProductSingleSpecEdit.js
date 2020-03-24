import React, { Component } from "react";
import { Col, Row, Checkbox, Modal, Select, Switch, Table, Spin, Icon, Form, Button, Badge, Input, Radio, InputNumber, Popconfirm } from 'antd';
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import ProductShowPictureWall from '../../components/upload/ProductShowPictureWall';
import { _getSpecDataBySpecClasses } from '../productManage/specUtils';
import GradeSelectModal from '../../components/order/GradeSelectModal';
import UserSelectModal from '../../components/order/UserSelectModal';
import { SearchForm } from '../../components/common-form';
import { getGradeList } from '../../api/user/grade';
import { deleteOrderProductUserPrice, deleteUserGradePrice } from '../../api/product/orderProduct';


class Page extends Component {

  state = {

    singleSpecData: {},
    userPriceList: [],

    uploadModalIsVisible: false,
    selectProductUrls: [],
    selectSpecIndex: 0,

    gradeModalIsVisible: false,
    userModalIsVisible: false,
    selectGradeIds: [],
    selectUserIds: [],
    gradeList: [],
    gradeIdMap: {},
    userIsFilered: false,
    filtereduserPriceList: []
  }

  componentDidMount() {
    this._getGradeList();
    this.initSingleSpecColumns();
    this.onSpecDataRevert(this.props.specData);
  }

  componentWillReceiveProps(props) {
    if (props.shouldChange) {
      this.onSpecDataRevert(props.specData);
    }
  }

  /**获取规格数据 ****************************************************************************************/
  getSingleSpecData = () => {
    let { singleSpecData, userPriceList } = this.state;
    let sellProductSkuId = singleSpecData && singleSpecData.id;
    let sellProductSkuStrList = this.getSellProductSkuStrList(singleSpecData, sellProductSkuId);
    let userPriceStrList = this.getUserPriceStrList(userPriceList, singleSpecData.productSkuId, sellProductSkuId);
    return {
      singleSpecData, userPriceList, sellProductSkuStrList, userPriceStrList
    }
  }

  getSellProductSkuStrList = (singleSpecData, sellProductSkuId) => {
    let { productSkuId, number, costPrice, id } = singleSpecData;

    let productNumber = number;
    let userGradePriceStrList = this.getGradePriceList(singleSpecData, productSkuId, productNumber, sellProductSkuId);

    let sellProductSku = {
      productId: this.props.productId,
      costPrice,
      productNumber,
      onsaleStatus: 1,
      status: 1,
      productSkuId
    }

    if (userGradePriceStrList && userGradePriceStrList.length > 0) {
      sellProductSku.userGradePriceStrList = JSON.stringify(userGradePriceStrList)
    }

    if (id) {
      sellProductSku.id = id;
      sellProductSku.isChange = 1;
    }

    if (this.props.sellProductId) {
      sellProductSku.isChange = 1;
      sellProductSku.sellProductId = this.props.sellProductId;
    }

    let sellProductSkuStrList = [sellProductSku]
    return sellProductSkuStrList
  }

  getGradePriceList = (singleSpecData, productSkuId, productNumber, sellProductSkuId) => {
    let keys = Object.keys(singleSpecData).filter(item => item.substr(0, 6) == 'grade_' && singleSpecData[item]);
    let gradePriceList = keys.map(gradeKey => {
      let gradeId = gradeKey.substr(6);
      let { price, performancePrice, recommendPrice, minBuyQty, status, id } = singleSpecData[gradeKey];
      let data = {
        productSkuId, productNumber, gradeId: Number(gradeId), price, performancePrice, recommendPrice, minBuyQty, status
      }
      if (id) {
        data.id = id;
        data.isChange = 1;
      }

      if (this.props.sellProductId) {
        data.isChange = 1;
        data.sellProductId = this.props.sellProductId;
      }

      if (sellProductSkuId) {
        data.sellProductSkuId = sellProductSkuId;
      }

      return data
    })
    return gradePriceList
  }

  getUserPriceStrList = (userPriceList, productSkuId, sellProductSkuId) => {

    let userPriceStrList = userPriceList.map(item => {
      let { userId, price, minBuyQty, status, id } = item;
      let result = {
        userId, price, minBuyQty, status, productSkuId
      }

      if (id) {
        result.id = id;
        result.isChange = 1;
      }

      if (this.props.sellProductId) {
        result.isChange = 1;
        result.sellProductId = this.props.sellProductId;
      }

      if (sellProductSkuId) {
        result.sellProductSkuId = sellProductSkuId;
      }

      return result;
    })
    return userPriceStrList
  }


  //规格数据回滚
  onSpecDataRevert = (data) => {

    if (!data || !Object.keys(data).length) {
      this._initSpecData();
    } else {
      this.initSingleSpecColumns();
      let { singleSpecData, selectGradeIds } = this.parseSingleSpecData(data.singleSpecData);
      let { userPriceList, selectUserIds } = this.parseUserPriceList(data.userPriceList);
      this.setState({
        singleSpecData,
        userPriceList,
        singleSpecData,
        selectGradeIds,
        selectUserIds
      })

    }
  }

  parseSingleSpecData = (rawSingleSpecData) => {

    if (!rawSingleSpecData) {
      return
    }
    let { userGradePriceList, productSkuId, ...other } = rawSingleSpecData;

    let selectGradeIds = [];
    if (!userGradePriceList || !userGradePriceList.length) {
      return { singleSpecData: rawSingleSpecData, selectGradeIds }
    }
    let gradeDataObj = {};
    userGradePriceList.forEach(item => {
      let gradeKey = `grade_${item.gradeId}`;
      if (!gradeDataObj.hasOwnProperty(gradeKey)) {
        gradeDataObj[gradeKey] = { ...item, productSkuId };
      };
      selectGradeIds.push(item.gradeId);
      let gradeData = { name: item.gradeName, id: item.gradeId };
      this.addGradeColumn({ gradeData });
    })

    let singleSpecData = {
      productSkuId,
      ...other,
      ...gradeDataObj
    }

    return {
      singleSpecData,
      selectGradeIds
    }
  }

  parseUserPriceList = (rawUserPriceList) => {
    let userPriceList = [];
    let selectUserIds = [];

    if (!rawUserPriceList || !rawUserPriceList.length) {
      return {
        userPriceList, selectUserIds
      }
    }
    selectUserIds = rawUserPriceList.map(item => item.userId);
    userPriceList = rawUserPriceList.map(item => {
      let { accountNumber, customerName, ...other } = item;
      return {
        ...other,
        name: customerName,
        phone: accountNumber
      }
    })

    return {
      userPriceList, selectUserIds
    }

  }

  _initSpecData = () => {

    let singleSpecData = {
      specValue: "无",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
      weight: null
    };

    let data = {
      singleSpecData,
      uploadModalIsVisible: false,
      selectProductUrls: []
    }
    this.setState(data);
  }

  //上传图片的modal
  showUploadModal = () => {

    let { singleSpecData, multiSpecData } = this.state;
    let selectProductUrls = singleSpecData['imageUrl'] || [];
    this.setState({
      selectProductUrls
    })
    this._showUploadModal();
  }

  /**规格等级价编辑 ****************************************************************************************/
  initSingleSpecColumns = () => {
    this.singleSpecColumns = [
      { title: "", align: "center", dataIndex: "text2", width: 50, render: (text, data, index) => <span>{index + 1}</span> },
      {
        title: "主图", align: "center", width: 80, dataIndex: "imageUrl", render: data => (
          <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal()}>
            {
              data && data.length ?
                <div>
                  <Badge count={data.length}>
                    <img src={data[0]} style={{ height: 50, width: 50 }} />
                  </Badge>
                </div>
                :
                <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10 }}>
                  <Icon type='plus' style={{ fontSize: 20 }} />
                </div>
            }
          </div>
        )
      },
      { title: "规格", align: "center", width: 50, dataIndex: "specValue", render: data => data || "--" },
      { title: "商品编码", align: "center", dataIndex: "number", render: data => data || "--" },
      { title: "条形码", align: "center", dataIndex: "barCode", render: data => data || "--" },
      { title: "划线价（元）", align: "center", width: 110, dataIndex: "marketPrice", render: data => data || "--" },
      { title: "成本价（元）", align: "center", width: 110, dataIndex: "costPrice", render: data => data || "--" },
      { title: "重量（kg）", align: "center", width: 110, dataIndex: "weight", render: data => data || "--" },
      {
        title: data => < a onClick={this.showUserGradeModal} > <Icon type='plus' /> 添加客户级别</a >, width: 120, align: "center",
        dataIndex: "text1", render: data => '--'
      }
    ]
  }

  showUserGradeModal = () => {
    this.setState({
      gradeModalIsVisible: true
    })
  }

  _hideUserGradeModal = () => {
    this.setState({
      gradeModalIsVisible: false
    })
  }

  onSelectGrade = (data) => {
    let { gradeData, id } = data;
    this.addGradeColumn({ gradeData, id });
  }

  addGradeColumn = ({ gradeData }) => {

    let { name, id } = gradeData;
    let length = this.singleSpecColumns.length;
    let dataIndexArr = this.singleSpecColumns.map(item => item.dataIndex);
    if (dataIndexArr.indexOf(`grade_${id}`) != -1) {
      return;
    }
    let item = this.getGradeColumnsItem(id, name);

    this.singleSpecColumns.splice(length - 1, 0, item);
    let { selectGradeIds, singleSpecData } = this.state;
    singleSpecData[`grade_${id}`] = {
      //售价
      price: 0,
      //平级推荐奖
      recommendPrice: 0,
      //起订量
      minBuyQty: 0,
      //业绩计算取价
      performancePrice: 0,
      //状态
      status: 1
    };
    selectGradeIds.push(id);
    this.setState({
      selectGradeIds,
      singleSpecData
    })
    let { isMultiSpec, userPriceList } = this.state;
  }

  deleteGrade = (key, id) => {
    let { selectGradeIds, singleSpecData, isMultiSpec, userPriceList } = this.state;
    let idIndex = selectGradeIds.indexOf(id);
    let columnIndex = 0;
    this.singleSpecColumns.forEach((item, index) => {
      if (item.dataIndex == `grade_${id}`) {
        columnIndex = index;
      }
    })
    let record = singleSpecData[`grade_${id}`];
    if (!record.id) {
      this.singleSpecColumns.splice(columnIndex, 1);
      selectGradeIds.splice(idIndex, 1);
      singleSpecData[`grade_${id}`] = null;
      this.setState({
        selectGradeIds,
        singleSpecData
      })
      return;
    }

    deleteUserGradePrice({ sellProductId: this.props.sellProductId, gradeId: id })
      .then(() => {
        Toast('删除成功！');
        this.props.refresh && this.props.refresh();
      })

  }

  onGradeDataChange = (action, gradeIdKey, e) => {
    let { singleSpecData, isMultiSpec, userPriceList } = this.state;
    if (action == 'disable' || action == 'enable') {
      singleSpecData[gradeIdKey]['status'] = action == 'enable' ? 1 : 0;
    } else {
      singleSpecData[gradeIdKey][action] = e;
    }
    this.setState({
      singleSpecData
    })
  }

  /**会员等级价编辑 *************************************************************************************************************/
  singleSpecUserColumns = [
    {
      title: "", align: "center", dataIndex: "text2", width: 100,
      render: (text, record, index) =>
        <Popconfirm
          placement="topLeft" title='确认要删除吗？'
          onConfirm={() => this.onUserDataChange(record, 'delete')} >
          <a><Icon title="删除" type='delete' className='margin-right theme-color font-20' />删除</a>
        </Popconfirm>
    },
    { title: "会员名称", align: "center", width: 100, dataIndex: "name", render: data => data || '--' },
    { title: "会员手机号", align: "center", width: 100, dataIndex: "phone", render: data => data || "--" },
    { title: "会员等级", align: "center", dataIndex: "gradeName", render: data => data || "--" },
    {
      title: "是否可购买", align: "center", dataIndex: "status",
      render: (data, record, index) => (
        <Switch
          checked={data == 1}
          onChange={(e) => this.onUserDataChange(record, 'status', e)}
        />
      )
    },
    {
      title: "相关信息", align: "center", width: 380, render: (data, record, index) =>
        <div className='flex-middle'>
          <span className='margin0-10'>价格</span>
          <InputNumber disabled={record.status != 1} value={record['price']} precision={2} min={0} onChange={(e) => this.onUserDataChange(record, 'price', e)} />
          <span className='margin0-10'>起订量</span>
          <InputNumber disabled={record.status != 1} value={record['minBuyQty']} precision={0} min={0} onChange={(e) => this.onUserDataChange(record, 'minBuyQty', e)} />
        </div>
    }
  ]

  onSelectUser = (data) => {

    let { name, phone, gradeName, id } = data;
    let { selectUserIds, userPriceList, singleSpecData } = this.state;
    selectUserIds.push(id);
    userPriceList.push({
      name,
      phone,
      gradeName,
      productSkuId: singleSpecData.productSkuId,
      userId: id,
      status: 1,
      //售价
      price: 0,
      //起订量
      minBuyQty: 0
    });
    this.setState({
      selectUserIds,
      userPriceList
    })
  }

  showUserModal = () => {
    this.setState({
      userModalIsVisible: true
    })
  }

  _hideUserModal = () => {
    this.setState({
      userModalIsVisible: false
    })
  }

  filterUserClicked = (params) => {
    let { likeName, gradeId } = params;
    let { userPriceList, gradeIdMap } = this.state;
    likeName = likeName && likeName.trim();
    if (!gradeId && !likeName) {
      this.setState({
        userIsFilered: false
      })
      return
    }

    let filtereduserPriceList = [];

    if (gradeId) {
      let gradeName = gradeIdMap[gradeId];
      filtereduserPriceList = userPriceList.filter(item => item.gradeName == gradeName);
    } else {
      filtereduserPriceList = userPriceList;
    }

    if (likeName) {
      filtereduserPriceList = filtereduserPriceList.filter(item => {
        let reg = new RegExp(likeName, "ig");
        return reg.test(item.phone) || reg.test(item.name)
      });
    }

    this.setState({
      filtereduserPriceList,
      userIsFilered: true
    })
  }

  setAllToFirstUser = () => {
    let { userPriceList } = this.state;
    let { price } = userPriceList[0];
    userPriceList = userPriceList.map(item => {
      return {
        ...item,
        price
      }
    })
    this.setState({
      userPriceList
    })

  }

  onUserDataChange = (record, action, e) => {

    let { userPriceList } = this.state;
    let { userId, sellProductId } = record;
    let index = 0;
    userPriceList.forEach((item, i) => {
      if (item.userId == userId) {
        index = i;
      }
    })

    switch (action) {
      case "delete":
        if (!record.id) {
          userPriceList.splice(index, 1);
        } else {
          deleteOrderProductUserPrice({ userId, sellProductId })
            .then(() => {
              Toast('删除成功！');
              this.props.refresh && this.props.refresh();
            })
        }

        break;

      case "price":
      case "minBuyQty":
        userPriceList[index][action] = e;
        break;

      case 'status':
        userPriceList[index][action] = e ? 1 : 0;
        break;
    }

    this.setState({
      userPriceList
    })
  }

  getGradeColumnsItem = (id, name) => {
    return {
      align: "center", width: 250, dataIndex: `grade_${id}`,
      title: () => (<a>
        <Popconfirm
          placement="topLeft" title='确认要删除吗？'
          onConfirm={() => { this.deleteGrade(`grade_${id}`, id) }} >
          <Icon title="删除" type='delete' className='margin-right font-20' />
        </Popconfirm>
        {name}</a >
      ),
      render: (data, record, index) => (
        <div className='flex-between'>
          <div>
            <div className='flex-between'>
              <span>售价</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('price', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].price}
                disabled={record[`grade_${id}`].status != 1}
                precision={2} min={0} />
            </div>
            <div className='flex-between'>
              <span>平级推荐奖</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('recommendPrice', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].recommendPrice} disabled={record[`grade_${id}`].status != 1}
                precision={2} min={0} />
            </div>
            <div className='flex-between'>
              <span>起订量</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('minBuyQty', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].minBuyQty} disabled={record[`grade_${id}`].status != 1}
                precision={0} min={0} />
            </div>
            <div className='flex-between'>
              <span style={{ marginRight: 5 }}>业绩计算取价</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('performancePrice', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].performancePrice} disabled={record[`grade_${id}`].status != 1}
                precision={2} min={0} />
            </div>
          </div>
          <div>
            {
              record[`grade_${id}`].status == 1 ?
                <Button onClick={() => this.onGradeDataChange('disable', `grade_${id}`, index)} type="danger" style={{ height: "100%", width: 40, textAlign: "center" }}>
                  禁<br />订
                </Button>
                :
                <Button onClick={() => this.onGradeDataChange('enable', `grade_${id}`, index)} type="primary" style={{ height: "100%", width: 40, textAlign: "center" }}>
                  恢<br />复
                </Button>
            }

          </div>
        </div>
      )
    }
  }

  /***渲染**********************************************************************************************************/

  render() {
    const { singleSpecData, userPriceList, userIsFilered, filtereduserPriceList } = this.state;
    const singleDataSource = singleSpecData && singleSpecData.productSkuId ? [singleSpecData] : null
    const userPriceListSource = userIsFilered ? filtereduserPriceList : userPriceList;

    return (
      <div className='padding'>
        <div style={{ minHeight: 300 }}>
          <div>
            <Table
              indentSize={10}
              rowKey='productSkuId'
              bordered={true}
              columns={this.singleSpecColumns}
              loading={this.state.tableLoading}
              pagination={false}
              dataSource={singleDataSource}
              scroll={{ x: 'max-content' }}
            />
          </div>
          <div className='margin20-0'>
            <div className='flex-middle padding' style={{ backgroundColor: "#f2f2f2" }}>
              <div>会员价：</div>
              <SearchForm
                width={520}
                towRow={false}
                searchClicked={this.filterUserClicked}
                searchText='筛选'
                formItemList={[
                  {
                    type: 'SELECT',
                    field: "gradeId",
                    style: { width: 120 },
                    optionList: [{ id: null, name: "请选择" }, ...this.state.gradeList]
                  },
                  {
                    type: "INPUT",
                    field: "likeName",
                    style: { width: 140 },
                    placeholder: "客户名/手机号"
                  }
                ]}
              />
              <div className='margin-left20'>
                {
                  userPriceListSource && userPriceListSource.length > 1 ?
                    <Button type='primary' onClick={this.setAllToFirstUser}>
                      批量设为第一个会员的价格
                      </Button> : null
                }
              </div>
            </div>
            <Table
              indentSize={10}
              rowKey='userId'
              bordered={true}
              columns={this.singleSpecUserColumns}
              loading={this.state.tableLoading}
              pagination={false}
              dataSource={userPriceListSource}
            />
          </div>
          <Button type='primary' className='normal' onClick={this.showUserModal}>添加</Button>
        </div>

        <Modal
          visible={this.state.uploadModalIsVisible}
          onCancel={this.hideUploadModal}
          width={640}
          footer={null}
          title='SKU图片信息'
        >
          <ProductShowPictureWall
            pictureList={this.state.selectProductUrls || []}
          />
        </Modal>

        <GradeSelectModal
          onCancel={this._hideUserGradeModal}
          visible={this.state.gradeModalIsVisible}
          selectItem={this.onSelectGrade}
          selectIds={this.state.selectGradeIds}
        />

        <UserSelectModal
          visible={this.state.userModalIsVisible}
          onCancel={this._hideUserModal}
          selectItem={this.onSelectUser}
          selectIds={this.state.selectUserIds}
        />
      </div >
    )
  }


  _showUploadModal = () => {
    this.setState({
      uploadModalIsVisible: true
    })
  }

  hideUploadModal = () => {
    this.setState({
      uploadModalIsVisible: false
    })
  }


  /*获取等级列表************************************************************************************/

  _getGradeList = () => {

    if (this.state.gradeList && this.state.gradeList.length) {
      return;
    }
    getGradeList({ page: 1, size: 100 }).then(gradeList => {

      let gradeIdMap = {};
      gradeList.forEach(({ id, name }) => {
        gradeIdMap[id] = name
      })
      this.setState({
        gradeList,
        gradeIdMap
      })
    })
  }
}

export default Page;

