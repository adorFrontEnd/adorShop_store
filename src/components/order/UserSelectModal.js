import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../../components/common-form';
import Toast from '../../utils/toast';
import { pagination } from '../../utils/pagination';
import { searchPublicSelectMember } from '../../api/order/order';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class UserModal extends Component {

  state = {
    tableLoading: false
  }

  componentDidMount() {
    this.getPageData();
  }


  params = {
    page: 1
  }

  //查询按钮点击事件
  searchClicked = (params) => {

    let { likeName } = params;
    likeName = likeName || null;
    this.params = {
      page: 1,
      ...params,
      likeName
    }
    this.getPageData();
  }

  getPageData = () => {

    let _this = this;
    this._showTableLoading();

    searchPublicSelectMember(this.params).then(res => {
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

    return (
      <span>
        {
          record.id == this.props.selectId ?
            <span className='theme-color'>已选择</span>
            :
            <Button onClick={() => this.selectItem(record, index)} type='primary'>选择</Button>
        }
      </span>
    )
  }
  // 表格相关列
  columns = [
    { title: "会员名称", dataIndex: "customerName", render: data => data || "--" },
    { title: "会员手机号", dataIndex: "accountNumber", render: data => data || "--" },
    { title: "会员等级", dataIndex: "gradeName", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => this.renderAction(text, record, index)
    }
  ]

  selectItem = (record, index) => {
    let { customerName, accountNumber, id } = record;
    let params = {
      name: customerName,
      phone: accountNumber,
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
        width={700}
        title="选择会员"
        visible={this.props.visible}
        onCancel={this.onCancel}
        footer={null}
      >
        <div>
          <div>
            <SearchForm
              width={600}
              towRow={false}
              searchClicked={this.searchClicked}
              searchText='搜索'
              formItemList={[
                {
                  type: "INPUT",
                  field: "likeName",
                  style: { width: 300 },
                  placeholder: "会员名称/会员手机号/会员等级"
                }
              ]}
            />
          </div>
          <div>
            <Table
              indentSize={10}
              rowKey="id"
              columns={this.columns}
              loading={this.state.tableLoading}
              pagination={this.state.pagination}
              dataSource={this.state.tableDataList}
            />
          </div>
        </div>

      </Modal>
    )
  }
}
export default Form.create()(UserModal)