import React, { Component } from 'react'
import areaList from './areaData';
import { Modal, Row, Col, Checkbox, Icon, Select, Input, Button } from 'antd';
import Toast from '../../utils/toast';

export default class AreaSelectModal extends Component {

  state = {
    areaList: [],
    areaMap: {},
    cityMap: {},
    districtMap: {},

    selectedProviceId: null,
    selectedCityId: null,
    selectedDistrictId: null,

    hasChangedAreaMap: false,


  }

  componentDidMount() {

    let areaMap = this.getInitCheckedAreaMap(areaList);
    this.setState({
      areaList,
      areaMap
    }, () => {
      if (this.props.checkedAreaData) {
        this.checkedDataRevert(this.props.checkedAreaData)
      }
    })

  }

  componentWillReceiveProps(props) {

    if (JSON.stringify(props.checkedAreaData) != JSON.stringify(this.props.checkedAreaData) || this.state.hasChangedAreaMap) {

      this.checkedDataRevert(props.checkedAreaData);
    }
  }


  /*根据区域列表数组初始化地区的map*******************************************************************************************************/

  getInitCheckedAreaMap = (areaList) => {
    let areaMap = {};
    areaList.forEach(provice => {
      let proviceId = provice.id;
      let cityMap = provice.list;
      if (!areaMap[proviceId]) {
        areaMap[proviceId] = { name: provice.name, children: {} };
      }
      cityMap.forEach(city => {
        let cityId = city.id;
        let districtMap = city.list;
        if (!areaMap[proviceId]['children'][cityId]) {
          areaMap[proviceId]['children'][cityId] = { name: city.name, children: {} }
        }
        districtMap.forEach(district => {
          let districtId = district.id;
          if (!areaMap[proviceId]['children'][cityId]['children'][districtId]) {
            areaMap[proviceId]['children'][cityId]['children'][districtId] = { name: district.name }
          }
        })
      })
    })

    return areaMap
  }

  onLevel1Change = (e) => {
    let selectedCityId = null;
    let selectedDistrictId = null;
    let selectedProviceId = e;
    let areaMap = this.state.areaMap;
    let cityMap = e ? areaMap[selectedProviceId]['children'] : {};
    let districtMap = {}

    this.setState({
      selectedProviceId,
      selectedCityId,
      selectedDistrictId,
      cityMap,
      districtMap
    })
  }

  onLevel2Change = (e) => {
    let selectedCityId = e;
    let { areaMap, selectedProviceId } = this.state;
    let districtMap = e ? areaMap[selectedProviceId]['children'][selectedCityId]['children'] : {};
    let selectedDistrictId = null;
    this.setState({
      selectedCityId,
      districtMap,
      selectedDistrictId
    })
  }

  onLevel3Change = (e) => {
    let selectedDistrictId = e;
    this.setState({
      selectedDistrictId
    })
  }

  getSelectDistrict = () => {

    let { areaMap, cityMap, districtMap, selectedProviceId, selectedCityId, selectedDistrictId } = this.state;
    if (!selectedProviceId) {
      Toast('请选择省！');
      return;
    }
    if (!selectedCityId) {
      Toast('请选择市！');
      return;
    }
    if (!selectedDistrictId) {
      Toast('请选择区！');
      return;
    }

    let selectedProviceName = areaMap[selectedProviceId]['name'];
    let selectedCityName = areaMap[selectedProviceId]['children'][selectedCityId]['name'];
    let selectedDistrictName = areaMap[selectedProviceId]['children'][selectedCityId]['children'][selectedDistrictId]['name'];
    let result = {
      proviceId: selectedProviceId,
      proviceName: selectedProviceName,
      cityId: selectedCityId,
      cityName: selectedCityName,
      districtId: selectedDistrictId,
      districtName: selectedDistrictName
    }
    return result;

  }

  onOk = () => {
    let result = this.getSelectDistrict();   
    this.props.onOk(result);
  }
  /**数据回滚 **************************************************************************************************************/


  render() {

    const { areaMap, cityMap, districtMap, selectedProviceId, selectedCityId, selectedDistrictId } = this.state;

    return (

      <Modal maskClosable={false}
        zIndex={1004}
        className='noPadding'
        title='选择地区'
        footer={null}
        visible={this.props.visible}
        onCancel={this.props.hide}
        width={800}
      >
        <div className='line-height40 padding20' style={{ minHeight: 400 }}>
          <Row>
            <Col span={8} >选择省：</Col>
            <Col span={8} >选择市：</Col>
            <Col span={8} >选择区：</Col>
          </Row>
          <Row>
            <Col span={8}>
              <Select style={{ width: 200 }} defaultValue={null} value={selectedProviceId} onChange={this.onLevel1Change}>
                <Select.Option value={null}>请选择</Select.Option>
                {
                  Object.keys(areaMap).map(item => (
                    <Select.Option key={item} value={item}>{areaMap[item]["name"]}</Select.Option>
                  ))
                }
              </Select>
            </Col>
            <Col span={8}>
              <Select style={{ width: 200 }} defaultValue={null} value={selectedCityId} onChange={this.onLevel2Change}>
                <Select.Option value={null}>请选择</Select.Option>
                {
                  Object.keys(cityMap).length ?
                    Object.keys(cityMap).map(item => (
                      <Select.Option key={item} value={item}>{cityMap[item]["name"]}</Select.Option>
                    ))
                    : null
                }
              </Select>
            </Col>
            <Col span={8}>
              <Select style={{ width: 200 }} defaultValue={null} value={selectedDistrictId} onChange={this.onLevel3Change}>
                <Select.Option value={null}>请选择</Select.Option>
                {
                  Object.keys(districtMap).length ?
                    Object.keys(districtMap).map(item => (
                      <Select.Option key={item} value={item}>{districtMap[item]["name"]}</Select.Option>
                    ))
                    : null
                }
              </Select>
            </Col>
          </Row>
          <div style={{textAlign:"right",marginTop:"200px",marginRight:"50px"}}>
            <Button type='primary' className='normal' onClick={this.onOk}>保存</Button>
          </div>
        </div>
      </Modal>
    )
  }
}