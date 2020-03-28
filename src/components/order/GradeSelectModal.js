import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import { getGradeList } from '../../api/user/grade';

class GradeSelectModal extends Component {

  state = {
    tableLoading: false,
    tableDataList: null
  }

  componentDidMount() {
    if (this.props.hasDataList) {
      return;
    }

    this.getPageData();
  }

  componentWillReceiveProps(props) {
    if (props.dataList && props.dataList.length && (!this.props.dataList || this.props.dataList.length)) {
      this.setState({
        tableDataList: this.props.dataList
      })
    }
  }

  params = {
    page: 1
  }


  getPageData = () => {

    if (this.state.tableDataList) {
      return;
    }
    this._showTableLoading();
    getGradeList(this.params).then(tableDataList => {
      this._hideTableLoading();

      this.setState({
        tableDataList
      })
    }).catch(() => {
      this._hideTableLoading();
    })
  }

  _showTableLoading = () => {
    this.setState({
      tableLoading: true
    })
  }

  _hideTableLoading = () => {
    this.setState({
      tableLoading: false
    })
  }

  renderAction = (text, record, index) => {

    let isSelect = false;
    if (this.props.selectIds && this.props.selectIds.length > 0) {
      isSelect = this.props.selectIds.indexOf(record.id) != -1;
    }

    return (
      <span>
        {
          isSelect ?
            <span className='theme-color'>已选择</span>
            :
            <Button onClick={() => this.selectItem(record, index)} type='primary'>选择</Button>
        }
      </span>
    )
  }


  // 表格相关列
  columns = [

    { title: "等级名称", dataIndex: "name", align: 'center', render: data => data || "--" },
    {
      title: '选择', width: 100,
      render: (text, record, index) => this.renderAction(text, record, index)
    }
  ]

  selectItem = (record, index) => {
    let { id } = record;
    let params = {
      gradeData: record,
      id
    }
    this.props.selectItem(params, index);
  }

  onCancel = () => {
    this.props.onCancel();
  }

  render() {
    return (
      <Modal
        maskClosable={false}
        width={600}
        title="选择等级"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
      >
        <div>
          <Table
            indentSize={10}
            rowKey="id"
            columns={this.columns}
            loading={this.state.tableLoading}
            pagination={false}
            dataSource={this.state.tableDataList}
          />
        </div>

      </Modal>
    )
  }
}
export default GradeSelectModal