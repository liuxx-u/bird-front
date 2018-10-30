import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Layout } from 'antd'
import { Link } from 'react-router-dom'
import styles from './layoutThree.less'
import { connect } from 'dva'
import { config,classnames } from 'utils'
import { withRouter } from 'dva/router'
import { Helmet } from 'react-helmet'
import { Loader } from 'components'
import UserAvatar from '../components/user/UserAvatar';
import Sider from '../components/sider/Sider';
import Breadcrumb from '../components/Bread/Breadcrumb';

const { Header, Content } = Layout;
const { openPages, iconFontJS, iconFontCSS, logo } = config;

const LayoutThree = ({ children, dispatch, app, loading, location }) => {
  let { pathname } = location;
  const { menus, menuHash, menuPath, openKeys, selectedKeys, cfMenu } = app;

  const siderProps = {
    menus: cfMenu.children,
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
        let cfMenu = menuHash[menu.parentId];
        menuPath.unshift(cfMenu);
        if (cfMenu != null && cfMenu.parentId) {
          menuPath.unshift(menuHash[cfMenu.parentId]);
        }
      }
      dispatch({
        type: 'app/updateState', payload: {
          selectedKeys: [selectedKey],
          menuPath: menuPath
        }
      })
    }
  }

  let firstMenuClick = fMenu => {
    dispatch({ type: 'app/updateState', payload: { cfMenu: fMenu } })
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  return (
    <Layout className={styles.layoutThree}>
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
              <ul className={styles.nav}>
                {
                  menus.map((fMenu, fi) => (
                    <li className={classnames({ [styles.act]: fMenu.id == cfMenu.id })} key={'fMemu_' + fi} onClick={() => firstMenuClick(fMenu)}>
                      <a href="javascript:void(0);">
                        <Icon type={fMenu.icon} style={{ fontSize: 20, marginRight: '2px' }} />
                        <span>{fMenu.name}</span>
                      </a>
                    </li>
                  ))}
              </ul>
              <div className={styles.rightWarpper}>
                <Link to="/synthesis/dashboard" title="首页" className={styles.button}>
                  <Icon type="home" style={{ fontSize: 20 }} />
                </Link>
                <UserAvatar />
              </div>
          </Header>

          <Content className={styles.content}>
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

LayoutThree.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(LayoutThree))
