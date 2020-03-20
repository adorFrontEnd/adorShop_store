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

class Page extends Component {

  state = {
    isMultiSpec: false,
    singleSpecData: {},
    singleUserData: [],

    multiSpecClasses: [],
    multiSpecData: [],
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
    filteredSingleUserData: []
  }

  componentDidMount() {
    this.getGradeList();
    this.onSpecDataRevert(this.props.specData);
  }

  componentWillReceiveProps(props) {
    if (!props.specData || (props.specData && props.shouldChange)) {
      this.onSpecDataRevert(props.specData);
    }
  }

  onSpecDataChangeCallback = (isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses) => {
    this.props.onChange({
      isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
    })
  }

  getGradeList = () => {

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
  //规格数据回滚
  onSpecDataRevert = (data) => {

    let isMultiSpec = false;
    if (!data) {
      this._initSpecData();
    } else {
      let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = data;
      this.setState({
        isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
      })
      this.props.onChange({
        isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
      })

    }
  }

  _initSpecData = () => {
    let isMultiSpec = false;
    let singleSpecData = {
      specValue: "无",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
      weight: null
    };
    let multiSpecData = [];
    let multiSpecClasses = [];
    let data = {
      isMultiSpec: false,
      singleSpecData,
      multiSpecClasses,
      multiSpecData,
      uploadModalIsVisible: false,
      selectProductUrls: [],
      selectSpecIndex: 0
    }
    this.setState(data);
    this.props.onChange({
      isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
    })
  }


  initMultiData = () => {

    let { isMultiSpec, singleSpecData } = this.state;

    let multiSpecClasses = [{
      specName: "",
      specValues: [],
      inputSpecValue: ""
    }];

    let multiSpecData = [{
      specValue: "",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
    }];

    this.setState({
      multiSpecClasses,
      multiSpecData
    })
    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses);
  }



  // 增加规格值
  addSpecValue = (specIndex) => {
    let { isMultiSpec, multiSpecClasses, singleSpecData } = this.state;
    let inputSpecValue = multiSpecClasses[specIndex]['inputSpecValue'];
    let specValues = multiSpecClasses[specIndex]['specValues'];

    if (!inputSpecValue) {
      Toast('请输入规格值');
      return
    }

    if (specValues.indexOf(inputSpecValue) !== -1) {
      Toast('规格值重复！');
      return
    }
    multiSpecClasses[specIndex]['specValues'] = [...specValues, inputSpecValue];
    multiSpecClasses[specIndex]['inputSpecValue'] = null;

    let multiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
    this.setState({
      multiSpecClasses,
      multiSpecData
    })
    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses);
  }


  onMultiSpecClassesChange = (action, specIndex, e, index) => {

    let { multiSpecClasses, isMultiSpec, singleSpecData } = this.state;

    switch (action) {

      case "add":
        multiSpecClasses.push(
          {
            specName: "",
            specValues: [],
            inputSpecValue: ""
          }
        )
        break;

      case 'inputSpecValueChange':
        multiSpecClasses[specIndex]["inputSpecValue"] = e.target.value.trim();
        break;

      case 'deleteItem':
        multiSpecClasses[specIndex]["specValues"].splice(index, 1);
        break;

      case 'delete':
        multiSpecClasses.splice(specIndex, 1);
        break;

      case "specNameChange":
        multiSpecClasses[specIndex]['specName'] = e.target.value.trim();;
        break;
    }

    this.setState({
      multiSpecClasses
    })

    if (action == 'deleteItem' || action == 'delete' || action == 'specNameChange') {
      let multiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
      this.setState({
        multiSpecData
      })
      this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses);
    }
  }

  getSpecData = () => {
    let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    return {
      isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses
    }
  }

  //修改规格详细数据
  onMultiSpecDataChange = (index, key, e) => {
    let { multiSpecData, isMultiSpec, singleSpecData, multiSpecClasses } = this.state;

    switch (key) {
      case 'number':
      case 'barCode':
        let val = e.target.value;
        multiSpecData[index][key] = val;
        break;

      case 'marketPrice':
      case 'costPrice':
      case "weight":
        multiSpecData[index][key] = e;
        break;

      case 'delete':
        multiSpecData.splice(index, 1);
        break
    }

    this.setState({
      multiSpecData
    })
    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses);
  }


  //上传图片的modal
  showUploadModal = (isMultiSpec, selectSpecIndex) => {

    let { singleSpecData, multiSpecData } = this.state;
    let selectProductUrls = [];
    if (!isMultiSpec) {
      selectProductUrls = singleSpecData['imageUrl'] || [];
    } else {
      selectProductUrls = multiSpecData[selectSpecIndex]["imageUrl"] || [];
    }

    this.setState({
      selectSpecIndex,
      selectProductUrls
    })
    this._showUploadModal();
  }

  /**规格等级价编辑 ****************************************************************************************/

  singleSpecColumns = [
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
    let item = {
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
    let { isMultiSpec, singleUserData } = this.state;
    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
  }

  deleteGrade = (key, id) => {
    let { selectGradeIds, singleSpecData, isMultiSpec, singleUserData } = this.state;
    let idIndex = selectGradeIds.indexOf(id);
    let columnIndex = 0;
    this.singleSpecColumns.forEach((item, index) => {
      if (item.dataIndex == `grade_${id}`) {
        columnIndex = index;
      }
    })
    this.singleSpecColumns.splice(columnIndex, 1);
    selectGradeIds.splice(idIndex, 1);
    singleSpecData[`grade_${id}`] = null;
    this.setState({
      selectGradeIds,
      singleSpecData
    })

    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
  }

  onGradeDataChange = (action, gradeIdKey, e) => {
    let { singleSpecData, isMultiSpec, singleUserData } = this.state;
    if (action == 'disable' || action == 'enable') {
      singleSpecData[gradeIdKey]['status'] = action == 'enable' ? 1 : 0;
    } else {
      singleSpecData[gradeIdKey][action] = e;
    }
    this.setState({
      singleSpecData
    })

    this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
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
          <InputNumber value={record['price']} precision={2} min={0} onChange={(e) => this.onUserDataChange(record, 'price', e)} />
          <span className='margin0-10'>起订量</span>
          <InputNumber value={record['minBuyQty']} precision={0} min={0} onChange={(e) => this.onUserDataChange(record, 'minBuyQty', e)} />
        </div>
    }
  ]

  onSelectUser = (data) => {

    let { name, phone, gradeName, id } = data;
    let { selectUserIds, singleUserData, singleSpecData } = this.state;
    selectUserIds.push(id);
    singleUserData.push({
      name,
      phone,
      gradeName,
      productSkuId: singleSpecData.id,
      userId: id,
      status: 1,
      //售价
      price: 0,
      //起订量
      minBuyQty: 0
    });
    this.setState({
      selectUserIds,
      singleUserData
    })
    // let { isMultiSpec } = this.state;
    // this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
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
    let { singleUserData, gradeIdMap } = this.state;
    likeName = likeName && likeName.trim();
    if (!gradeId && !likeName) {
      this.setState({
        userIsFilered: false
      })
      return
    }

    let filteredSingleUserData = [];

    if (gradeId) {
      let gradeName = gradeIdMap[gradeId];
      filteredSingleUserData = singleUserData.filter(item => item.gradeName == gradeName);
    } else {
      filteredSingleUserData = singleUserData;
    }

    if (likeName) {
      filteredSingleUserData = filteredSingleUserData.filter(item => {
        let reg = new RegExp(likeName, "ig");
        return reg.test(item.phone) || reg.test(item.name)
      });
    }

    this.setState({
      filteredSingleUserData,
      userIsFilered: true
    })

  }

  setAllToFirstUser = () => {
    let { singleUserData } = this.state;
    let { price } = singleUserData[0];
    singleUserData = singleUserData.map(item => {
      return {
        ...item,
        price
      }
    })
    this.setState({
      singleUserData
    })
    // let { isMultiSpec,singleSpecData } = this.state;
    // this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
  }

  onUserDataChange = (record, action, e) => {

    let { singleUserData } = this.state;
    let { userId } = record;
    let index = 0;
    singleUserData.forEach((item, i) => {
      if (item.userId == userId) {
        index = i;
      }
    })

    switch (action) {
      case "delete":
        singleUserData.splice(index, 1);
        break;

      case "price":
      case "minBuyQty":
        singleUserData[index][action] = e;
        break;

      case 'status':
        singleUserData[index][action] = e ? 1 : 0;
        break;
    }


    this.setState({
      singleUserData
    })
    // let { isMultiSpec,singleSpecData } = this.state;
    // this.onSpecDataChangeCallback(isMultiSpec, singleSpecData, singleUserData);
  }

  /***渲染**********************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const { specValues, multiSpecClasses, multiSpecData, singleSpecData, singleUserData, userIsFilered, filteredSingleUserData } = this.state;
    const singleDataSource = singleSpecData && singleSpecData.id ? [singleSpecData] : null
    const singleUserDataSource = userIsFilered ? filteredSingleUserData : singleUserData;

    return (
      <div className='padding'>

        <div style={{ minHeight: 300 }}>
          {
            !this.state.isMultiSpec ?
              <div>
                <div>
                  <Table
                    indentSize={10}
                    rowKey='id'
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
                        singleUserDataSource && singleUserDataSource.length > 1 ?
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
                    dataSource={singleUserDataSource}
                  />
                </div>
                <Button type='primary' className='normal' onClick={this.showUserModal}>添加</Button>
              </div>

              :
              <div>
                <Row style={{ border: "1px solid #d9d9d9" }}>
                  <Col offset={2} span={6} className='padding'>规格名称</Col>
                  <Col span={16} className='padding'>规格值<span className='color-red'>（可使用键盘“回车键”快速添加规格值）</span></Col>
                </Row>

                <div className='margin-bottom'>
                  {
                    multiSpecClasses && multiSpecClasses.length ?
                      multiSpecClasses.map((specItem, specIndex) =>
                        <Row key={specIndex} style={{ border: "1px solid #d9d9d9", marginTop: "-1px" }}>
                          <Col span={2} className='padding text-center'>
                            <Popconfirm
                              placement="topLeft" title='确认删除该规格吗？'
                              onConfirm={() => this.onMultiSpecClassesChange('delete', specIndex)}
                            >
                              <div>
                                <DeleteItem
                                  title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
                                />
                              </div>
                            </Popconfirm>
                          </Col>
                          <Col span={6} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                            <Input placeholder='输入规格名称' value={specItem.specName} onChange={(e) => this.onMultiSpecClassesChange('specNameChange', specIndex, e)} style={{ minWidth: 100, maxWidth: 140 }} />
                          </Col>
                          <Col span={16} className='padding flex-middle'>
                            {
                              multiSpecClasses[specIndex]['specValues'] && multiSpecClasses[specIndex]['specValues'].length ?
                                multiSpecClasses[specIndex]['specValues'].map((item, index) =>
                                  <div key={item} style={{ marginRight: "14px", background: "#ff8716", color: "#fff", position: "relative", borderRadius: "3px", padding: "6px 10px" }}
                                  >
                                    <span >{item}</span>
                                    <a onClick={() => this.onMultiSpecClassesChange('deleteItem', specIndex, null, index)} style={{ right: "-8px", top: "-4px", position: "absolute", textAlign: "center", fontSize: "20px", borderRadius: "50%", background: "#d96609", color: "#fff", display: 'inline-block', width: '20px', height: 20, lineHeight: "16px" }}>
                                      ×
                                    </a>
                                  </div>
                                )
                                : null
                            }
                            <Input placeholder='输入规格值' value={multiSpecClasses[specIndex]['inputSpecValue']} style={{ maxWidth: 140 }} onChange={(e) => this.onMultiSpecClassesChange('inputSpecValueChange', specIndex, e)} onPressEnter={() => this.addSpecValue(specIndex)} />
                          </Col>
                        </Row>
                      )
                      :
                      <div className='text-center line-height40 color-gray' style={{ border: "1px solid #ccc", marginTop: "-1px" }}>暂无数据</div>
                  }
                </div>
                {
                  multiSpecClasses.length <= 2 ?
                    <Button className='margin-left' type='primary' onClick={() => this.onMultiSpecClassesChange('add')}>添加规格</Button>
                    : null
                }
                <Row style={{ border: "1px solid #d9d9d9", marginTop: "10px" }}>
                  <Col span={1} className='padding'></Col>
                  <Col span={2} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>主图</Col>
                  <Col span={3} className='padding' >规格</Col>
                  <Col span={4} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>商品编码</Col>
                  <Col span={4} className='padding' >条形码</Col>
                  <Col span={3} className='padding' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>划线价</Col>
                  <Col span={3} className='padding'>成本价</Col>
                  <Col span={3} className='padding'>重量</Col>
                </Row>

                {
                  multiSpecData && multiSpecData.length ?
                    multiSpecData.map((specDataItem, specIndex) =>
                      <Row key={specIndex} style={{ border: "1px solid #d9d9d9", marginTop: "-1px", display: 'flex', alignItems: 'auto' }}>
                        <Col span={1} className='padding flex-center align-center'>
                          <Popconfirm
                            placement="topLeft" title='确认删除该规格吗？'
                            onConfirm={() => this.onMultiSpecDataChange(specIndex, 'delete')}
                          >
                            <div>
                              <DeleteItem
                                title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
                              />
                            </div>
                          </Popconfirm>
                        </Col>
                        <Col span={2} className='flex-middle flex-center' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal(true, specIndex)}>
                            {
                              specDataItem['imageUrl'] && specDataItem['imageUrl'].length ?
                                <div className='padding'>
                                  <Badge count={specDataItem['imageUrl'].length}>
                                    <img src={specDataItem['imageUrl'][0]} style={{ height: 50, width: 50 }} />
                                  </Badge>
                                </div>
                                :
                                <div style={{ margin: "0 auto", border: "1px dashed #ccc", borderRadius: "4px", padding: 10 }}>
                                  <Icon type='plus' style={{ fontSize: 20 }} />
                                </div>
                            }
                          </div>
                        </Col>
                        <Col span={3} className='padding flex-center align-center'><div>{specDataItem.specValue}</div></Col>
                        <Col span={4} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <Input placeholder='输入商品编码' value={specDataItem['number']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'number', e)} />
                        </Col>
                        <Col span={4} className='padding flex-middle'>
                          <Input placeholder='输入条形码' value={specDataItem['barCode']} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'barCode', e)} />
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9", borderRight: "1px solid #d9d9d9" }}>
                          <InputNumber value={specDataItem['marketPrice']} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'marketPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle'>
                          <InputNumber value={specDataItem['costPrice']} precision={2} min={0} placeholder='输入成本价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'costPrice', e)} />
                          元
                        </Col>
                        <Col span={3} className='padding flex-middle' style={{ borderLeft: "1px solid #d9d9d9" }}>
                          <InputNumber suffix="kg" value={specDataItem['weight']} precision={2} min={0} placeholder='输入重量' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'weight', e)} />
                          kg
                        </Col>
                      </Row>

                    )
                    :
                    <div className='text-center line-height40 color-gray' style={{ border: "1px solid #ccc", marginTop: "-1px" }}>暂无数据</div>
                }
              </div>
          }
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

  resetPictures = () => {
    let { selectProductUrls } = this.state;
    this.setState({
      selectProductUrls: []
    })
  }
}

export default Form.create()(Page);

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
            <a>删除</a>
            :
            <span>{this.props.title}</span>
        }
      </div>
    )
  }
}