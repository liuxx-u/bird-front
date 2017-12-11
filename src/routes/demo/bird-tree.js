import React from 'react';
import { request } from 'utils';
import {Card} from 'antd';
import {BirdTree} from 'components/Grid';


class BirdTreeDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /**
   * 树条目点击事件
   * @param value
   */
  itemClick(value) {
    console.log(value);
  }

  render() {

    let treeOption = {
      url: '/api/v1/tree',
      canSelectFolder: true,
      expandAll: true,
      onSelect: value => this.itemClick(value)
    };

    return (
      <Card>
        <BirdTree treeOption={treeOption}/>
      </Card>
    )
  }
}

export default BirdTreeDemoPage
