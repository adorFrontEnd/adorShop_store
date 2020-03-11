import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../../components/common-form';
import Toast from '../../utils/toast';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class UserModal extends Component {

  state = {

  }

  componentDidMount() {

  }

  componentWillReceiveProps(props) {

  }

  params = {
    page: 1
  }

  //查询按钮点击事件
  searchClicked = (params) => {

    let { inputData } = params;
    inputData = inputData || null;
    this.params = {
      page: 1,
      ...params,
      inputData
    }
    this.getPageData();
  }

  getPageData = () => {
    
  }

  // 表格相关列
  columns = [
    { title: "会员名称", dataIndex: "name", render: data => data || "--" },
    { title: "会员手机号", dataIndex: "imageUrl", render: data => data || "--" },
    { title: "会员等级", dataIndex: "specifications", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>

        </span>
      )
    }
  ]

  onCancel = () => {
    this.props.onCancel();
  }

  render() {
    return (
      <Modal
        maskClosable={false}
        width={700}
        title="编辑产品价格"
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.onOk}
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
                  field: "inputData",
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
              loading={this.state.showTableLoading}
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