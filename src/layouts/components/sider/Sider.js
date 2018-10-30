import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import styles from './Sider.less'

const SubMenu = Menu.SubMenu;
class Silder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  onCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onOpenChange = openKeys => {
    let existKeys = this.props.openKeys;
    openKeys = openKeys.filter(p => existKeys.indexOf(p) < 0);
    this.props.onOpenChange && this.props.onOpenChange(openKeys);
  }

  onSelect = ({key}) => {
    this.props.onSelect && this.props.onSelect(key);
  }

  render() {
    let menus = this.props.menus || [];

    return (
      <div className={styles.sider}>
        <Layout.Sider
          theme='light'
          width={'200px'}
          collapsedWidth={'42px'}
          collapsible
          onCollapse={this.onCollapse}
          collapsed={this.state.collapsed}
        >
          <div className={styles.logo}>
            <Icon type="menu-fold" style={{ width: 14, height: 13, color: '#009fe9' }} />
            Bird
          </div>
          <div className={styles.nav}>
            <div className={styles.navTop}><Icon type="bars" style={{ fontSize: 20, color: '#fff', marginRight: '10px' }} /><span>功能导航</span></div>

            <Menu
              theme="light"
              mode="inline"
              openKeys={this.props.openKeys}
              onOpenChange={this.onOpenChange}
              onSelect={this.onSelect}
              selectedKeys={this.props.selectedKeys}
            >
              {
                menus.map(menu => (
                  <SubMenu key={'sMenu_' + menu.id} title={<span><Icon className={styles.icon} type={menu.icon} style={{ fontSize: 16 }} /><span>{menu.name}</span></span>}>
                    {
                      (menu.children || []).map(childMenu => (
                        <Menu.Item key={'tMenu_' + childMenu.id}>
                          <Link to={childMenu.url} className={styles.th_a} >
                            <Icon type={childMenu.icon} style={{ fontSize: 16 }} />
                            <span>{childMenu.name}</span>
                          </Link>
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ))}
            </Menu>
          </div>
        </Layout.Sider>
      </div>
    )

  }
}

Silder.propTypes = {
  menus: PropTypes.array.isRequired,
  openKeys: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array.isRequired,
  onOpenChange: PropTypes.func,
  onSelect: PropTypes.func
}

Silder.defaultProps = {
  menus: [],
  openKeys: [],
  selectedKeys: []
}

export default Silder;
