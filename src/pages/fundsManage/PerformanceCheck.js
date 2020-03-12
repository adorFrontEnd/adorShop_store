import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, AutoComplete, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, DatePicker } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';


const _title = "业绩审核";
const _description = "";
const { RangePicker } = DatePicker;


class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }

  componentDidMount() {


  }



  params = {
    page: 1
  }


  // 重置
  resetClicked = () => {
    this.props.form.resetFields();
  }

  // 打开modal
  showAuthModal = (data) => {
    this.setState({
      newItemModalVisible: true
    })
  }

  // 隐藏modal
  _hideNewItemModal = () => {
    this.setState({
      newItemModalVisible: false
    })
  }


  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "客户名", dataIndex: "name", render: data => data || "--" },
    { title: "客户级别", dataIndex: "imageUrl", render: data => data || '--' },
    { title: "业绩生成时间", dataIndex: "specifications", render: data => data || "--" },
    { title: "业绩确认时间", dataIndex: "channel", render: data => data || "--" },
    { title: "状态", dataIndex: "channel", render: data => data || "--" },
    { title: "团队业绩", dataIndex: "channel", render: data => data || "--" },
    { title: "返点比例", dataIndex: "channel", render: data => data || "--" },
    { title: "业绩返点", dataIndex: "channel", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <span onClick={() => this.showEditModalClick()}>导出</span>
          <Divider type="vertical" />
          <Popconfirm
            placement="topLeft" title='确认要删除吗？'
            onConfirm={() => { this.deleteTableItem(record) }} >
            <a size="small" className="color-red">删除</a>
          </Popconfirm>
        </span>
      )
    }
  ]
  showEditModalClick = (data) => {
    this.showAuthModal(data);
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

  /**渲染**********************************************************************************************************************************/

  render() {
    const { getFieldDecorator } = this.props.form;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return (
      <CommonPage title={_title} description={_description} >

        <div className='margin10-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form layout='inline'>
            <Form.Item>
              {
                getFieldDecorator('operId', {
                  initialValue: "null"
                })(
                  <Select>
                    <Select.Option value='null'>全部状态</Select.Option>
                    <Select.Option value='1'>正常</Select.Option>
                    <Select.Option value='0'>已封</Select.Option>
                  </Select>
                )
              }
            </Form.Item>
            <Form.Item>
              <Button onClick={this.resetSearch} type='primary'>批量通过</Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={this.resetSearch} type='primary'>批量拒绝</Button>
            </Form.Item>
          </Form>
          <div className='flex-end' style={{ minWidth: 862, flex: "1 0 auto", marginBottom: 20 }} >
            <Form layout='inline'>
              <Form.Item>
                {
                  getFieldDecorator('operId', {
                    initialValue: "null"
                  })(
                    <Select>
                      <Select.Option value='null'>全部状态</Select.Option>
                      <Select.Option value='1'>正常</Select.Option>
                      <Select.Option value='0'>已封</Select.Option>
                    </Select>
                  )
                }
              </Form.Item>
              <Form.Item label='时间范围'>
                {
                  getFieldDecorator('startCreateTimeStamp')(
                    <RangePicker />
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('inputData')(
                    <Input placeholder='客户名称' />
                  )
                }

              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={() => { this.getPageData(true) }}>查询</Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={this.resetSearch} type='primary'>重置</Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={this.resetSearch} type='primary'>批量导出业绩</Button>
              </Form.Item>
            </Form>


          </div>
        </div>
        <Table
          indentSize={10}
          rowKey="id"
          columns={this.columns}
          loading={this.state.showTableLoading}
          pagination={this.state.pagination}
          dataSource={this.state.tableDataList}
          rowSelection={rowSelection}
        />
      </CommonPage >
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