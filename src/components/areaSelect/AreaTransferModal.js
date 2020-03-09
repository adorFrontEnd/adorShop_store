import React, { Component } from "react";
import { Input, Select, Form, Button, Checkbox, Radio, Modal, Row, Col, Tree, Icon, Spin } from 'antd'
import { searchList } from '../../api/setting/ClasssifySetting';
import { getTreeMapAndData, getIdMap } from './areaUtils';
import Toast from "../../utils/toast";
import { getAllCityList } from '../../api/SYS/SYS';
import '../category/category.less';

const { TreeNode } = Tree;


class AModal extends Component {

  state = {
    showTreeLoading: false,
    areaList: [],
    checkedKeys: [],
    halfCheckedKeys: [],
    treeData: [],
    idMap: {},
    selectTreeData: []
  }


  componentDidMount() {
    this.getAllCityList();
  }

  getAllCityList = () => {
    let { areaList } = this.state;
    if (areaList && areaList.length > 0) {
      return;
    }
    this.setState({
      showTreeLoading: true
    })
    getAllCityList()
      .then((areaList) => {
        let { treeData } = getTreeMapAndData(areaList);
        let idMap = getIdMap(areaList);
        this.setState({
          treeData,
          idMap,
          showTreeLoading: false
        });
      })
      .catch(() => {
        this.setState({
          showTreeLoading: false
        })
      })
  }

  onCheck = (checkedKeys, e) => {
    let { halfCheckedKeys } = e;
    this.setState({
      checkedKeys,
      halfCheckedKeys
    })

  }

  onCancel = () => {
    this.props.onCancel();
  }

  onOk = () => {
    let { checkedAreaIds, idMap } = this.state;
    let areaName = this._getLevel1Names(checkedAreaIds, idMap);
    let params = { checkedAreaIds, areaName };
    this.props.onOk(params);
    this.props.onCancel();
  }

  // 添加
  addClicked = () => {
    let { checkedKeys, idMap, halfCheckedKeys } = this.state;
    let { checkedAreaIds, checkedAreaList } = this.getTotalCheckedAreaList(checkedKeys, halfCheckedKeys, idMap);
    let { treeData } = getTreeMapAndData(checkedAreaList);
    this.setState({
      checkedAreaList,
      checkedAreaIds,
      selectTreeData: treeData
    })
  }

  getTotalCheckedAreaList = (checkedKeys, halfCheckedKeys, idMap) => {

    let checkedAreaIds = [...checkedKeys, ...halfCheckedKeys];
    let checkedAreaList = checkedAreaIds.map(id => idMap[id]);

    return {
      checkedAreaIds,
      checkedAreaList
    }
  }

  deleteTreeItemClick = (key, level) => {
    this._deleteTreeItemClick(key, level);
  }

  _deleteTreeItemClick = (key, level) => {
    let { checkedAreaIds, idMap } = this.state;
    let newKeys = [];
    let newHalfCheckedKeys = [];

    if (level == '1' || level == '2') {
      let id = key.toString();
      newKeys = this._deleteKeysById(checkedAreaIds, id, level);
    }

    if (level == '3') {
      let id = key.toString();
      newKeys = this._deleteKeysById(checkedAreaIds, id, '3');
    }

    let totalData = this.getTotalCheckedAreaList(newKeys, [], idMap);
    let checkedAreaList = totalData.checkedAreaList;
    let { treeData } = getTreeMapAndData(checkedAreaList);
    let selectTreeData = treeData;

    this.setState({
      // checkedKeys: newKeys,
      // halfCheckedKeys: newHalfCheckedKeys,
      checkedAreaIds: newKeys,
      selectTreeData: selectTreeData || []
    })
  }

  // _deleteTreeItemClick1 = (key, level) => {
  //   let { checkedKeys, halfCheckedKeys, idMap } = this.state;
  //   let newKeys = [];
  //   let newHalfCheckedKeys = [];

  //   if (level == '1' || level == '2') {
  //     let id = key.toString();
  //     newKeys = this._deleteKeysById(checkedKeys, id, level);
  //     newHalfCheckedKeys = this._deleteHalfKeysById(newKeys, halfCheckedKeys, id, level);
  //   }

  //   if (level == '3') {
  //     let id = key.toString();
  //     newKeys = this._deleteKeysById(checkedKeys, id, '3');
  //     newHalfCheckedKeys = this._deleteHalfKeysById(newKeys, halfCheckedKeys, id, '3');
  //   }

  //   let { checkedAreaIds, checkedAreaList } = this.getTotalCheckedAreaList(newKeys, newHalfCheckedKeys, idMap);
  //   let { treeData } = getTreeMapAndData(checkedAreaList);
  //   let selectTreeData = treeData;

  //   this.setState({
  //     // checkedKeys: newKeys,
  //     // halfCheckedKeys: newHalfCheckedKeys,
  //     checkedAreaIds,
  //     selectTreeData: selectTreeData || []
  //   })
  // }

  _deleteKeysById = (keys, id, level) => {

    let subKeys = [];
    if (level == '1') {
      subKeys = keys.filter(item => item.substr(0, 2) != id.substr(0, 2))
      return subKeys || []
    }

    if (level == '2') {
      subKeys = keys.filter(item => item.substr(0, 4) != id.substr(0, 4))
      if (!subKeys || !subKeys.length) {
        return []
      }

      //如果删除第二级时，第二级的同级兄弟id也没有一例，第一级也需要删除。
      let level2_SiblingsKeys = this._getSiblingsKeys(subKeys, id, '2');
      if (level2_SiblingsKeys && level2_SiblingsKeys.length) {
        return subKeys || []
      }
      let level1Id = id.substr(0, 2) + "0000";
      // 删除相关的第一级
      subKeys = subKeys.filter(item => item != level1Id);
      return subKeys || []
    }

    if (level == '3') {
      subKeys = keys.filter(item => item != id);
      if (!subKeys || !subKeys.length) {
        return []
      }

      //如果删除第三级时，第三级的同级兄弟id也没有一例，第二级也需要删除。
      let level3_SiblingsKeys = this._getSiblingsKeys(subKeys, id, '3');
      if (level3_SiblingsKeys && level3_SiblingsKeys.length) {
        return subKeys || []
      }

      let level2Id = id.substr(0, 4) + "00";
      // 删除相关的第二级
      subKeys = subKeys.filter(item => item != level2Id);  
      let level2_SiblingsKeys = this._getSiblingsKeys(subKeys, level2Id, '2');
      if (level2_SiblingsKeys && level2_SiblingsKeys.length) {
        return subKeys || []
      }
      let level1Id = id.substr(0, 2) + "0000";
      // 删除相关的第一级
      subKeys = subKeys.filter(item => item != level1Id); 
      return subKeys || []
    }
  }


  _deleteHalfKeysById = (keys, halfKeys, id, level) => {

    let subKeys = [];
    if (!keys || !keys.length) {
      return [];
    }

    if (level == '1') {
      subKeys = halfKeys.filter(item => item.substr(0, 2) != id.substr(0, 2))
      return subKeys || []
    }

    if (level == '2') {
      subKeys = halfKeys.filter(item => item.substr(0, 4) != id.substr(0, 4));
      if (!subKeys || !subKeys.length) {
        return []
      }

      //如果删除第二级时，第二级的同级兄弟id也没有一例，第一级也需要删除。
      let level2_SiblingsKeys = this._getSiblingsKeys(keys, id, '2');

      if (level2_SiblingsKeys && level2_SiblingsKeys.length) {
        return subKeys || []
      }
      let level1Id = id.substr(0, 2) + "0000";
      // 删除相关的第一级
      let result = subKeys.filter(item => item != level1Id);
      return result || []
    }

    if (level == '3') {
      subKeys = halfKeys.filter(item => item != id)
      return subKeys || []
    }
  }

  _getSiblingsKeys = (keys, id, level) => {

    if (!keys || !keys.length) {
      return [];
    }

    if (level == '2') {
      let level1Id = id.substr(0, 2);
      let result = keys.filter(item => item.substr(0, 2) == level1Id && item.substr(2, 2) != '00' && item.substr(4, 2) == '00')
      return result;
    }

    if (level == '3') {
      let level2Id = id.substr(0, 4);
      let result = keys.filter(item => item.substr(0, 4) == level2Id && item.substr(4, 2) != '00')
      return result;
    }
  }

  _getLevel1Names = (arr, idMap) => {

    if (!arr || !arr.length) {
      return;
    }

    let level1Ids = arr.filter(item => item.substr(2, 4) == '0000');
    let result = level1Ids.map(item => idMap[item]['name']).join('、');
    return result;
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { checkedKeys, treeData, selectTreeData, showTreeLoading } = this.state;
    return (
      <Modal
        visible={this.props.visible}
        title={this.props.title || "地区选择"}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width={900}
      >
        <div style={{ display: 'flex' }}>
          <Input allowClear style={{ width: "194px" }} onChange={this.onKeywordsChange} />
          <Button type='primary' onClick={this.onsearchClick} style={{ margin: '0 10px' }}>搜索</Button>
          <Button type='primary' onClick={this.resetClicked}>重置</Button>
        </div>
        <div style={{ display: 'flex', alignItems: "stretch" }}>
          <div style={{ width: '44%' }}>
            <div style={{ border: "1px solid #ccc" }} className='margin-top border-radius'>
              <div className='font-14 line-height40 text-center' style={{ backgroundColor: "#f2f2f2" }}>可选省市区</div>
              <div style={{ padding: "10px 10px 10px 10px" }}>
                <Spin spinning={showTreeLoading}>
                  <Tree
                    style={{ height: 550, overflowY: "auto" }}
                    showIcon
                    checkedKeys={this.state.checkedKeys}
                    defaultExpandAll={false}
                    checkable
                    onCheck={this.onCheck}
                    treeData={treeData}
                    filterTreeNode={this.filterTreeNode}
                  >

                  </Tree>
                </Spin>
              </div>
            </div>
          </div>

          <div style={{ width: '12%' }} className='flex-center align-center'>
            <Button disabled={!checkedKeys || checkedKeys.length == 0} onClick={this.addClicked}>添加</Button>
          </div>

          <div style={{ width: '44%', height: 612 }}>
            <div style={{ border: "1px solid #ccc" }} className='margin-top border-radius'>
              <div className='font-14 line-height40 text-center' style={{ backgroundColor: "#f2f2f2" }}>已选省市区</div>
              <div style={{ padding: "10px 10px 10px 10px", height: 570 }}>
                <Tree
                  showIcon
                  style={{ height: 550, overflowY: "auto" }}
                  defaultExpandAll={false}
                >
                  {
                    this.renderTreeNode(selectTreeData)
                  }
                </Tree>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  // 左侧的菜单渲染
  renderTreeNode = (data) => {
    return data.map((item) => {

      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={
              <div className='flex-between align-center' style={{ minWidth: 140 }}>
                <span className='margin-right20'>{item.title}</span>
                <Icon onClick={() => this.deleteTreeItemClick(item.key, item.arealevel)} type='close-circle' title='删除' style={{ fontSize: 18 }} />
              </div>
            }
          >
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={
            <div className='flex-between align-center' style={{ minWidth: 140 }}>
              <span className='margin-right20'>{item.title}</span>
              <Icon onClick={() => this.deleteTreeItemClick(item.key, item.arealevel)} type='close-circle' title='删除' style={{ fontSize: 18 }} />
            </div>
          }
          key={item.key}
        />
      )
    })
  }

  // 左侧的菜单渲染
  renderTreeNode1 = (data) => {
    return data.map((item) => {

      if (item.children) {
        return (
          <TreeNode
            key={item.key}
            title={item.title}
          >
            {this.renderTreeNode1(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          title={item.title}
          key={item.key}
        />
      )
    })
  }

  /**渲染**********************************************************************************************************************************/

}


export default Form.create()(AModal);