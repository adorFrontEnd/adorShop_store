import React, { Component } from "react";
import CommonPage from '../../components/common-page';
import { Table, Form, Input, Select, Col, Row, Icon, Button, Divider, Popconfirm, Radio, Modal, Checkbox, InputNumber, Upload } from "antd";
import { pagination } from '../../utils/pagination';
import Toast from '../../utils/toast';
import { SearchForm, SubmitForm } from '../../components/common-form';
import dateUtil from '../../utils/dateUtil';
import { searchUserList, exportUserList } from '../../api/user/user';
import { NavLink, Link } from 'react-router-dom';
import { baseRoute, routerConfig } from '../../config/router.config';
import { connect } from 'react-redux';
import { changeRoute } from '../../store/actions/route-actions';


const _title = "计量单位配置";
const _description = "";



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






  /**************************************************************************************** */
  // 表格相关列
  columns = [
    { title: "单位", dataIndex: "name", render: data => data || "--" },
    {
      title: '操作',
      render: (text, record, index) => (
        <span onClick={() => this.showEditModalClick()}>删除</span>
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
      <CommonPage title={_title} description={_description} >

        <div>
          <div className=" align-center margin-bottom20 " style={{display:'flex'}}>
           <div style={{marginRight:'15px'}}> <Input placeholder='填写单位名称' /></div>
            <Button type='primary' >新增单位</Button>

          </div>

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
const mapStateToProps = state => state;
const mapDispatchToProps = (dispatch) => {
  return {
    changeRoute: data => dispatch(changeRoute(data))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Page));