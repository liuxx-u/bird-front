import React from 'react';
import PropTypes from 'prop-types';
import { permission,deepClone } from 'utils';
import {Button} from 'antd';

/**
 * BirdButton组件
 * 在antd按钮组件的基础上添加权限判断
 */
class BirdButton extends React.Component {
  constructor(props) {
    super(props);

    const permission = this.props.permission;

    this.state = {
      hasPermission: permission === '' || permission.check(permission)
    }
  }

  componentDidMount() {
  }

  render() {
    if (this.state.hasPermission) {
      let props = deepClone(this.props);
      delete props.permission;

      return <Button {...props}>
        {this.props.children}
      </Button>
    } else {
      return <span/>;
    }
  }
}

BirdButton.propTypes = {
  permission:PropTypes.string
};

BirdButton.defaultProps = {
  permission:''
};

export default BirdButton;
