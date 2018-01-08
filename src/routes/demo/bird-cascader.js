import React from 'react';
import { request } from 'utils';
import {Card} from 'antd';
import {BirdCascader} from 'components/Form';


class BirdCascaderDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: ''
    }
  }

  selectChange(value) {
    this.setState({
      selectedValue: value
    });
    console.log(value);
  }

  render() {

    return (
      <Card>
        <BirdCascader url={'/api/v1/tree'} onChange={value => this.selectChange(value)} width={400}
                      value={this.state.selectedValue}/>
      </Card>
    )
  }
}

export default BirdCascaderDemoPage
