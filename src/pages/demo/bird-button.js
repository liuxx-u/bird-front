import React from 'react';
import {Card} from 'antd';
import {BirdButton} from 'components/Form';

class BirdButtonDemoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Card>
        <BirdButton permission={'sys:authorize:user:add'} idempotency={true} type="primary">权限按钮</BirdButton>
        <div>
          除permission外，其他api与antd的Button组件完全一致
        </div>
      </Card>
    )
  }
}

export default BirdButtonDemoPage
