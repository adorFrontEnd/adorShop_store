import { Upload, Radio, InputNumber, Form, Col, Input, Row, Icon, Spin, Modal, Tabs, Popconfirm, Button, Select, Table } from 'antd';
import React, { Component } from 'react';
import { SearchForm } from '../common-form';
import Toast from '../../utils/toast';
import dateUtil from '../../utils/dateUtil';
import ExpressRealtimeData from './ExpressRealtimeData';
import { getSpecValue } from '../../utils/productUtils';


class OrderShipDataList extends Component {

  getImageUrl = (url) => {
    if (!url || !url.length) {
      return
    }

    let urlArr = url.split("|");
    return urlArr && urlArr.length > 0 && urlArr[0] ? urlArr[0] : ""
  }

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
                                    <div>
                                      <img src={this.getImageUrl(element.imageUrl) || ""} style={{ width: 100, height: 100 }} />
                                    </div>
                                    <div className='theme-color ellipsis' style={{ width: 100 }}>
                                      {element.productName}
                                    </div>
                                    <div className='ellipsis' style={{ width: 100 }}>
                                      {getSpecValue(element.specValue)}
                                    </div>
                                    <div style={{ width: 100 }}>数量：{element.sendQty}</div>
                                  </div>
                                </div>
                              )) : null
                          }
                        </div>
                      </div>
                      <div className='margin-left20 line-height30'>
                        物流情况：
                      </div>
                      <div style={{ padding: "6px 6px" }}>
                        <ExpressRealtimeData
                          data={item.logisticsNumber}
                        />
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