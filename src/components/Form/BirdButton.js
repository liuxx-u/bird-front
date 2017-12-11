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

    const permissionName = this.props.permissionName;

    this.state = {
      hasPermission: permissionName === '' || permission.check(permissionName)
    }
  }

  componentDidMount() {
  }

  render() {
    if (this.state.hasPermission) {
      let props = deepClone(this.props);
      delete props.permissionName;

      return <Button {...props}>
        {this.props.children}
      </Button>
    } else {
      return <span/>;
    }
  }
}

BirdButton.propTypes = {
  permissionName:PropTypes.string
};

BirdButton.defaultProps = {
  permissionName:''
};

export default BirdButton;
