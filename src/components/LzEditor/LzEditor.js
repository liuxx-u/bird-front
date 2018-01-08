import React from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-lz-editor';
import {config} from 'utils';

class LzEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList: []
    }
  }

  onFileChange(fileInfo) {
    let fileList = fileInfo.fileList.map(file => {
      if (file.response && file.response.success) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.path;
        return file;
      }
      if (!file.length) {
        return file;
      }
    });

    this.setState({
      fileList: fileList
    })
  }

  onChange(html) {
    this.props.onChange && this.props.onChange(html);
  }

  render() {
    let uploadProps = {
      action: config.api.upload,
      listType: 'picture',
      fileList: this.state.fileList,
      onChange: fileInfo => {
        this.onFileChange(fileInfo)
      },
      onRemove: function (file) {

      }
    };

    return <Editor active={true} importContent={this.props.initValue} cbReceiver={html => this.onChange(html)}
                   uploadProps={uploadProps}/>
  }
}

LzEditor.propTypes={
  initValue:PropTypes.string,
  onChange:PropTypes.func
}

export default LzEditor
