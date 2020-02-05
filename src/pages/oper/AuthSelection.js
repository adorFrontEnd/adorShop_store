import React, { Component } from "react";
import { Table, Form, Tabs, Tree, Input, Icon, List, Spin, Button, Row, Col, Popconfirm } from "antd";
import CommonPage from '../../components/common-page';
import { getAllRouter } from '../../router/routerParse';
import { getAllList } from '../../api/oper/role';
import Toast from "../../utils/toast";

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

class AuthSelection extends Component {

  state = {
    roleList: [],
    allSpecAuthList: [],
    authTree: [],
    selectId: null,
    selectRoleAuth: null,
    selectRoleSpecAuth: null,
    authLoading: false,
    canRenderTree: false


  }

  componentDidMount() {
    this._getAllAuthList();
  }

  componentWillReceiveProps() {
    if (!this.state.authTree || !this.state.authTree.length) {
      this._getAllAuthList();
    }
  }

  _getAllAuthList = () => {

    this.setState({
      authLoading: true
    })

    getAllList()
      .then(data => {
        let allAuth = data.filter(item => item.level != 2);
        let normalAuthSortMap = this.getSourceSortNumMap(allAuth);
        let allSpecAuth = data.filter(item => item.level == 2);
        let allAuthList = allAuth.map(item => item.source);
        let allSpecAuthList = allSpecAuth.map(item => { return { key: item.source, title: item.name } });
        let authTree = getAllRouter(allAuthList);
        this.setState({
          authTree,
          allSpecAuthList,
          canRenderTree: true,
          authLoading: false,
          normalAuthSortMap
        })
      })
      .catch(() => {
        this.setState({
          canRenderTree: true,
          authLoading: false
        })
      })
  }

  getSourceSortNumMap = (arr) => {
    if (!arr || !arr.length) {
      return {}
    }
    let sortMap = {};
    arr.forEach(item => {
      sortMap[item.source] = item.id;
    })
    return sortMap;
  }

  sortBySourceSortNumMap = (checkedKeys) => {
    if (!checkedKeys || !checkedKeys.length) {
      return;
    }
    let map = this.state.normalAuthSortMap;
    checkedKeys.sort(
      function (a, b) {
        return parseInt(map[a]) - parseInt(map[b])
      }
    )   
    return checkedKeys;
  }


  selectRole = (id) => {

    let arr = [];
    if (!this.state.roleList || !this.state.roleList.length) {
      return;
    }

    if (!id) {
      arr = this.state.roleList;
    } else {
      arr = this.state.roleList.filter(item => item.id == id);
    }
    let selectRoleAuth = arr[0].models ? arr[0].models.split(',') : [];
    this.setState({
      selectId: arr[0].id,
      selectRoleAuth
    })
  }

  onCheck = (checkedKeys, info) => {

    let selectRoleAuth = this.sortBySourceSortNumMap(checkedKeys);
    this.setState({
      selectRoleAuth
    })
    this.props.onCheckedChange(selectRoleAuth);
  }

  onSpecAuthCheck = (checkedKeys, info) => {
    this.setState({
      selectRoleSpecAuth: checkedKeys
    })
    this.props.onSpecCheckedChange(checkedKeys);
  }

  // 左侧的菜单渲染
  renderTreeNode = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key}>
            {this.renderTreeNode(item.children)}
          </TreeNode>
        )
      }
      return (
        <TreeNode title={item.title} key={item.key} />
      )
    })
  }

  renderTree = () => {
    if (this.state.canRenderTree && this.state.authTree && this.state.allSpecAuthList) {
      return (
        <div>
          <Tree
            showIcon
            checkedKeys={this.props.selectRoleAuth || []}
            defaultExpandAll={false}
            checkable
            onSelect={this.onSelect}
            onCheck={this.onCheck}
          >
            <TreeNode icon={<Icon type="deployment-unit" />} title="所有权限" key="all">
              {
                this.renderTreeNode(this.state.authTree)
              }
            </TreeNode>
          </Tree>
          <Tree
            showIcon
            checkedKeys={this.props.selectRoleSpecAuth || []}
            defaultExpandAll={false}
            checkable
            onSelect={this.onSelect}
            onCheck={this.onSpecAuthCheck}
          >
            <TreeNode icon={<Icon type="deployment-unit" />} title="所有高级权限" key="all">
              {
                this.state.allSpecAuthList.length ?
                  this.state.allSpecAuthList.map(item =>
                    <TreeNode title={item.title} key={item.key} />
                  )
                  :
                  null
              }
            </TreeNode>
          </Tree>
        </div>
      )
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (

      <div>

        <Spin spinning={this.state.authLoading}>
          <div className='border-e8'>
            {
              this.renderTree()
            }
          </div>
        </Spin>
      </div>

    )
  }
}



export default Form.create()(AuthSelection);


