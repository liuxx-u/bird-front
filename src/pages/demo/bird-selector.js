import React from 'react';
import { request } from 'utils';
import {BirdSelector} from "../../components/Form";
import {Card} from 'antd';

class BirdSelectorDemoPage extends React.Component {
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
        <BirdSelector dicKey={'zero.test'} onChange={value=>this.selectChange(value)} width={200}
                      selectedValue={this.state.selectedValue}/>
      </Card>
    )
  }
}

export default BirdSelectorDemoPage
