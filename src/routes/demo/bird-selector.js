import React from 'react';
import { request } from 'utils';
import {BirdSelector} from "../../components/Form";
import {Card} from 'antd';

class BirdSelectorDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  selectChange(value){
    console.log(value);
  }

  render() {
    return (
      <Card>
        <BirdSelector dicKey={'zero.test'} onChange={this.selectChange} width={200}/>
      </Card>
    )
  }
}

export default BirdSelectorDemoPage
