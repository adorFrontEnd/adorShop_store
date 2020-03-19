import { Upload, Icon, Modal, Spin } from 'antd';
import React, { Component } from 'react';

export default class ProductShowPictureWall extends Component {

  render() {
    const { pictureList } = this.props;

    return (
      <div>
        <div className='flex-wrap'>
          {
            pictureList && pictureList.length ?
              pictureList.map((item, index) =>
                <div key={index} className='margin-right margin-bottom'>
                  <div style={{height:100,width:100}} className='middle-center'>
                    <img src={item + "?x-oss-process=image/resize,l_100"} />
                  </div>
                  <div className='text-center'>
                    {index == 0 ? "主图" : `轮播${index}`}
                  </div>
                </div>
              )
              :
              "暂无图片"
          }
        </div>

      </div>
    );
  }
}

