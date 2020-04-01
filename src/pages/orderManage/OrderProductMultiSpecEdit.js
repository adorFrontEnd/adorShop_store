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
import { getSpecValue } from '../../utils/productUtils';



class Page extends Component {

  state = {

    multiSpecData: {},
    deleteMultiSpecData: {},
    userPriceList: [],
    deleteUserPriceList: [],
    rowSpan: 1,

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

  // 初始化数据
  _initSpecData = () => {

    let multiSpecData = [];
    let userPriceList = [];
    let data = {
      multiSpecData,
      userPriceList,
      uploadModalIsVisible: false,
      selectProductUrls: [],
      deleteMultiSpecData: {}
    }
    this.setState(data);
  }

  componentDidMount() {
    this._getGradeList();
    this.initSpecColumns();
    this.onSpecDataRevert(this.props.specData);
  }

  componentWillReceiveProps(props) {
    if (props.shouldChange) {
      this.onSpecDataRevert(props.specData);
    }
  }

  /**数据保存时，规格数据获取 *************************************************************************************************************************************/

  getSpecData = () => {
    let { multiSpecData, userPriceList, deleteUserPriceList, deleteMultiSpecData } = this.state;

    let sellProductSkuStrList = this.getSellProductSkuStrList(multiSpecData, deleteMultiSpecData);
    let userPriceStrList = this.getUserPriceStrList(userPriceList, deleteUserPriceList);
    console.log(userPriceStrList);
    return {
      multiSpecData, userPriceList, sellProductSkuStrList, userPriceStrList
    }
  }

  /**数据回滚时，规格数据解析 **************************************************************************************************************************************/

  onSpecDataRevert = (data) => {

    if (!data || !Object.keys(data).length) {
      this._initSpecData();
    } else {
      this.initSpecColumns();
      let { multiSpecData, selectGradeIds, deleteMultiSpecData } = this.parseMultiSpecData(data.multiSpecData);
      let { userPriceList, selectUserIds } = this.parseUserPriceList(data.userPriceList);
      this.setState({
        multiSpecData,
        userPriceList,
        selectGradeIds,
        selectUserIds,
        deleteUserPriceList: [],
        deleteMultiSpecData,
        rowSpan: multiSpecData.length
      })
    }
  }


  /**数据保存时的数据处理***************************************************************************************************************************/

  // 格式化等级数据
  getSellProductSkuStrList = (multiSpecData, deleteMultiSpecData, sellProductSkuId) => {

    let _userGradePriceStrList = this.getALLSkuGradePriceList(multiSpecData, deleteMultiSpecData);
    let sellProductSkuStrList = [..._userGradePriceStrList];
    return sellProductSkuStrList
  }

  //获取所有SKU相关等级数据
  getALLSkuGradePriceList = (multiSpecData, deleteMultiSpecData) => {

    // 遍历所有的SKU
    let result = multiSpecData.map((multiSpecDataItem, index) => {

      let { id, productSkuId, number, sellProductSkuId, costPrice, onsaleStatus, status, imageUrl } = multiSpecDataItem;
      let deleteSpecDataItem = deleteMultiSpecData[index];

      // 获取一条SKU的等级数据
      let userGradePriceList = this.getOneSkuGradePriceLists(multiSpecDataItem, productSkuId, number, sellProductSkuId);
      let deleteUserGradePriceList = this.getOneSkuGradePriceLists(deleteSpecDataItem, productSkuId, number, sellProductSkuId);
      let userGradePriceStrList = [...userGradePriceList, ...deleteUserGradePriceList]

      let resultItem = {
        userGradePriceStrList: JSON.stringify(userGradePriceStrList),
        productId: this.props.productId,
        productSkuId,
        imageUrl: imageUrl ? imageUrl.join("|") : "",
        productNumber: number,
        costPrice,
        onsaleStatus: 1,
        status
      }
      if (sellProductSkuId) {
        resultItem.sellProductSkuId = sellProductSkuId
      }

      if (id) {
        resultItem.id = id;
        resultItem.isChange = 1;
      }

      if (this.props.sellProductId) {
        resultItem.isChange = 1;
        resultItem.sellProductId = this.props.sellProductId;
      }
      return resultItem
    })

    return result
  }

  //  获取一条SKU的等级数据
  getOneSkuGradePriceLists = (multiSpecDataItem, productSkuId, productNumber, sellProductSkuId) => {
    let keys = Object.keys(multiSpecDataItem).filter(item => item.substr(0, 6) == 'grade_' && multiSpecDataItem[item]);
    let gradePriceList = []
    gradePriceList = keys.map(gradeKey => {
      let gradeId = gradeKey.substr(6);
      let { price, performancePrice, recommendPrice, minBuyQty, status, id } = multiSpecDataItem[gradeKey];
      let data = {
        productSkuId, productNumber, gradeId: Number(gradeId), price, performancePrice, recommendPrice, minBuyQty,
        status: (status == 0 || status == -1 || status == 1) ? status : 1
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
    return gradePriceList;
  }

  getUserPriceStrList = (userPriceList, deleteUserPriceList) => {

    deleteUserPriceList = deleteUserPriceList || [];
    let userList = [...userPriceList, ...deleteUserPriceList];

    let userPriceStrList = userList.map(item => {
      let { userId, price, minBuyQty, status, id, productSkuId, sellProductSkuId } = item;

      let result = {
        status: status == 0 || status == -1 || status == 1 ? status : 1,
        userId, price, minBuyQty
      }

      if (productSkuId) {
        result.productSkuId = productSkuId;
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

  /**数据回滚时的数据解析***************************************************************************************************************************/

  // 回滚所有SKU数据
  parseMultiSpecData = (rawMultiSpecData) => {

    let selectGradeIds = [];
    let deleteMultiSpecData = []
    let multiSpecData = rawMultiSpecData.map(item => {
      let { multiSpecDataItem, deleteMultiSpecDataItem } = this.parseMultiSpecDataItem(item);
      deleteMultiSpecData.push(deleteMultiSpecDataItem);
      return multiSpecDataItem
    })

    let { userGradePriceList } = rawMultiSpecData[0];

    if (userGradePriceList && userGradePriceList.length) {
      userGradePriceList.forEach(item => {
        selectGradeIds.push(item.gradeId);
        let gradeData = { name: item.gradeName, id: item.gradeId };
        this.addGradeColumn({ gradeData }, true);
      })
    }

    return {
      multiSpecData,
      deleteMultiSpecData,
      selectGradeIds
    }
  }


  // 回滚单个SKU数据
  parseMultiSpecDataItem = (rawMultiSpecDataItem) => {

    if (!rawMultiSpecDataItem) {
      return
    }

    let { userGradePriceList, productSkuId, imageUrl, specValue, sellProductSkuId, ...other } = rawMultiSpecDataItem;
    let multiSpecDataItem = {};
    let deleteMultiSpecDataItem = {};
    let gradeDataObj = {};

    if (rawMultiSpecDataItem && rawMultiSpecDataItem.id) {
      imageUrl = imageUrl ? imageUrl.split("|") : "";
      specValue = getSpecValue(specValue);
    }

    if (userGradePriceList && userGradePriceList.length) {
      userGradePriceList.forEach((item, index) => {
        let gradeKey = `grade_${item.gradeId}`;
        if (!gradeDataObj.hasOwnProperty(gradeKey)) {
          gradeDataObj[gradeKey] = { ...item, productSkuId };
        };
      })
    }

    multiSpecDataItem = {
      productSkuId,
      imageUrl,
      specValue,
      ...other,
      ...gradeDataObj
    }

    deleteMultiSpecDataItem = {
      productSkuId,
      imageUrl,
      specValue,
      ...other,
    }

    if (sellProductSkuId) {

      multiSpecDataItem.sellProductSkuId = sellProductSkuId;
      deleteMultiSpecDataItem.sellProductSkuId = sellProductSkuId;
    }

    return {
      multiSpecDataItem,
      deleteMultiSpecDataItem
    }
  }

  // 回滚用户价格列表数据
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
      let { accountNumber, customerName, specValue, ...other } = item;
      specValue = getSpecValue(specValue);
      return {
        ...other,
        specValue,
        name: customerName,
        phone: accountNumber
      }
    })

    return {
      userPriceList, selectUserIds
    }

  }


  //上传图片的modal
  showUploadModal = (data) => {

    if (data && data.length) {
      this.setState({
        selectProductUrls: data
      })
      this._showUploadModal();
    }
  }

  /**规格等级价编辑 ****************************************************************************************/
  initSpecColumns = () => {
    this.specColumns = [
      {
        title: "", align: "center", width: 100, render: (data, record, index) =>
          <div>
            {
              record.status == 1 ?
                <Popconfirm
                  placement="topLeft" title={<div>确认要禁止订购吗？</div>}
                  onConfirm={() => this.onGradeDataChange('disableSpec', null, null, index, record)}
                >
                  <div>
                    <DeleteItem
                      title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{index + 1}</div>}
                    />
                  </div>
                </Popconfirm>
                :
                <div onClick={() => this.onGradeDataChange('enableSpec', null, null, index, record)}>
                  <DeleteItem
                    onHoverTitle='恢复订购'
                    title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{index + 1}</div>}
                  />
                </div>
            }
          </div>
      },
      {
        title: "主图", align: "center", width: 80, dataIndex: "imageUrl", render: (data, record, index) => (
          <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal(data)}>
            {
              data && data.length ?
                <div>
                  <Badge count={data.length}>
                    <img src={data[0]} style={{ height: 50, width: 50 }} />
                  </Badge>
                </div>
                :
                "--"
            }
          </div>
        )
      },
      { title: "规格", align: "center", width: 150, dataIndex: "specValue", render: data => data || "--" },
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

  addGradeColumn = ({ gradeData }, addColumnOnly) => {

    let { multiSpecData, selectGradeIds } = this.state;
    let gradeName = gradeData.name;
    let gradeId = gradeData.id;
    let length = this.specColumns.length;
    let dataIndexArr = this.specColumns.map(item => item.dataIndex);
    if (dataIndexArr.indexOf(`grade_${gradeId}`) != -1) {
      return;
    }
    let item = this.getGradeColumnsItem(gradeId, gradeName);

    this.specColumns.splice(length - 1, 0, item);
    if (addColumnOnly) {
      return;
    }
    multiSpecData = multiSpecData.map(item => {
      let result = item;
      result[`grade_${gradeId}`] = {
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
      }
      return result
    })
    selectGradeIds.push(gradeId);
    this.setState({
      selectGradeIds,
      multiSpecData
    })
  }

  //删除等级
  deleteGrade = (key, id) => {
    let { selectGradeIds, multiSpecData, isMultiSpec, deleteMultiSpecData } = this.state;
    let idIndex = selectGradeIds.indexOf(id);
    let columnIndex = 0;
    this.specColumns.forEach((item, index) => {
      if (item.dataIndex == `grade_${id}`) {
        columnIndex = index;
      }
    });

    multiSpecData = multiSpecData.map((multiSpecDataItem, i) => {

      let record = multiSpecDataItem[`grade_${id}`];
      let deleteMultiSpecDataItem = deleteMultiSpecData[i] || {};
      if (record.id) {
        deleteMultiSpecDataItem[`grade_${id}`] = {
          ...record,
          status: -1,
          isChange: 1
        }
        deleteMultiSpecData[i] = deleteMultiSpecDataItem;
      }
      multiSpecDataItem[`grade_${id}`] = null;
      return multiSpecDataItem;
    })

    this.specColumns.splice(columnIndex, 1);
    selectGradeIds.splice(idIndex, 1);

    this.setState({
      selectGradeIds,
      multiSpecData,
      deleteMultiSpecData
    })
  }

  onGradeDataChange = (action, gradeIdKey, e, index) => {
    let { multiSpecData, isMultiSpec, userPriceList } = this.state;

    switch (action) {
      case "disable":
      case "enable":
        multiSpecData[index][gradeIdKey]['status'] = action == 'enable' ? 1 : 0;
        break;

      case "disableSpec":
      case "enableSpec":
        multiSpecData[index]['status'] = action == 'enableSpec' ? 1 : 0;
        break;

      default:
        multiSpecData[index][gradeIdKey][action] = e;
        break;
    }

    this.setState({
      multiSpecData
    })
  }

  /**会员价编辑 *************************************************************************************************************/
  userPriceColumns = [
    {
      title: "", align: "center", dataIndex: "text2", width: 100,
      render: (text, record, index) => {
        return {
          children:
            <Popconfirm
              placement="topLeft" title='确认要删除吗？'
              onConfirm={() => this.onUserDataChange(record, 'delete')} >
              <a><Icon title="删除" type='delete' className='margin-right theme-color font-20' />删除</a>
            </Popconfirm >,
          props: {
            rowSpan: index % (this.state.rowSpan) != 0 ? 0 : this.state.rowSpan,
          },
        };
      }
    },
    {
      title: "会员名称", align: "center", width: 100, dataIndex: "name",
      render: (data, record, index) => {

        return {
          children: <span>{data || '--'}</span>,
          props: {
            rowSpan: index % (this.state.rowSpan) != 0 ? 0 : this.state.rowSpan,
          },
        }
      }
    },
    {
      title: "会员手机号", align: "center", width: 100, dataIndex: "phone",
      render: (data, record, index) => {
        return {
          children: <span>{data || '--'}</span>,
          props: {
            rowSpan: index % (this.state.rowSpan) != 0 ? 0 : this.state.rowSpan,
          },
        }
      }
    },
    {
      title: "会员等级", align: "center", dataIndex: "gradeName",
      render: (data, record, index) => {

        return {
          children: <span>{data || '--'}</span>,
          props: {
            rowSpan: index % (this.state.rowSpan) != 0 ? 0 : this.state.rowSpan,
          },
        }
      }
    },
    { title: "商品", align: "center", dataIndex: "specValue", render: data => data || "--" },
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


  //添加会员
  onSelectUser = (data) => {

    let { name, phone, gradeName, id } = data;
    let { selectUserIds, userPriceList, multiSpecData } = this.state;
    let addUserPriceList = multiSpecData.map(item => {
      let { productSkuId, specValue, sellProductSkuId } = item;
      let _id = Date.now() + Math.random() * 10000;
      let resultItem = {
        name,
        _id,
        phone,
        gradeName,
        productSkuId,
        specValue,
        userId: id,
        status: 1,
        //售价
        price: 0,
        //起订量
        minBuyQty: 0
      }
      if (sellProductSkuId) {
        resultItem.sellProductSkuId = sellProductSkuId;
      }
      return resultItem
    })

    userPriceList = userPriceList || [];
    selectUserIds = selectUserIds || [];
    selectUserIds.push(id);
    userPriceList = userPriceList.concat(addUserPriceList);

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
    if (!userPriceList || !userPriceList.length) {
      return;
    }

    let { userId } = userPriceList[0];
    let firstUserPriceList = userPriceList.map(item => item.userId && item.userId == userId);
    
    this.setState({
      userPriceList
    })

  }

  onUserDataChange = (record, action, e) => {

    let { userPriceList } = this.state;
    let { userId, productSkuId, sellProductSkuId, sellProductId } = record;
    let index = 0;
    userPriceList.forEach((item, i) => {
      if (item.userId == userId && ((item.productSkuId && item.productSkuId == productSkuId) || (item.sellProductSkuId && item.sellProductSkuId == sellProductSkuId))) {
        index = i;
      }
    })

    switch (action) {

      case "delete":
        if (!record.id) {
          userPriceList = userPriceList.filter(item => item.userId != userId);
        } else {
          this.deleteUserPrice({ userId })
          return;
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

  deleteUserPrice = ({ userId }) => {
    let { userPriceList, deleteUserPriceList } = this.state;
    deleteUserPriceList = deleteUserPriceList || [];
    let filteredUserPriceList = userPriceList.filter(item => item.userId != userId);
    let newDeleteUserPriceList = userPriceList.filter(item => item.userId == userId);

    newDeleteUserPriceList = newDeleteUserPriceList.map(item => {
      return {
        ...item,
        status: -1,
        isChange: 1
      }
    })

    deleteUserPriceList = deleteUserPriceList.concat(newDeleteUserPriceList);
    let selectUserIds = filteredUserPriceList.map(item => item.userId);

    this.setState({
      userPriceList: filteredUserPriceList,
      deleteUserPriceList,
      selectUserIds
    })
  }

  deleteUserGrade = ({ sellProductId, gradeId }) => {
    let { multiSpecData } = this.state;
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
            <div className='flex-between flex-middle'>
              <span>售价</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('price', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].price}
                disabled={record[`grade_${id}`].status != 1 || record.status == 0}
                precision={2} min={0} />
            </div>
            <div className='flex-between flex-middle'>
              <span>平级推荐奖</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('recommendPrice', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].recommendPrice} disabled={record[`grade_${id}`].status != 1 || record.status == 0}
                precision={2} min={0} />
            </div>
            <div className='flex-between flex-middle'>
              <span>起订量</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('minBuyQty', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].minBuyQty} disabled={record[`grade_${id}`].status != 1 || record.status == 0}
                precision={0} min={0} />
            </div>
            <div className='flex-between flex-middle'>
              <span style={{ marginRight: 5 }}>业绩计算取价</span>
              <InputNumber
                onChange={(e) => this.onGradeDataChange('performancePrice', `grade_${id}`, e, index)}
                value={record[`grade_${id}`].performancePrice} disabled={record[`grade_${id}`].status != 1 || record.status == 0}
                precision={2} min={0} />
            </div>
          </div>
          <div>
            {
              record[`grade_${id}`].status == 1 ?
                <Button onClick={() => this.onGradeDataChange('disable', `grade_${id}`, null, index)} type="danger" style={{ height: "100%", width: 40, textAlign: "center" }}>
                  禁<br />订
                </Button>
                :
                <Button onClick={() => this.onGradeDataChange('enable', `grade_${id}`, null, index)} type="primary" style={{ height: "100%", width: 40, textAlign: "center" }}>
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
    const { multiSpecData, userPriceList, userIsFilered, filtereduserPriceList } = this.state;
    const multiDataSource = multiSpecData && multiSpecData[0] && multiSpecData[0].productSkuId ? multiSpecData : []
    const userPriceListSource = userIsFilered ? filtereduserPriceList : userPriceList;

    return (
      <div className='padding'>
        <div style={{ minHeight: 300 }}>
          <div>
            <Table
              rowClassName={(record) => record.status == 0 ? "bgcolorCCC" : ""}
              indentSize={10}
              rowKey='_id'
              bordered={true}
              columns={this.specColumns}
              loading={this.state.tableLoading}
              pagination={false}
              dataSource={multiDataSource}
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
              rowKey='_id'
              bordered={true}
              columns={this.userPriceColumns}
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
          hasDataList={true}
          dataList={this.state.gradeList}
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

class DeleteItem extends Component {

  state = {
    hovered: false
  }

  onMouseOver = () => {
    this.setState({
      hovered: true
    })
  }

  onMouseLeave = () => {
    this.setState({
      hovered: false
    })
  }

  render() {
    return (
      <div onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
        {
          this.state.hovered ?
            <a>{this.props.onHoverTitle || "禁止订购"}</a>
            :
            <span>{this.props.title}</span>
        }
      </div>
    )
  }
}

export default Page;

