import React from 'react';
import PropTypes from 'prop-types';
import { request, config, util } from 'utils';
import { Drawer } from 'antd';
import BirdPreview from './BirdPreview';
import styles from './FileIcon.less';
import imgPdf from './pdf.png';
import imgPpt from './ppt.png';
import imgExcel from './excel.png';
import imgWord from './word.png';
import imgUnkown from './unkown.png';

const imgTypes = ["gif", "jpg", "jpeg", "png", "bmp"];

/**
 * 文件图标组件
 */
class FileIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileName: '',

      previewVisible: false
    }
  }

  fileClick() {
    if (this.props.preview && this.getFileType() !== 'unkown') {
      this.setState({ previewVisible: true })
    }
  }

  closePreview() {
    this.setState({ previewVisible: false })
  }

  getFileName() {
    let fileName = this.props.fileName || this.state.fileName;
    if (util.string.isEmpty(fileName)) {
      let arr = this.props.url.split("/");
      if (arr.length < 2) {
        fileName = this.props.url;
      } else {
        fileName = arr[arr.length - 1];
      }
    }
    return fileName;
  }

  getFileType() {
    let fileName = this.getFileName();
    let arr = fileName.split(".");
    if (arr.length < 2) return;

    let ext = arr[arr.length - 1].toLowerCase();
    if (imgTypes.includes(ext)) {
      return 'image';
    } else if (ext === 'doc' || ext === 'docx') {
      return 'doc'
    } else if (ext === 'xls' || ext === 'xlsx') {
      return 'xls'
    } else if (ext === 'ppt' || ext === 'pptx') {
      return 'ppt'
    } else if (ext === 'pdf') {
      return 'pdf'
    } else {
      return 'unkown'
    }
  }

  initFileName(props) {
    if (util.string.isEmpty(props.url) || !props.queryFileName) {
      this.setState({ fileName: '' })
    } else {
      request({
        url: config.api.getFileName + this.props.url,
        method: 'GET'
      }).then(fileName => {
        this.setState({ fileName: fileName })
      })
    }
  }

  componentDidMount() {
    this.initFileName(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url != this.props.url) {
      this.initFileName(nextProps);
    }
  }

  render() {
    if (util.string.isEmpty(this.props.url)) return <span />;

    let iconImg;
    let fileType = this.getFileType();
    switch (fileType) {
      case 'image':
        iconImg = this.props.url + "?w=200";
        break;
      case 'doc':
        iconImg = imgWord;
        break;
      case 'xls':
        iconImg = imgExcel;
        break;
      case 'ppt':
        iconImg = imgPpt;
        break;
      case 'pdf':
        iconImg = imgPdf;
        break;
      default:
        iconImg = imgUnkown;
    }

    let sizeStyle = {
      width: this.props.width,
      height: this.props.height
    }

    return <div className={styles.fileicon} style={this.props.mode === 'normal' ? { display: 'flex' } : {}}>
      <a href={fileType === 'unkown' ? this.props.url : 'javascript:void(0)'}  target="_blank">
        <img src={iconImg} style={sizeStyle} onClick={() => this.fileClick()} />
        {this.props.nameVisivle && <span onClick={() => this.fileClick()} >{this.getFileName()}</span>}
      </a>

      <Drawer visible={this.state.previewVisible} title={this.getFileName()} onClose={() => this.closePreview()} destroyOnClose={true} width={1000}>
        <BirdPreview url={this.props.url} extra={this.props.previewExtra} />
      </Drawer>
    </div>;
  }
}

FileIcon.propTypes = {
  url: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  queryFileName: PropTypes.bool,
  nameVisivle: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  mode: PropTypes.oneOf(['normal', 'inline']),
  preview: PropTypes.bool,
  previewExtra:PropTypes.node
};

FileIcon.defaultProps = {
  url: '',
  queryFileName: false,
  nameVisivle: true,
  width: 40,
  height: 40,
  mode: 'normal',
  preview: true
};

export default FileIcon;
