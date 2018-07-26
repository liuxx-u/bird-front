import React from 'react';
import PropTypes from 'prop-types';
import { config, util, request } from 'utils';
import { Upload, Button, Icon } from 'antd';

/**
 * Upload组件
 */
class BirdUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList: [],
      fileNameMap: {}
    }
  }

  onFileChange(file) {
    let fileList = file.fileList;
    let multiple = this.props.multiple;
    let success = false;

    // read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.path;
      }
      return file;
    });

    // filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.response) {
        success = file.response.success;
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
    this.setState({
      fileList: fileList
    }, () => {
      let pathArr = this.state.fileList.map(f => f.url);
      this.props.onChange && this.props.onChange(pathArr.join())
    });
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

  render() {
    let fileProps = {
      action: this.props.action || config.api.upload,
      multiple: this.props.multiple,
      disabled: this.props.disabled,
      accept: this.props.accept,
      listType: this.props.listType,
      fileList: this.state.fileList,
      onChange: file => this.onFileChange(file),
      onRemove: file => this.onFileRemove(file)
    };

    return (<Upload {...fileProps}>
      <Button type="ghost" disabled={this.props.disabled}>
        <Icon type="upload" /> 点击上传
      </Button>
    </Upload>);
  }
}

BirdUpload.propTypes = {
  action: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  listType: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string
};

BirdUpload.defaultProps = {
  multiple: false,
  disabled: false,
  listType: 'picture',
  value: ''
};

export default BirdUpload;
