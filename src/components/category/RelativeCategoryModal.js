import React, { Component } from "react";
import { Input, Select, Form, Button, Checkbox, Radio, Modal, Row, Col, Tree, Icon } from 'antd'
import { getIdMap, getSelectArrTotalName, getCheckedNamesByIds, getCleanRelativeIdsById } from './categoryUtils';
import { searchList } from '../../api/setting/ClasssifySetting';
import { parseTree, getTreeMapAndData } from '../../utils/tree';
import './category.less';
import Toast from "../../utils/toast";

const { TreeNode } = Tree;

class cModal extends Component {

  state = {
    categoryList: [],
    showClassifyLoading: false,
    rawClassifyList: null,
    treeData: [],
    idMap: {},
    checkedKeys: {
      checked: [],
      halfChecked: []
    },
    keywords: null,
    inputKeywords: null
  }

  componentDidMount() {
    this.getClassify();
  }

  componentWillReceiveProps(props) {

    if ((!this.props.visible && props.visible) || this.compareIds(this.props.categoryIds, props.categoryIds)) {
      this.reverData(props.categoryIds);
    }
  }

  compareIds = (ids, newIds) => {
    if (!ids || !newIds || ids.length != newIds.length) {
      return true
    }
    return
  }

  reverData = (categoryIds) => {

    categoryIds = categoryIds || [];
    let { idMap } = this.state;
    let categoryList = getSelectArrTotalName(categoryIds, idMap);
    this.setState({
      checkedKeys: {
        checked: categoryIds,
        halfChecked: []
      },
      categoryList
    })
  }

  // 获取所有分类
  getClassify = () => {
    this.setState({
      showClassifyLoading: true
    })
    searchList()
      .then(res => {
        let rawClassifyList = res.data;
        let { treeData, treeMap } = getTreeMapAndData(rawClassifyList);
        let idMap = getIdMap(rawClassifyList)
        this.setState({
          showClassifyLoading: false,
          treeData,
          treeMap,
          rawClassifyList,
          idMap
        })
      })
      .catch(() => {
        this.setState({
          showClassifyLoading: false
        })
      })
  }


  onCancel = () => {
    this.props.onCancel()
  }

  onOk = () => {
    let { checkedKeys, idMap } = this.state;
    let checkedIds = checkedKeys.checked;
    if (this.props.maxLength && (checkedIds && checkedIds.length > this.props.maxLength)) {
      Toast(`最多选择${this.props.maxLength}个`);
      return;
    }
    let category = getCheckedNamesByIds(idMap, checkedIds, " ");
    let categoryList = getSelectArrTotalName(checkedIds, idMap);

    let params = {
      categoryIds: checkedIds,
      category,
      categoryList
    };
    this.props.onOk(params)
  }



  //更改选择树
  onCheck = (newCheckedKeys, info) => {
    let { categoryIds, rawClassifyList, idMap, checkedKeys } = this.state;
    let oldCheckedIds = checkedKeys.checked;
    let newCheckedIds = newCheckedKeys.checked;
    if (newCheckedIds.length > oldCheckedIds.length) {
      let id = newCheckedIds[newCheckedIds.length - 1];
      newCheckedIds = getCleanRelativeIdsById(id, newCheckedIds, idMap, rawClassifyList);
    }
    newCheckedKeys.checked = newCheckedIds;
    let categoryList = getSelectArrTotalName(newCheckedIds, idMap);
    this.setState({
      checkedKeys: newCheckedKeys,
      categoryList
    })
  };

  delateClass = (item) => {
    let { checkedKeys, idMap } = this.state;
    let { id } = item;
    let newCheckedIds = checkedKeys.checked.filter(i => i != id);
    let categoryList = getSelectArrTotalName(newCheckedIds, idMap);
    this.setState({
      categoryList,
      checkedKeys: {
        checked: newCheckedIds,
        halfChecked: []
      }
    });
  }

  filterTreeNode = (node) => {
    let { keywords } = this.state;
    if (!keywords) {
      return false
    }
    return node.props.name.indexOf(keywords) != -1
  }

  onKeywordsChange = (e) => {
    let inputKeywords = e.currentTarget.value;
    this.setState({
      inputKeywords
    })
  }

  //搜索
  onsearchClick = () => {

    let { inputKeywords } = this.state;
    this.setState({
      keywords:inputKeywords
    })
  }

  resetClicked = () => {
    this.setState({
      keywords: null
    })
  }

  render() {

    const { shopOper, category, categoryList } = this.state
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={this.props.visible}
        title={this.props.title || "商品分类"}
        onOk={this.onOk}
        onCancel={this.onCancel}
        width={900}
      >
        <div style={{ display: 'flex', position: 'relative' }}>
          <div style={{ width: '50%', padding: '24px', borderRight: '1px solid #f2f2f2' }}>

            <div style={{ display: 'flex' }}>
              <Input allowClear style={{ width: "240px" }} onChange={this.onKeywordsChange} />
              <Button type='primary' onClick={this.onsearchClick} style={{ margin: '0 10px' }}>搜索</Button>
              <Button type='primary' onClick={this.resetClicked}>重置</Button>
            </div>
            <div className='font-14 margin-top margin-left'>所有分类</div>
            <Tree
              checkStrictly={true}
              showIcon
              checkedKeys={this.state.checkedKeys}
              defaultExpandAll={false}
              checkable
              onCheck={this.onCheck}
              treeData={this.state.treeData}
              filterTreeNode={this.filterTreeNode}
            />

          </div>
          <div style={{ padding: '10px', width: '50%' }} className='flex-column flex-between'>
            <div className='flex-wrap' style={{ minHeight: 100 }}>
              {
                categoryList && categoryList.map((item, index) =>
                  (
                    <div key={index} className='border-radius classitem flex-between flex-middle' >
                      <span>{item.totalName}</span>
                      <Icon onClick={() => this.delateClass(item)} style={{ fontSize: 16 }} type="close" />
                    </div>
                  )
                )
              }
            </div>
            <div className='color-red margin-top'>一个商品最多选择5个分类，如选择了父类则其子类不可选择</div>
          </div>
        </div>
      </Modal>
    )
  }

  /**渲染**********************************************************************************************************************************/

}


export default Form.create()(cModal);