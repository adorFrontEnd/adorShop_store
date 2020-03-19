import { Upload, Radio, InputNumber, Form, Col, Input, Row, Icon, Spin, Modal, Tabs, Popconfirm, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import dateUtil from '../../utils/dateUtil';


class ExpressRealtimeData extends Component {

  render() {   
    return (
      <div>
        {
          this.props.data ?
            <div>
              <iframe style={{ height: 500, width: 400 }}
                src={`https://m.kuaidi100.com/result.jsp?nu=${this.props.data}`}>
              </iframe>
            </div> :
            <div>没有物流单号</div>
        }
      </div>
    )
  }

}
export default ExpressRealtimeData