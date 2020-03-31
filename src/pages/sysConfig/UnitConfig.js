import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { getUnitConfigList, saveUnitOrUpdate, deleteUnit } from '../../api/sysConfig/sysConfig';

const _title = "计量单位配置";
const _description = "";



class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }

  componentDidMount() {
    this.getPageData();
  }



  params = {
    page: 1
  }
  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getUnitConfigList(this.params).then(res => {
      this._hideTableLoading();
      let _pagination = pagination(res, (current) => {
        this.params.page = current
        _this.getPageData();
      }, (cur, pageSize) => {
        this.params.page = 1;
        this.params.size = pageSize
        _this.getPageData();
      })
      this.setState({
        tableDataList: res.data,
        pagination: _pagination
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }
  saveUnit = () => {
    this.props.form.validateFields((err, data) => {
      if (err) {
        return;
      }
      let { name } = data;
      saveUnitOrUpdate({ name })
        .then(() => {
          Toast('添加成功');
          this.props.form.resetFields();
          this.getPageData();
        })
    })
  }

  // 删除单位
  deleteUnit = (record) => {
    let { id } = record;
    deleteUnit({ id })
      .then(() => {
        Toast("删除成功！");
        this.getPageData();
      })
  }



  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "单位", dataIndex: "name", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span >
                <a size="small" className="color-red" onClick={() => this.deleteUnit(record)}> 删除</a>
        </span>
      )
    }
  ]

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


  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <CommonPage path='sysConfig.unitConfig.unitConfig' title={_title} description={_description} >

        <div>
          <Form layout='inline' style={{marginBottom:'20px'}}>
            <Form.Item>
              {
                getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '填写单位名称' }
                  ]
                })(
                  <Input placeholder='填写单位名称' allowClear />
                )
              }

            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={() => { this.saveUnit() }}>新增单位</Button>
            </Form.Item>
          </Form>

          <Table
            indentSize={10}
            rowKey="id"
            columns={this.columns}
            loading={this.state.showTableLoading}
            pagination={this.state.pagination}
            dataSource={this.state.tableDataList}
          />
        </div>

      </CommonPage >
    )
  }
}

export default (Form.create()(Page));