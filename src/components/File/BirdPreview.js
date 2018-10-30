import React from 'react';
import PropTypes from 'prop-types';
import { util, request, config } from 'utils';
import { Row, Col } from 'antd';
import ImagePreview from './Preview/ImagePreview';
import PdfPreview from './Preview/PdfPreview';
import DocPreview from './Preview/DocPreview';


const imgTypes = ["gif", "jpg", "jpeg", "png", "bmp"];
const docTypes = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

class BirdPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileType: '',
      fileName: ''
    }
  }

  initFileType() {
    if (util.string.isEmpty(this.state.fileName)) return;

    let arr = this.state.fileName.split(".");
    if (arr.length < 2) return;

    let ext = arr[arr.length - 1].toLowerCase();
    if (imgTypes.includes(ext)) {
      this.setState({ fileType: 'image' });
    } else if (docTypes.includes(ext)) {
      this.setState({ fileType: 'doc' });
    } else if (ext === 'pdf') {
      this.setState({ fileType: 'pdf' })
    }
  }


  componentDidMount() {
    this.setState({ fileName: this.props.url }, this.initFileType);

    if (!util.string.isEmpty(this.props.url)) {
      request({
        url: config.api.getFileName + this.props.url,
        method: 'get'
      }).then(fileName => {
        this.setState({ fileName: fileName })
      })
    }
  }

  render() {
    let innerPreview;
    switch (this.state.fileType) {
      case 'image':
        innerPreview = <ImagePreview name={this.state.fileName} url={this.props.url} />;
        break;
      case 'pdf':
        innerPreview = <PdfPreview name={this.state.name} url={this.props.url} />;
        break;
      case 'doc':
        innerPreview = <DocPreview name={this.state.name} url={this.props.url} />;
        break;
      default:
        innerPreview = <span />;
    }

    return <Row>
      {this.props.extra && <Col span={24}>{this.props.extra}</Col>}
      <Col span={24}>
        {innerPreview}
      </Col>
    </Row>
  }
}
BirdPreview.propTypes = {
  url: PropTypes.string,
  extra: PropTypes.node
};

BirdPreview.defaultProps = {
};

export default BirdPreview
