import React from 'react';
import PropTypes from 'prop-types';
import { permission, deepClone, request, config } from 'utils';
import { Button } from 'antd';
import axios from 'axios'

/**
 * BirdButton组件
 * 在antd按钮组件的基础上添加权限判断，幂等性支持
 */
class BirdButton extends React.Component {
  constructor(props) {
    super(props);

    const permissionName = this.props.permissionName;

    this.state = {
      hasPermission: permissionName === '' || permission.check(permissionName),
      token: '',
      loading: false
    }
  }

  componentDidMount() {
    if (this.props.idempotency) {
      this.refreshToken();
    }
  }

  /**
   * 刷新操作的token
   */
  refreshToken() {
    request({
      url: config.api.getOperationToken,
      method: 'GET'
    }).then(token => {
      this.setState({ token: token })
    })
  }

  getButtonProps() {
    let props = deepClone(this.props);
    delete props.permissionName;
    delete props.idempotency;

    if (this.props.idempotency && props.onClick) {
      props.loading = this.state.loading;

      props.onClick = () => {
        var reqInterceptor = axios.interceptors.request.use(config => {
          this.setState({ loading: true });
          if (this.state.token) {
            config.headers['bird-idempotency'] = this.state.token;
          }
          return config;
        });

        var respInterceptor = axios.interceptors.response.use(response => {
          axios.interceptors.request.eject(reqInterceptor);
          axios.interceptors.response.eject(respInterceptor);

          this.setState({ loading: false });
          if (response.config.url !== config.api.getOperationToken && response.status === 200) {
            this.refreshToken();
          }
          return response;
        }, error => {
          axios.interceptors.request.eject(reqInterceptor);
          axios.interceptors.response.eject(respInterceptor);

          this.setState({ loading: false });
          return Promise.reject(error);
        });

        this.props.onClick();
      }
    }
    return props;
  }

  render() {
    if (this.state.hasPermission) {
      return <Button {...this.getButtonProps()}>
        {this.props.children}
      </Button>
    } else {
      return <span />;
    }
  }
}

BirdButton.propTypes = {
  permissionName: PropTypes.string,
  idempotency: PropTypes.bool
};

BirdButton.defaultProps = {
  permissionName: '',
  idempotency: false
};

export default BirdButton;