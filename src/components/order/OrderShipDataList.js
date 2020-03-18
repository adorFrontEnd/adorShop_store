import { Upload, Radio, InputNumber, Form, Col, Input, Row, Icon, Spin, Modal, Tabs, Popconfirm, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import dateUtil from '../../utils/dateUtil';

class OrderShipDataList extends Component {

  render() {
    const { data } = this.props;
    return (
      <div>
        {
          data && data.length ?
            <Tabs type="card">
              {
                data.map((item, index) => (
                  <Tabs.TabPane tab={`包裹${index + 1}`} key={index}>
                    <div className='flex'>
                      <div>
                        <div className='flex line-height30'>
                          <div className='margin-right20'>
                            <div>发货方式：{item.sendWay == 1 ? '快递' : "--"}</div>
                            <div>发货人：{item.operName || '--'}</div>
                            <div>发货时间：
                            {item.gmtCreate ? dateUtil.getDateTime(item.gmtCreate) : "--"}
                            </div>
                          </div>
                          <div>
                            <div>物流公司：{item.logisticsName || '--'}</div>
                            <div>运单号：{item.logisticsNumber || '--'}</div>
                            <div>备注：{item.remark || '--'}</div>
                          </div>
                        </div>
                        <div className='margin-top flex'>
                          {
                            item.list && item.list.length ?
                              item.list.map((element, i) => (
                                <div key={i}>
                                  <div className='margin-right'>
                                    <div><img src={element.imageUrl} style={{ width: 80, height: 80 }} /></div>
                                    <div className='theme-color font-16 ellipsis' style={{ width: 80 }}>
                                      {element.productName}
                                    </div>
                                    <div className='ellipsis' style={{ width: 80 }}>
                                      {element.specValue}
                                    </div>
                                    <div style={{ width: 80 }}>数量：{element.sendQty}</div>
                                  </div>
                                </div>
                              )) : null
                          }
                        </div>
                      </div>
                      <div className='margin-left20'>
                        物流情况
                    </div>
                    </div>
                  </Tabs.TabPane>
                ))
              }

            </Tabs>
            :
            <div>发货后生成包裹信息</div>
        }
      </div>
    )
  }

}
export default OrderShipDataList