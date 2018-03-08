import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import { config } from 'utils';

// 不允许上传超过50M的文件
const validateFn = (file) => {
  return file.size < 1024 * 1024 * 50
};


const uploadFn = (param) => {
  const serverURL = config.api.upload;
  const xhr = new XMLHttpRequest;
  const fd = new FormData();

  // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
  console.log(param.libraryId)

  const successFn = (response) => {
    let resp = xhr.response;
    if (typeof (resp) === 'string') {
      resp = JSON.parse(resp);
    }

    // 上传成功后调用param.success并传入上传后的文件地址
    param.success({
      url: resp.path
    })
  }

  const progressFn = (event) => {
    // 上传进度发生变化时调用param.progress
    param.progress(event.loaded / event.total * 100)
  }

  const errorFn = (response) => {
    // 上传发生错误时调用param.error
    param.error({
      msg: 'unable to upload.'
    })
  }

  xhr.upload.addEventListener("progress", progressFn, false)
  xhr.addEventListener("load", successFn, false)
  xhr.addEventListener("error", errorFn, false)
  xhr.addEventListener("abort", errorFn, false)

  fd.append('file', param.file)
  xhr.open('POST', serverURL, true)
  xhr.send(fd)
}

class BraftEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  onChange(html) {
    this.props.onChange && this.props.onChange(html);
  }

  render() {
    const editorProps = {
      height: 300,
      contentFormat: 'html',
      initialContent: this.props.initValue,
      // onChange: this.handleChange,
      onHTMLChange: html => this.onChange(html),
      media: {
        allowPasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
        image: true, // 开启图片插入功能
        video: true, // 开启视频插入功能
        audio: true, // 开启音频插入功能
        validateFn: validateFn,
        uploadFn: uploadFn, // 指定上传函数
      },
      colors: [
        '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
        '#61a951', '#16a085', '#07a9fe', '#003ba5', '#8e44ad', '#f32784',
        '#c0392b', '#d35400', '#f39c12', '#fdda00', '#7f8c8d', '#2c3e50'
      ]
    }

    return <div style={{ border: "1px solid #bdc8d2", borderRadius: '3px' }}>
      <Editor {...editorProps} />
    </div>
  }
}

BraftEditor.propTypes = {
  initValue: PropTypes.string,
  onChange: PropTypes.func
}

export default BraftEditor
