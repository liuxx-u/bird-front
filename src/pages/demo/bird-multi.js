import React from 'react';
import { request } from 'utils';
import {BirdMulti} from "../../components/Form";
import {Card} from 'antd';

class BirdMultiDemoPage extends React.Component {
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
        <BirdMulti dicKey={'zero.test'}
                   onChange={value=>this.selectChange(value)}
                   width={400}
                   selectedValue={this.state.selectedValue}
                   canCheckAll={true}
        />
      </Card>
    )
  }
}

export default BirdMultiDemoPage
