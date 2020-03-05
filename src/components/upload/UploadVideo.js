import { Upload, Icon, Modal, Spin, Button, Progress, Popconfirm } from 'antd';
import React, { Component } from 'react';
import { getUpdatePictureUrl } from '../../api/SYS/SYS';
import { upLoadConfigData } from '../../config/http.config';
import Toast from '../../utils/toast';
import ReactPlayer from 'react-player';

const antIcon = <Icon type="loading" style={{ fontSize: 25 }} spin />;
let updateUrl = '';

export default class PicturesWall extends Component {

  state = {
    fileUploading: false,
    videoFile: null,
    percent: 0,
    showPercent: false
  };

  componentDidMount() {

    updateUrl = getUpdatePictureUrl();
    let postData = { ...upLoadConfigData, folder: this.props.folder || "product" };
    this.setState({
      postData
    })
    this.getFileList();
  }

  componentWillReceiveProps(props) {

    if(!props.videoFile || (JSON.stringify(props.videoFile) != JSON.stringify(this.props.videoFile))){
      this.setState({
        videoFile:props.videoFile
      })
    }   
  }

  getFileList = () => {
    let videoFile = null;
    if (this.props.videoFile) {
      this.setState({
        videoFile
      })
    }
  }

  onFilesChange = (info) => {

    let { fileList } = info;
    this.setState({ fileList });
    if (info.event && info.event.percent) {
      let percent = parseInt(info.event.percent);
      this.setState({
        percent
      })
    }

    if (info.file.status == 'uploading') {

      this.setState({
        fileUploading: true
      })
    } else {
      this.setState({
        fileUploading: false
      })
    }
    if (info.file.status === 'done') {

      if (!info.file || !info.file.response || info.file.response.status != 'SUCCEED' || !info.file.response.data) {
        return;
      }

      let videoFile = {
        url: info.file.response.data,
        name: info.file.name
      }
      this.setState({
        videoFile
      })
      this.props.uploadCallback(videoFile);

    } else if (info.file.status === 'error') {
      Toast('上传失败');
    }
  }

  beforeUpload = (file, fileList) => {
    if (!file || !file.type || !/video/.test(file.type)) {
      Toast("请上传视频文件！");
      return false;
    }

    if (!file.size || file.size > 100 * 1024 * 1024) {
      Toast("请上传小于100M的视频文件！");
      return false;
    }

    return true
  }

  deleteVedio = () => {
    this.setState({
      videoFile: null,
      percent: null
    })
    this.props.uploadCallback(null);
  }

  render() {
    const { videoFile, fileList, showPercent } = this.state;

    return (
      <div>
        {
          videoFile ?
            <div style={{ width: 160 }}>
              <div style={{ border: "1px solid #bfbfbf", height: 160, width: 160 }} className='flex-middle flex-center border-radius'>
                <ReactPlayer url={videoFile.url} width="150px" height="150px" controls />
              </div>
              <div className='flex-end line-height40'>
                <Popconfirm
                  placement="topLeft" title='确认要删除吗？'
                  onConfirm={this.deleteVedio}>
                  <a size="small" className='color-red margin-right'>删除</a>
                </Popconfirm>
              </div>
            </div>
            :
            <Upload
              data={this.state.postData}
              beforeUpload={this.beforeUpload}
              action={updateUrl}
              showUploadList={false}
              fileList={fileList}
              name='files'
              onChange={this.onFilesChange}
            >

              <div style={{ height: 160, width: 150 }}>
                <Spin tip="上传中，请稍后..." spinning={this.state.fileUploading} indicator={antIcon}>
                  <div className='flex-middle flex-center' style={{ border: "1px dashed #ccc", cursor: "pointer", borderRadius: "4px", padding: 10, height: 150, width: 150 }}>
                    {
                      !this.state.fileUploading ?
                        <div className='text-center'>
                          <Icon type='plus' style={{ fontSize: 50 }} />
                          <div>上传商品视频</div>
                        </div>
                        :
                        null
                    }
                  </div>
                </Spin>
                {
                  this.state.percent && this.state.percent > 0 ?
                    <Progress strokeColor='#ff8716' percent={this.state.percent} style={{ width: 150 }} />
                    : null
                }
              </div>
            </Upload>
        }
      </div>
    );
  }
}




