import React from 'react';
import { Tabs } from 'antd';
import { util } from 'utils';
import PropTypes from 'prop-types';
import BirdPreview from './BirdPreview';
import FileIcon from './FileIcon';

const TabPane = Tabs.TabPane;

class BirdPreviewList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileNameMap: {},
      mode: 'top',
    }
  }

  componentDidMount() {
    // if (this.props.urls.length > 0) {
    //   request({
    //     url: config.api.getFileNames,
    //     method: 'POST',
    //     data: this.props.urls
    //   }).then(fileNameMap => {
    //     this.setState({ fileNameMap: fileNameMap })
    //   })
    // }
  }

  getFileName(url) {
    if (util.string.isEmpty(url)) {
      return '';
    } else if (this.state.fileNameMap[url]) {
      return this.state.fileNameMap[url];
    } else {
      let arr = url.split("/");
      if (arr.length < 2) return url;

      return arr[arr.length - 1];
    }
  }

  render() {
    return (
      <Tabs style={{ height: 800 }} tabPosition={this.props.tabPosition}>
        {this.props.urls.map((url, index) => {
          return <TabPane tab={<FileIcon url={url} preview={false} />} key={`preview_${url}_${index}`}>
            <BirdPreview url={url} />
          </TabPane>;
        })}
      </Tabs>

    )
  }
}
BirdPreviewList.propTypes = {
  tabPosition: PropTypes.string,
  urls: PropTypes.array
};

BirdPreviewList.defaultProps = {
  tabPosition: 'left',
  urls: []
};

export default BirdPreviewList
