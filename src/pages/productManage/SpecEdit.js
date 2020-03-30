import React, { Component } from "react";
import { Col, Row, Checkbox, Modal, Select, Table, Spin, Icon, Button, Badge, Input, Radio, InputNumber, Popconfirm } from 'antd';
import Toast from '../../utils/toast';
import PictureWall from '../../components/upload/PictureWall';
import ProductPictureWall from '../../components/upload/ProductPictureWall';
import { _getSpecDataBySpecClasses } from './specUtils';
import { deleteSpec } from '../../api/product/product';

class Page extends Component {

  state = {
    isMultiSpec: false,
    singleSpecData: {},
    multiSpecClasses: [],
    multiSpecData: [],
    uploadModalIsVisible: false,
    selectProductUrls: [],
    selectSpecIndex: 0,
    deleteMuiltiSpecData: [],
    deleteMultiSpecClasses: []
  }

  componentDidMount() {
    this.onSpecDataRevert(this.props.specData);
  }

  componentWillReceiveProps(props) {
    if (props.shouldChange && !this.props.shouldChange) {
      this.onSpecDataRevert(props.specData);
    }
  }

  getSpecData = () => {
    let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses, deleteMultiSpecClasses, deleteMuiltiSpecData } = this.state;
    if (deleteMultiSpecClasses && deleteMultiSpecClasses.length) {
      deleteMultiSpecClasses = deleteMultiSpecClasses.map(item => {
        let newItemValue = item["deleteValue"] ? [...item["value"], ...item["deleteValue"]] : item["value"];
        newItemValue = newItemValue.filter(item => item.status == -1);
        return {
          ...item,
          value: newItemValue
        }
      })
    }

    if (multiSpecClasses && multiSpecClasses.length) {
      multiSpecClasses = multiSpecClasses.map(item => {
        let newItemValue = item["deleteValue"] ? [...item["value"], ...item["deleteValue"]] : item["value"];
        return {
          ...item,
          value: newItemValue
        }
      })
    }

    return {
      isMultiSpec,
      singleSpecData,
      multiSpecData: [...multiSpecData, ...deleteMuiltiSpecData],
      multiSpecClasses: [...multiSpecClasses, ...deleteMultiSpecClasses]
    }
  }

  //规格数据回滚
  onSpecDataRevert = (data) => {

    let isMultiSpec = false;
    if (!data) {
      this._initSpecData();
    } else {
      let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = data;

      this.setState({
        isMultiSpec,
        singleSpecData,
        multiSpecData,
        multiSpecClasses,
        deleteMuiltiSpecData: [],
        deleteMultiSpecClasses: []
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

  }

  muiltiChecked = (e) => {
    let isMultiSpec = e.target.checked;
    let { singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    if (isMultiSpec) {
      this.initMultiData()
    }
    this.setState({
      isMultiSpec
    })

  }

  initMultiData = () => {

    let { isMultiSpec, singleSpecData } = this.state;

    let multiSpecClasses = [{
      _id: Date.now() + Math.random() * 1000,
      name: "",
      value: [],
      inputSpecValue: "",
      status: 1,
    }];

    let multiSpecData = [{
      specValue: "",
      imageUrl: [],
      number: "",
      barCode: "",
      marketPrice: null,
      costPrice: null,
      status: 1,
      _id: Date.now() + Math.random() * 1000,
    }];

    this.setState({
      multiSpecClasses,
      multiSpecData
    })
  }



  // 增加规格值
  addSpecValue = (specIndex) => {
    let { isMultiSpec, multiSpecClasses, singleSpecData, multiSpecData } = this.state;
    let inputSpecValue = multiSpecClasses[specIndex]['inputSpecValue'];
    let totalSpecValues = this.getTotalSpecValues(multiSpecClasses);
    let specValues = multiSpecClasses[specIndex]['value'];

    if (!inputSpecValue) {
      Toast('请输入规格值');
      return
    }

    if (/[\!|\@|\#|\$|\^|\&|\%|\*]/.test(inputSpecValue)) {
      Toast("请不要输入!@#$^&%等特殊字符！")
      return;
    }

    if (totalSpecValues.indexOf(inputSpecValue) !== -1) {
      Toast('规格值重复！');
      return
    }
    multiSpecClasses[specIndex]['value'].push({ name: inputSpecValue });
    multiSpecClasses[specIndex]['inputSpecValue'] = null;

    let newMultiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
    multiSpecData = this.joinSpecDataBySpecValueMap(newMultiSpecData, multiSpecData);
    this.setState({
      multiSpecClasses,
      multiSpecData
    })
  }

  getTotalSpecValues = (multiSpecClasses) => {
    if (!multiSpecClasses || !multiSpecClasses.length) {
      return []
    }
    let totalSpecValues = multiSpecClasses.reduce(function (sum, item) {
      if (item && item.value && item.value.length) {
        let specArr = item.value.map(i => i.name);
        return [...sum, ...specArr]
      }
      return sum
    }, []);
    return totalSpecValues

  }


  onMultiSpecClassesChange = (action, specIndex, e, index, record, item) => {

    let { multiSpecClasses, isMultiSpec, singleSpecData, multiSpecData } = this.state;
    let id = record && record.id;
    let itemId = item && item.id;

    switch (action) {

      case "add":
        multiSpecClasses.push(
          {
            name: "",
            value: [],
            inputSpecValue: "",
            _id: Date.now() + Math.random() * 1000,
          }
        )
        this.deleteAllSpecItem();
        break;

      case 'inputSpecValueChange':
        multiSpecClasses[specIndex]["inputSpecValue"] = e.target.value.trim();
        break;

      case 'deleteItem':
        if (!itemId) {
          multiSpecClasses[specIndex]["value"].splice(index, 1);
        } else {
          this.deleteSpecGroupItemValue(id, itemId, specIndex, index);
          return;
        }

        break;

      case 'delete':
        if (!id) {
          multiSpecClasses.splice(specIndex, 1);
        } else {
          this.deleteSpecGroup(id);
          return;
        }
        break;

      case "specNameChange":
        multiSpecClasses[specIndex]['name'] = e.target.value.trim();;
        break;
    }

    this.setState({
      multiSpecClasses
    })

    if (action == 'deleteItem' || action == 'delete') {
      let newMultiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
      multiSpecData = this.joinSpecDataBySpecValueMap(newMultiSpecData, multiSpecData);
      this.setState({
        multiSpecData
      })
    }
  }



  //修改规格详细数据
  onMultiSpecDataChange = (index, key, e, record) => {
    let { multiSpecData, isMultiSpec, singleSpecData, multiSpecClasses } = this.state;
    let id = record && record.id;

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
        if (!id) {
          multiSpecData.splice(index, 1);
        } else {
          this.deleteSpec([id]);
          return;
        }

        break
    }

    this.setState({
      multiSpecData
    })
  }

  //删除规格值
  deleteSpecGroupItemValue = (id, itemId, specIndex, index) => {
    let { multiSpecClasses, multiSpecData, deleteMuiltiSpecData, deleteMultiSpecClasses } = this.state;

    let deleteItem = multiSpecClasses[specIndex]['value'][index];
    let deleteValue = multiSpecClasses[specIndex]['deleteValue'] || [];
    deleteValue.push({ ...deleteItem, status: -1, isChange: 1 });
    multiSpecClasses[specIndex]['value'].splice(index, 1);
    multiSpecClasses[specIndex]['deleteValue'] = deleteValue;
    let ItemValue = deleteItem['name'];
    multiSpecData = multiSpecData.filter(item => {
      let specValues = item.specValue.split(' ');
      let itemValueIndex = specValues.indexOf(ItemValue);
      let isFilter = itemValueIndex == -1;
      if (item.id && !isFilter) {
        deleteMuiltiSpecData.push({
          ...item,
          status: -1
        })
      }
      return isFilter
    })


    this.setState({
      multiSpecClasses,
      multiSpecData,
      deleteMuiltiSpecData
    })

  }

  // 删除所有规格详情
  deleteAllSpecItem = () => {
    let { multiSpecData } = this.state;
    let skuIdArr = multiSpecData && multiSpecData.length > 0 ? multiSpecData.map(item => item.id).filter(i => Boolean(i)) : null;
    this.deleteSpec(skuIdArr);
  }

  //删除规格组
  deleteSpecGroup = (groupId) => {

    if (!groupId) {
      return;
    }

    let { multiSpecClasses, multiSpecData } = this.state;
    let skuIdArr = multiSpecData && multiSpecData.length > 0 ? multiSpecData.map(item => item.id).filter(i => Boolean(i)) : null;
    this.deleteSpec(skuIdArr, groupId);
  }

  //删除规格
  deleteSpec = (skuIdArr, groupId) => {

    let { multiSpecClasses, multiSpecData, deleteMultiSpecClasses, deleteMuiltiSpecData } = this.state;
    let newMultiSpecData = [];
    if (skuIdArr && skuIdArr.length) {

      multiSpecData = multiSpecData.filter(item => {
        let shouldDelete = item.id && skuIdArr.indexOf(item.id) != -1;
        if (shouldDelete) {
          deleteMuiltiSpecData.push({
            ...item,
            status: -1,
            isChange: 1
          })
        }
        return !shouldDelete
      });

      this.setState({
        deleteMuiltiSpecData
      })


    }

    if (groupId) {
      multiSpecClasses = multiSpecClasses.filter(item => {
        let shouldDelete = item.id && groupId == item.id;
        if (shouldDelete) {
          let _value = item.value.map(element => {
            return {
              ...element,
              status: -1,
              isChange: 1
            }
          }).filter(item => Boolean(item.id));
          deleteMultiSpecClasses.push({
            ...item,
            value: _value,
            status: -1,
            isChange: 1
          })
        }
        return !shouldDelete
      })
      this.setState({
        deleteMultiSpecClasses
      })
    }

    if (!multiSpecData || !multiSpecData.length) {
      multiSpecData = _getSpecDataBySpecClasses(multiSpecClasses);
    }

    this.setState({
      multiSpecData,
      multiSpecClasses
    })

  }




  //修改规格详细数据
  onSingleSpecDataChange = (key, e) => {
    let { isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;

    switch (key) {
      case 'number':
      case 'barCode':
        let val = e.target.value;
        singleSpecData[key] = val;
        break;

      case 'marketPrice':
      case 'costPrice':
      case 'weight':
        singleSpecData[key] = e;
        break;
    }

    this.setState({
      singleSpecData
    })

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


  uploadPicture = (picList) => {
    let selectProductUrls = picList || [];
    this.setState({
      selectProductUrls
    })
  }

  onSavePitureModal = () => {
    let { selectProductUrls, selectSpecIndex, isMultiSpec, singleSpecData, multiSpecData, multiSpecClasses } = this.state;
    if (!isMultiSpec) {
      singleSpecData['imageUrl'] = selectProductUrls;
      this.setState({
        singleSpecData
      })
    } else {
      multiSpecData[selectSpecIndex]['imageUrl'] = selectProductUrls;
      this.setState({
        multiSpecData
      })
    }

    this.hideUploadModal();
  }

  joinSpecDataBySpecValueMap = (newMultiSpecData, oldMultiSpecData) => {
    let specMap = {};
    if (!oldMultiSpecData || !oldMultiSpecData.length || !newMultiSpecData || !newMultiSpecData.length) {
      return newMultiSpecData
    }

    oldMultiSpecData.forEach(item => {
      let specValue = item.specValue;
      if (specValue) {
        specMap[specValue] = item;
      }
    })

    let result = newMultiSpecData.map(item => {
      let specValue = item.specValue;
      return specMap[specValue] ? specMap[specValue] : item
    })
    return result;
  }

  /***渲染**********************************************************************************************************/

  render() {

    const { specValues, multiSpecClasses, multiSpecData, singleSpecData } = this.state;
    const singleDataSource = [{ _id: 1, ...singleSpecData }];

    return (
      <div className='padding'>
        <div style={{ background: "#f2f2f2" }} className='color333 padding border-radius font-16'>
          <Checkbox disabled={this.props.isEdit} checked={this.state.isMultiSpec} onChange={this.muiltiChecked}>多规格</Checkbox>
        </div>
        <div style={{ minHeight: 300 }}>
          {
            !this.state.isMultiSpec ?
              <div>
                <Table
                  dataSource={singleDataSource}
                  indentSize={10} rowKey='_id' bordered={true} columns={this.singleSpecColumns}
                  pagination={false}
                />
              </div>
              :
              <div>
                <div className='margin-bottom' >
                  <Table
                    dataSource={multiSpecClasses} columns={this.multiSpecClassesColumn}
                    indentSize={10} rowKey='_id'
                    pagination={false} bordered={true}
                  />
                </div>
                {
                  multiSpecClasses.length <= 2 ?
                    <Button onClick={() => this.onMultiSpecClassesChange('add')} className='margin-left margin-bottom' type='primary'>添加规格</Button>
                    : null
                }
                <div>
                  <Table
                    dataSource={multiSpecData} columns={this.multiSpecColumns}
                    indentSize={10} rowKey='_id' bordered={true}
                    pagination={false}
                  />
                </div>
              </div>
          }
        </div>
        <div className='color-red line-height24 padding-top'>
          注意：<br />
          1、可够渠道中勾选了直购，则可编辑直购价格；<br />
          2、可够渠道中勾选了订货，则可编辑分销订货价格；<br />
          3、可够渠道中勾选了云市场，则可编辑云市场结算价格。<br />
        </div>
        <Modal
          visible={this.state.uploadModalIsVisible}
          okText='保存'
          onOk={this.onSavePitureModal}
          onCancel={this.hideUploadModal}
          width={640}
          title='SKU图片信息'
        >
          <div className='color-red line-height40'>
            第一个为主图，其余为SKU的轮播图，最多上传15张
            <Button onClick={this.resetPictures} type="primary" className='margin-left'>清空所有图片</Button>
          </div>
          <ProductPictureWall
            allowType={['1', '2']}
            uploadCallback={this.uploadPicture}
            pictureList={this.state.selectProductUrls || []}
            limitFileLength={15}
            folder='product'
          />
        </Modal>
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

  singleSpecColumns = [
    { title: "", align: "center", dataIndex: "text2", width: 50, render: (text, data, index) => <span>{index + 1}</span> },
    {
      title: "主图", align: "center", dataIndex: "imageUrl", render: (data, record, index) => (
        <div className='flex-middle flex-center' style={{ cursor: "pointer" }} onClick={() => this.showUploadModal()}>
          {
            data && data.length ?
              <div className='padding'>
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
    { title: "规格", align: "center", dataIndex: "specValue", render: data => data || "无" },
    {
      title: "商品编码", align: "center", dataIndex: "number", render: data =>
        <Input placeholder='输入商品编码'
          value={data}
          style={{ maxWidth: "100%" }}
          onChange={(e) => this.onSingleSpecDataChange('number', e)}
        />
    },
    {
      title: "条形码", align: "center", dataIndex: "barCode", render: data =>
        <Input placeholder='输入条形码'
          value={data}
          style={{ maxWidth: "100%" }}
          onChange={(e) => this.onSingleSpecDataChange('barCode', e)} />
    },
    {
      title: "划线价（元）", align: "center", dataIndex: "marketPrice", render: data =>
        <InputNumber
          value={data}
          precision={2} min={0}
          placeholder='输入划线价' style={{ width: 120 }}
          onChange={(e) => this.onSingleSpecDataChange('marketPrice', e)}
        />
    },
    {
      title: "成本价（元）", align: "center", dataIndex: "costPrice", render: data =>
        <InputNumber
          value={data}
          precision={2} min={0}
          placeholder='输入成本价' style={{ width: 120 }}
          onChange={(e) => this.onSingleSpecDataChange('costPrice', e)}
        />
    },
    {
      title: "重量（kg）", align: "center", dataIndex: "weight", render: data =>
        <InputNumber
          value={data} precision={2} min={0}
          placeholder='输入重量' style={{ width: 120 }}
          onChange={(e) => this.onSingleSpecDataChange('weight', e)}
        />
    },
  ]

  multiSpecClassesColumn = [
    {
      title: "规格组", align: "center", dataIndex: "text2", width: 100, render: (text, data, specIndex) =>
        <Popconfirm
          placement="topLeft" title={<div>删除该规格组时，所有的规格详情数据都将清空，<br />同时不可恢复，确认要删除吗？</div>}
          onConfirm={() => this.onMultiSpecClassesChange('delete', specIndex, null, null, data)}
        >
          <div>
            <DeleteItem
              title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
            />
          </div>
        </Popconfirm>
    },
    {
      title: "规格名称", align: "center", dataIndex: "name", width: 300,
      render: (data, record, specIndex) =>
        <div>
          <Input placeholder='输入规格名称' value={data} onChange={(e) => this.onMultiSpecClassesChange('specNameChange', specIndex, e)} style={{ minWidth: 100, maxWidth: 140 }} />
        </div>
    },
    {
      title: <div>规格值<span className='color-red'>（可使用键盘“回车键”快速添加规格值）禁止输入空格!@#$^&%*等特殊字符</span></div>,
      dataIndex: "value",
      render: (data, record, specIndex) => <div className='flex-middle'>
        {
          data && data.length ?
            data.map((item, index) =>
              <div key={item.name} style={{ marginRight: "14px", background: "#ff8716", color: "#fff", position: "relative", borderRadius: "3px", padding: "6px 10px" }}
              >
                <span >{item.name}</span>
                {
                  item.id ?
                    <Popconfirm
                      placement="topLeft" title={<div>删除该规格值时，相关的规格详情数据都将删除，<br />同时不可恢复，确认要删除吗？</div>}
                      onConfirm={() => this.onMultiSpecClassesChange('deleteItem', specIndex, null, index, record, item)}
                    >
                      <a style={{ right: "-8px", top: "-4px", position: "absolute", textAlign: "center", fontSize: "20px", borderRadius: "50%", background: "#d96609", color: "#fff", display: 'inline-block', width: '20px', height: 20, lineHeight: "16px" }}>
                        ×
                      </a>
                    </Popconfirm>
                    :
                    <a
                      onClick={() => this.onMultiSpecClassesChange('deleteItem', specIndex, null, index, item)}
                      style={{ right: "-8px", top: "-4px", position: "absolute", textAlign: "center", fontSize: "20px", borderRadius: "50%", background: "#d96609", color: "#fff", display: 'inline-block', width: '20px', height: 20, lineHeight: "16px" }}>
                      ×
                    </a>
                }


              </div>
            )
            : null
        }
        <Input placeholder='输入规格值'
          value={record.inputSpecValue}
          style={{ maxWidth: 140 }}
          onChange={(e) => this.onMultiSpecClassesChange('inputSpecValueChange', specIndex, e)} onPressEnter={() => this.addSpecValue(specIndex)} />
      </div>
    }
  ]


  multiSpecColumns = [
    {
      title: "规格详情", align: "center", dataIndex: "text2", width: 100, render: (data, record, specIndex) =>
        <Popconfirm
          placement="topLeft" title='删除该规格详情不可恢复，确认删除吗？'
          onConfirm={() => this.onMultiSpecDataChange(specIndex, 'delete', null, record)}
        >
          <div>
            <DeleteItem
              title={<div className='theme-color' style={{ cursor: "pointer", fontSize: '16px' }}>{specIndex + 1}</div>}
            />
          </div>
        </Popconfirm>
    },
    {
      title: "主图", align: "center", dataIndex: "imageUrl", render: (data, record, specIndex) => (
        <div className='flex-middle flex-center' style={{ cursor: "pointer" }}
          onClick={() => this.showUploadModal(true, specIndex)}>
          {
            data && data.length ?
              <div className='padding'>
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
    { title: "规格", align: "center", dataIndex: "specValue", render: data => <div style={{ minWidth: 130 }}>{data}</div> || "无" },
    {
      title: "商品编码", align: "center", dataIndex: "number", render: (data, record, specIndex) =>
        <Input placeholder='输入商品编码' value={data} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'number', e)} />
    },
    {
      title: "条形码", align: "center", dataIndex: "barCode", render: (data, record, specIndex) =>
        <Input placeholder='输入条形码' value={data} style={{ maxWidth: "100%" }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'barCode', e)} />
    },
    {
      title: "划线价（元）", align: "center", dataIndex: "marketPrice", render: (data, record, specIndex) =>
        <InputNumber value={data} precision={2} min={0} placeholder='输入划线价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'marketPrice', e)} />

    },
    {
      title: "成本价（元）", align: "center", dataIndex: "costPrice", render: (data, record, specIndex) =>
        <InputNumber value={data} precision={2} min={0} placeholder='输入成本价' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'costPrice', e)} />
    },
    {
      title: "重量（kg）", align: "center", dataIndex: "weight", render: (data, record, specIndex) =>
        <InputNumber suffix="kg" value={data} precision={2} min={0} placeholder='输入重量' style={{ width: 120 }} onChange={(e) => this.onMultiSpecDataChange(specIndex, 'weight', e)} />
    },
  ]

}

export default Page;

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