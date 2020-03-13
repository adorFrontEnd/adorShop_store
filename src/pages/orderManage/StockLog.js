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
import { getStockLogList, batchDeleteStatus } from '../../api/order/StockManage';

const _title = "库存日志";
const _description = "";
const { RangePicker } = DatePicker;


class Page extends Component {

  state = {
    tableDataList: null,
    showTableLoading: false
  }

  componentDidMount() {
    this.getPageData()

  }



  params = {
    page: 1
  }

  getPageData = () => {
    let _this = this;
    this._showTableLoading();
    getStockLogList(this.params).then(res => {
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
    { title: "操作人", dataIndex: "name", render: data => data || "--" },
    { title: "类型", dataIndex: "imageUrl", render: data => data || '--' },
    { title: "订单编号", dataIndex: "specifications", render: data => data || "--" },
    { title: "SKU(编号)", dataIndex: "channel", render: data => data || "--" },
    { title: "变更前", dataIndex: "channel", render: data => data || "--" },
    { title: "变更后", dataIndex: "channel", render: data => data || "--" },
    { title: "变更数", dataIndex: "channel", render: data => data || "--" },
    { title: "变更时间", dataIndex: "channel", render: data => data ? dateUtil.getDateTime(data) : "--" },

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
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      }
    };
    return (
      <CommonPage title={_title} description={_description} >

        <div className='margin10-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form layout='inline'>
            <Form.Item label='时间范围'>
              {
                getFieldDecorator('startCreateTimeStamp')(
                  <RangePicker />
                )
              }
            </Form.Item>
            <Form.Item>
              <Button onClick={this.resetSearch} type='primary'>批量删除</Button>
            </Form.Item>

          </Form>
          <div className='flex-end' style={{  flex: "1 0 auto", marginBottom: 20 }} >
            <Form layout='inline'>
              <Form.Item>
                {
                  getFieldDecorator('operId', {
                    initialValue: "null"
                  })(
                    <Select>
                      <Select.Option value='null'>全部</Select.Option>
                      <Select.Option value='1'>库存管理</Select.Option>
                      <Select.Option value='0'>订货交易</Select.Option>
                    </Select>
                  )
                }
              </Form.Item>
              <Form.Item>
                {
                  getFieldDecorator('inputData')(
                    <Input placeholder='订单编号/SKU编号' />
                  )
                }

              </Form.Item>
              <Form.Item>
                <Button type='primary' onClick={() => { this.getPageData(true) }}>筛选</Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={this.resetSearch} type='primary'>重置</Button>
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