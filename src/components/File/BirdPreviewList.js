import React from 'react';
import { Tabs } from 'antd';
import { util,request } from 'utils';
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

  render() {
    return (
      <Tabs style={{ height: 800,overflow:'auto' }} tabPosition={this.props.tabPosition}>
        {this.props.urls.map((url, index) => {
          return <TabPane tab={<FileIcon url={url} preview={false} queryFileName={true} mode={"inline"} />} key={`preview_${url}_${index}`}>
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
