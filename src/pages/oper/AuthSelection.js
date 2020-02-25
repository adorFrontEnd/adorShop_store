import React, { Component } from "react";
import { Table, Form, Tabs, Tree, Input, Icon, List, Spin, Button, Row, Col, Popconfirm } from "antd";
import CommonPage from '../../components/common-page';
import { getRouter } from '../../router/routerParse';
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
      .then(allAuth => {
        let normalAuthSortMap = this.getSourceSortNumMap(allAuth);
        let allAuthList = allAuth.map(item => item.source);
        let authTree = getRouter(allAuthList, true);
        this.setState({
          authTree,
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


