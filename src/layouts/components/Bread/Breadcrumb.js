import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import styles from './Breadcrumb.less'

class Bread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className={styles.bread}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <Icon type="home" />
            <span>首页</span>
          </Breadcrumb.Item>
          {this.props.menuPath.map(menu => {
            return <Breadcrumb.Item key={menu.id}>
              <Icon type={menu.icon} />
              <span>{menu.name}</span>
            </Breadcrumb.Item>
          })}
        </Breadcrumb>
      </div>
    )
  }
}

Bread.propTypes = {
  menuPath: PropTypes.array.isRequired
}

Bread.defaultProps = {
  menuPath: []
}

export default Bread;
