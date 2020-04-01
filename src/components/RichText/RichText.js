import { Upload, Radio, InputNumber, Form, Col, Input, Row, Modal, Select } from 'antd';
import React, { Component } from 'react';
import Toast from '../../utils/toast';
import ReactQuill, { Quill } from 'react-quill';
import { ImageDrop } from 'quill-image-drop-module';
import 'react-quill/dist/quill.snow.css';
import PicturesWallModal from '../upload/PictureWallModal';


export default class RichText extends Component {

  state = {

  }
  /**富文本 ********************************************************************************************************************/
  onRichTextChange = (richText) => {
    this.props.onTextChange && this.props.onTextChange(richText)
  }

  modules = {
    toolbar: {
      container: [['image']],
      handlers: {
        image: this.imageHandler.bind(this)
      }
    },
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }

  imageHandler() {

    this.setState({
      uploadModalVisible: true
    })
  }

  hideUploadModal = () => {
    this.setState({
      uploadModalVisible: false
    })
  }

  onUploadModalOk = (pictureUrlArr) => {

    this.insertImgs(pictureUrlArr);
    this.hideUploadModal()
  }

  insertImgs = (pictureUrlArr) => {
    if (!pictureUrlArr || !pictureUrlArr.length) {
      return;
    }
    pictureUrlArr.forEach(item => {
      this.insertImg(item)
    })
  }

  insertImg = (pictureUrl) => {
    if (!pictureUrl || !pictureUrl.length) {
      return;
    }
    let quill = this.refs.reactQuillRef.getEditor();//获取到编辑器本身
    const cursorPosition = quill.selection.savedRange.index;//获取当前光标位置
    quill.insertEmbed(cursorPosition, "image", pictureUrl, Quill.sources.USER);//插入图片
    quill.insertText(cursorPosition + 1, "\n");//插入图片
    quill.setSelection(cursorPosition + 2);//光标位置加1s
  }

  formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

  render() {
    return (
      <div>
        <div>{this.props.addonBefore}</div>
        <ReactQuill
          readOnly={this.props.readOnly}
          ref='reactQuillRef'
          theme={'snow'}
          onChange={this.onRichTextChange}
          value={this.props.textValue || ''}
          modules={this.props.readOnly ? {
            toolbar: {
              container: [],
              handlers: {
                image: this.imageHandler.bind(this)
              }
            },
            clipboard: {
              // toggle to add extra line breaks when pasting HTML:
              matchVisual: false,
            }
          } : this.modules}
          formats={this.formats}
          placeholder='编辑详情(图片)...'
        />
        {
          !this.props.readOnly ?
            <div className='line-height18 color-red' style={{ textAlign: "left" }}>长度不能超过16000px</div>
            :
            null
        }
        <div>{this.props.children}</div>
        <PicturesWallModal
          limitFileLength={20}
          visible={this.state.uploadModalVisible}
          onCancel={this.hideUploadModal} onOk={this.onUploadModalOk}
        />
      </div>
    )
  }
}