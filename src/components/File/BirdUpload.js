import React from 'react';
import PropTypes from 'prop-types';
import { config, util, request } from 'utils';
import { Upload, Button, Icon, Drawer } from 'antd';
import BirdPreview from './BirdPreview';

/**
 * Upload组件
 */
class BirdUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList: [],
      fileNameMap: {},

      loading: false,

      previewUrl: '',
      previewVisible: false
    }
  }

  closePreview() {
    this.setState({ previewVisible: false })
  }

  onFileChange({ fileList }) {
    let multiple = this.props.multiple;
    let success = false;

    // read from response and show file link
    fileList = fileList.map(file => {
      if (file.response && file.status === 'done') {
        // Component will show file.url as link
        file.url = file.response.path || file.response.result.path;
      }
      return file;
    });

    // filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.status === 'error') {
        return false;
      } else if (file.response && file.status === 'done') {
        success = file.response.success || file.response.result.success;
        return success;
      }
      return true;
    });

    //删除response属性，确保每次拿到response时都是服务端最后一次返回的response
    fileList.forEach(file => {
      if (file.response) {
        delete file.response
      }
    })

    //对于单文件上传成功后，移除其他文件
    if (!multiple && success) {
      fileList = fileList.splice(fileList.length - 1, 1);
    }

    this.setState({
      fileList: fileList
    }, () => {
      let pathArr = [];
      let fileNameMap = {};
      for (let file of this.state.fileList) {
        if (file.status === 'uploading') return;
        if (util.string.isEmpty(file.url)) continue;

        pathArr.push(file.url);
        fileNameMap[file.url] = file.name;
      }
      this.setState({
        fileNameMap: fileNameMap
      }, () => {
        let strPath = pathArr.join();
        if (!util.string.isEmpty(strPath) && this.props.value !== strPath) {
          this.props.onChange && this.props.onChange(strPath)
        }
      });
    });
  }

  onFileRemove(file) {
    let fileList = this.state.fileList.filter(f => {
      return f.uid !== file.uid;
    });
    let pathArr = fileList.map(f => f.url);
    this.props.onChange && this.props.onChange(pathArr.join())
  }

  onPreview(file) {
    if (util.string.isEmpty(file.url)) return;

    const previewTypes = ["gif", "jpg", "jpeg", "png", "bmp", "pdf"];
    // const previewTypes = ["gif", "jpg", "jpeg", "png", "bmp", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
    let arr = file.url.split(".");
    if (arr.length < 2) return;

    let ext = arr[arr.length - 1].toLowerCase();
    if (!previewTypes.includes(ext)) {
      window.open(file.url, "_blank");
    } else {
      this.setState({
        previewVisible: true,
        previewUrl: file.url
      })
    }
  }

  initFileFields(value) {
    if (util.string.isEmpty(value)) value = '';

    let self = this;
    let fileArr = [];
    let fileNameMap = self.state.fileNameMap;
    let paths = value.split(',').filter(p => !util.string.isEmpty(p));
    fileArr = paths.map((p) => {
      let ext = p.substring(p.lastIndexOf('.'));
      return {
        uid: p,
        name: fileNameMap[p] || 'file' + ext,
        status: 'done',
        url: p,
        thumbUrl: p
      }
    });
    this.setState({
      fileList: fileArr
    });

    //显示文件名
    for (let path of paths) {
      if (!fileNameMap[path]) {
        request({
          url: config.api.getFileName + path,
          method: 'get'
        }).then(function (fileName) {
          let file = fileArr.find(p => p.url === path);
          file.name = fileName;
          fileNameMap[path] = fileName;
          self.setState({
            fileList: fileArr,
            fileNameMap: fileNameMap
          })
        })
      }
    }
  }

  componentDidMount() {
    this.initFileFields(this.props.value);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!util.object.equal(nextProps.value, this.props.value)) {
      this.initFileFields(nextProps.value);
    }
  }

  getUploadButton() {
    console.log(this)
    if (this.props.listType === 'picture-card') {
      return this.props.disabled
        ? null
        : <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">点击上传</div>
        </div>
    } else {
      return <Button type="ghost" disabled={this.props.disabled} loading={this.state.loading}>
        <Icon type="upload" /> 点击上传
      </Button>
    }
  }

  render() {
    let fileProps = {
      action: this.props.action || config.api.upload,
      multiple: this.props.multiple,
      disabled: this.props.disabled,
      accept: this.props.accept,
      listType: this.props.listType,
      fileList: this.state.fileList,
      showUploadList:this.props.showUploadList,
      onChange: file => this.onFileChange(file),
      onRemove: file => this.onFileRemove(file)
    };

    if (this.props.preview) {
      fileProps.onPreview = file => this.onPreview(file);
    }

    return (<div>
      <Upload {...fileProps}>
        {this.props.uploadButton || this.getUploadButton()}
      </Upload>
      <Drawer visible={this.state.previewVisible} onClose={() => this.closePreview()} destroyOnClose={true} width={1000} closable={false}>
        <BirdPreview url={this.state.previewUrl} extra={this.props.previewExtra} />
      </Drawer>
    </div>);
  }
}

BirdUpload.propTypes = {
  action: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  listType: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  showUploadList: PropTypes.bool,
  uploadButton: PropTypes.element,

  preview: PropTypes.bool,
  previewExtra: PropTypes.node
};

BirdUpload.defaultProps = {
  multiple: false,
  disabled: false,
  showUploadList: true,
  preview: true,
  listType: 'picture',
  value: ''
};

export default BirdUpload;
