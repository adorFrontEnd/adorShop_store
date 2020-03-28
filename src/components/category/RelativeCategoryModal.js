import React, { Component } from "react";
import { Input, Select, Form, Button, Checkbox, Radio, Modal, Row, Col, Tree, Icon } from 'antd'
import { getIdMap, getSelectArrTotalName, getCheckedNamesByIds, getCleanRelativeIdsById } from './categoryUtils';
import { searchList, searchAllList } from '../../api/setting/ClasssifySetting';
import { getTreeMapAndData, getListMapAndData } from '../../utils/tree';
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

    this.getAllClassify();
  }

  componentWillReceiveProps(props) {

    if (!this.props.visible && props.visible) {
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
    if (this.props.showList) {
      categoryIds = categoryIds.filter(item => idMap[item]);
      let categoryList = categoryIds.map(item => {
        return {
          id: item,
          totalName: idMap[item]['name']
        }
      })
      this.setState({
        checkedKeys: categoryIds,
        categoryList
      })
      return;
    }
    let categoryList = getSelectArrTotalName(categoryIds, idMap);
    this.setState({
      checkedKeys: {
        checked: categoryIds,
        halfChecked: []
      },
      categoryList
    })
  }
  //获取所有分类
  getAllClassify = () => {
    this.setState({
      showClassifyLoading: true
    })
    searchAllList()
      .then((res) => {
        let rawClassifyList = res.data;
        let idMap = getIdMap(rawClassifyList, this.props.showList)
        this.setState({
          idMap
        })
        this.getClassify(idMap);
      })
      .catch(() => {
        this.setState({
          showClassifyLoading: false
        })
      })
  }
  // 获取店铺所有分类
  getClassify = (idMap) => {
    this.setState({
      showClassifyLoading: true
    })
    searchList()
      .then((res) => {
        let rawClassifyList = res.data;
        if (this.props.showList) {
          rawClassifyList = rawClassifyList.map(item => {
            return {
              ...item,
              name: idMap[item.id]['name']
            }
          })
        }
        let parseMapData = this.props.showList ? getListMapAndData : getTreeMapAndData
        let { treeData, treeMap } = parseMapData(rawClassifyList);
        this.setState({
          showClassifyLoading: false,
          treeData,
          treeMap,
          rawClassifyList
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

    if (this.props.showList) {
      let checkedIds = checkedKeys;
      if (this.props.maxLength && (checkedIds && checkedIds.length > this.props.maxLength)) {
        Toast(`最多选择${this.props.maxLength}个`);
        return;
      }
      let categoryList = checkedKeys.map(item => {
        return {
          id: item,
          totalName: idMap[item]['name']
        }
      })
      let category = categoryList.map(item => item.totalName).join('、');
      let params = {
        categoryIds: checkedKeys,
        category,
        categoryList
      };
      this.props.onOk(params)
      return;
    }

    let checkedIds = checkedKeys.checked;
    if (this.props.maxLength && (checkedIds && checkedIds.length > this.props.maxLength)) {
      Toast(`最多选择${this.props.maxLength}个`);
      return;
    }
    let category = getCheckedNamesByIds(idMap, checkedIds, "、");
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

  onListCheck = (checkedKeys) => {
    let { categoryIds, idMap } = this.state;
    let categoryList = checkedKeys.map(item => {
      return {
        id: item,
        totalName: idMap[item]['name']
      }
    })

    this.setState({
      checkedKeys,
      categoryList
    })
  }

  delateClass = (item) => {

    let { checkedKeys, idMap } = this.state;
    let { id } = item;
    let newCheckedIds = checkedKeys.filter(i => i != id);

    if (this.props.showList) {
      let categoryList = newCheckedIds.map(item => {
        return {
          id: item,
          totalName: idMap[item]['name']
        }
      })

      this.setState({
        categoryList,
        checkedKeys: newCheckedIds
      });
      return;
    }

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
      keywords: inputKeywords
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
            {
              this.props.showList ?
                <Tree

                  showIcon
                  checkedKeys={this.state.checkedKeys}
                  defaultExpandAll={false}
                  checkable
                  onCheck={this.onListCheck}
                  treeData={this.state.treeData}
                  filterTreeNode={this.filterTreeNode}
                /> :
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
            }


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