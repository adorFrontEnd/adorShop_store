import { Upload, Button, Icon, Modal, Spin } from 'antd';
import React, { Component } from 'react';
import { getUpdatePictureUrl } from '../../api/SYS/SYS';
import Toast from '../../utils/toast';

const _updateUrl = getUpdatePictureUrl({ folder: "adorpay" });


export default class UploadFile extends Component {

  state = {
    fileUploading: false,
    accept: null,
    fileList: []
  }

  componentDidMount() {
    this.initAccept();
  }

  beforeUpload = (file, fileList) => {

    if (!this.isFilesTypeValid(fileList)) {
      Toast(this.state.acceptToastTitle);
      return false
    }
    return true
  }

  initAccept = () => {
    let accept = this.props.accept;
    this.handleAcceptType(accept);
  }

  handleAcceptType = (accept) => {
    if (!accept || !accept.length) {
      return;
    }

    let acceptToastTitle = `文件格式不正确，请上传${accept}格式的文件`;
    this.setState({
      acceptToastTitle
    })
  }

  isFilesTypeValid = (files) => {
    if (!files || !files.length) {
      return
    }
    for (let i = 0; i < files.length; i++) {
      if (!this.isFileTypeValid(files[i])) {
        return;
      }
    }
    return true
  }

  isFileTypeValid = (file) => {

    if (!file || (!file.type && !file.name)) {
      return
    }
    if (!this.props.accept || !this.props.accept.length) {
      return true
    }

    let fileType = file.type;
    let fileName = this.getFileTypeByName(file.name);

    if (!this.isAllowFileType(fileType, fileName)) {
      return;
    }
    return true
  }

  isAllowFileType = (fileType, fileName) => {
    if (!this.props.accept || !this.props.accept.length) {
      return true
    }
    let arr = this.props.accept.split(',').filter(Boolean).map(item => item.replace('.', ''));
    let isValid = false;
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      let regExpression = new RegExp(`${item}`, "i");
      if (item == 'jpg' || item == 'jpeg') {
        regExpression = /(jpg|jpeg)/i;
      }
      if (regExpression.test(fileType) || regExpression.test(fileName)) {
        isValid = true;
        break;
      }
    }

    return isValid;

  }

  getFileTypeByName = (fileName) => {
    if (!fileName || !fileName.length) {
      return;
    }
    let index = fileName.lastIndexOf('.');
    if (index == -1) {
      return;
    }
    let fileType = fileName.substr(index + 1, fileName.length - 1);
    return fileType;
  }

  onFileChange = (info) => {

    let { fileList, file } = info;

    let newUploadFiles = this.getNewUploadFiles(fileList);
    if (!newUploadFiles) {
      this.setState({
        fileList
      })
      this.props.uploadCallback(fileList);
      return;
    }

    let fileUploading = file && file.status == 'uploading';
    this.setState({ fileUploading });

    if (file.status == 'done') {
      this.formatUploadFileList(fileList)
        .then((list) => {
          this.setState({
            fileList
          })
          this.props.uploadCallback(fileList);
        })
        .catch(() => { })
    } else if (file.status == 'error') {
      Toast('上传失败');
    }

  }


  getNewUploadFiles = (files) => {
    if (!files || !files.length) {
      return;
    }
    let arr = files.filter(item => !item.url);
    return arr && arr.length ? arr : null;
  }

  // 删除图片
  deleteFile = (index) => {
    let fileList = this.state.fileList;
    fileList.splice(index, 1);
    this.setState({
      fileList
    })

    this.props.uploadCallback(fileList);
  }


  formatUploadFileList = (fileList) => {
    return new Promise((resolve, reject) => {
      if (!fileList || !fileList.length) {
        reject();
      }
      let shouldResolve = fileList.length != this.state.fileList.length;

      for (let i = 0; i < fileList.length; i++) {
        let item = fileList[i];
        if (item && item.response && item.response.status && item.response.status == 'SUCCEED') {
          let newItem = {
            uid: item.uid,
            name: item.name,
            status: 'done',
            url: item.response.data
          }
          fileList[i] = newItem;
          shouldResolve = true;
        }
      }
      if (shouldResolve) {
        resolve(fileList)
      } else {
        reject()
      }
    })
  }

  render() {

    const uploadProps = {
      name: 'files',
      action: _updateUrl,
      accept: this.props.accept || null,
      showUploadList: false,
      onChange: this.onFileChange,
      beforeUpload: this.beforeUpload
    };

    const { fileList } = this.props;
    const limitFileLength = this.props.limitFileLength || 1;
    return (

      <div className={this.props.layout == 'inline' ? "flex align-center" : ""}>
        {
          fileList.length >= limitFileLength ?
            null :
            <div>
              <Upload
                {...uploadProps}
              >
                <Spin spinning={this.state.fileUploading}>
                  <Button>
                    <Icon type="upload" />
                    {this.props.uploadTitle || "点击上传文件"}
                  </Button>
                </Spin>
              </Upload>
            </div>
        }

        <div className='padding0-10'>
          {
            fileList && fileList.length ?
              fileList.map((item, index) =>
                <div key={item.uid || item.url}>
                  <a href={item.url} download={item.name}>{item.name}</a>
                  <a onClick={() => { this.deleteFile(index) }} className='color-red margin-left'>删除</a>
                </div>
              )

              : null
          }
        </div>
      </div>
    );
  }
}
