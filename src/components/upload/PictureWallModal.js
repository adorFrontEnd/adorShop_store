import { Upload, Icon, Modal } from 'antd';
import React, { Component } from 'react';
import PictureWall from './PictureWall';


export default class PicturesWallModal extends Component {

  state = {
    pictureList: []
  }


  uploadCallback = (pictureList) => {

    this.setState({
      pictureList
    })
  }

  onOk = () => {
    this.props.onOk(this.state.pictureList);
    this.setState({
      pictureList: []
    })
  }

  render() {
    return (
      <Modal maskClosable={false}
        width={650}
        title="上传图片"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.onOk}
      >
        <div>
          {this.props.addbefore}
        </div>
        <PictureWall
       
          limitFileLength={this.props.limitFileLength}
          folder={this.props.folder}
          pictureList={this.state.pictureList}
          uploadCallback={this.uploadCallback}
        />
        <div>
          {this.props.children}
        </div>
      </Modal>

    )
  }
}