import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Col, Switch, Row, Button, Modal, Popconfirm, Divider } from "antd";
import { NavLink, Link } from 'react-router-dom';
import dateUtil from '../../utils/dateUtil';
import { baseRoute, routerConfig } from '../../config/router.config';
import { pagination } from '../../utils/pagination';
import { SearchForm, SubmitForm } from '../../components/common-form';
import { changeRoute } from '../../store/actions/route-actions';
import { connect } from 'react-redux';
import Toast from '../../utils/toast';
import { listDictionary, delDictionary } from '../../api/sysConfig/sysConfig';

const _title = "智能词库";
const LexiconConfigPath = routerConfig["sysConfig.orderConfig.lexiconConfig"].path;
const _lexiconCategory = {
  "nr": "姓名",
  "prd": "商品",
  "spec": "规格",
  "amq": "数量"
}
const _lexiconCategoryArr = Object.keys(_lexiconCategory).map(item => { return { id: item, name: _lexiconCategory[item] } });
class Page extends Component {

  state = {
    status: false,
    pageDataList: null
  }

  componentDidMount() {
    this.getPageData();
  }

  getNatureStr = (data) => {
    if (!data) {
      return '--';
    }
    if (/prd/.test(data)) {
      return '商品'
    }
    return _lexiconCategory[data]
  }

  // 表格相关列
  columns = [

    { title: "关键词", dataIndex: "realName", render: data => data || "--" },
    { title: "关键类别", dataIndex: "natureStr", render: data => this.getNatureStr(data) },
    { title: "范围", dataIndex: "rangeStr", render: data => data || "--" },
    { title: "创建时间", dataIndex: "gmtCreate", render: data => data ? dateUtil.getDateTime(data) : "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span>
            <NavLink to={LexiconConfigPath + "/" + record.id}>
              查看
            </NavLink>

            <Divider type="vertical" />
            {
              record.natureStr == 'amq' ?
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  cancelText={`删除${record.realName}`}
                  okText={`删除${record.rangeStr}${record.unit}`}
                  onConfirm={() => { this.deleteAmqy(record, true) }}
                  onCancel={() => { this.deleteAmqy(record) }}
                >
                  <a size="small" style={{ color: '#ff8716' }}>删除</a>
                </Popconfirm> :
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={() => { this.deleteClassify(record) }} >
                  <a size="small" style={{ color: '#ff8716' }}>删除</a>
                </Popconfirm>
            }
          </span>
        </span>
      )
    }
  ]

  deleteClassify = (record) => {
    let { id } = record;
    this.delDictionary({ id })
  }

  deleteAmqy = (record, isBatch) => {
    let { id, rangeStr, unit } = record;
    let params = { unit, id };
    if (isBatch) {
      params.rangeStr = rangeStr;
    }
    this.delDictionary(params);
  }

  // 删除
  delDictionary = (params) => {
    delDictionary(params)
      .then(() => {
        Toast("删除成功！");
        this.getPageData();
        return;
      })
  }
  /******查询表单操作****************************************************************************************************************** */
  // 顶部查询表单
  formItemList = [
    {
      type: "SELECT",
      field: "natureStr",
      style: { width: 140 },
      defaultOption: { id: null, name: "所有类别" },
      placeholder: '选择类别',
      initialValue: null,
      optionList: _lexiconCategoryArr
    },
    {
      type: "INPUT",
      field: "realName",
      style: { width: 300 },
      placeholder: "关键字"
    }]

  //查询按钮点击事件
  searchClicked = (params) => {
    let { realName } = params;
    realName = realName || null;
    this.params = {
      page: 1,      
      ...params,
      realName
    }
    this.getPageData();
  }

  params = {
    page: 1
  }

  // 获取页面列表
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    listDictionary(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize;
        _this.getPageData();
      })

      this.setState({
        pageDataList: res.data,
        pagination: _pagination,

      })

    }).catch(() => {
      this._hideTableLoading();
    })
  }

  _showTableLoading = () => {
    this.setState({
      showTableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      showTableLoading: false
    })
  }

  goLexiconConfig = (id) => {
    let title = id == '0' ? '词库配置' : "词库配置"
    this.props.changeRoute({ path: 'sysConfig.orderConfig.lexiconConfig', title, parentTitle: '订单配置' });
  }
  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage title={_title} >
        <div className="flex-between align-center margin-bottom20">
          <NavLink to={LexiconConfigPath + "/0"}>
            <Button type='primary' onClick={() => this.goLexiconConfig('0')}>创建词库</Button>
          </NavLink>
          <div style={{ minWidth: 700 }}>
            <SearchForm
              width={700}
              searchText='筛选'
              towRow={false}
              searchClicked={this.searchClicked}
              formItemList={this.formItemList}
            />
          </div>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.pageDataList}
        />

      </CommonPage>
    )
  }

}
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));