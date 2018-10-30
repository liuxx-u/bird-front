import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Layout } from 'antd'
import { Link } from 'react-router-dom'
import styles from './layoutTwo.less'
import { connect } from 'dva'
import { config } from 'utils'
import { withRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { Loader } from 'components'
import UserAvatar from '../components/user/UserAvatar';
import Sider from '../components/sider/Sider';
import Breadcrumb from '../components/Bread/Breadcrumb';

const { Header, Content } = Layout;
const { openPages, iconFontJS, iconFontCSS, logo } = config;

const LayoutTwo = ({ children, dispatch, app, loading, location }) => {
  let { pathname } = location;
  const { menus, menuHash, menuPath, openKeys, selectedKeys } = app;

  const siderProps = {
    menus,
    openKeys,
    selectedKeys,
    onOpenChange(openKeys) {
      dispatch({ type: 'app/updateState', payload: { openKeys: openKeys } })
    },
    onSelect(selectedKey) {
      let menuPath = [];
      let menuId = parseInt(selectedKey.replace('tMenu_', ''));
      let menu = menuHash[menuId];
      menuPath.unshift(menu);
      if (menu != null && menu.parentId) {
        menuPath.unshift(menuHash[menu.parentId]);
      }
      dispatch({
        type: 'app/updateState', payload: {
          selectedKeys: [selectedKey],
          menuPath: menuPath
        }
      })
    }
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  return (
    <Layout className={styles.layoutTwo}>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>{config.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
        <Sider {...siderProps} />
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>

              <div className={styles.rightWarpper}>
                <Link to="/synthesis/dashboard" title="首页" className={styles.button}>
                  <Icon type="home" style={{ fontSize: 20, marginLeft: 20 }} />
                </Link>
                <UserAvatar />
              </div>

          </Header>

          <Content>
            <Breadcrumb menuPath={menuPath} />
            {children}
          </Content>
          {/* <div className={styles.footer}>
            链融宝供应链管理平台 © 2018 通汇诚泰
            </div> */}
        </Layout>
      </Layout>

  )
}

LayoutTwo.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(LayoutTwo))
