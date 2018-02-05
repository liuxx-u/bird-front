import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider } from 'antd'
import App from 'routes/app'
import Exception from 'components/Exception'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/dashboard',
      models: () => [import('./models/dashboard')],
      component: () => import('./routes/dashboard/'),
    },
    {
      path: '/login',
      models: () => [import('./models/login')],
      component: () => import('./routes/login/'),
    },
    {
      path:'/sys/authorize/user',
      component:()=>import('./routes/sys/authorize/user')
    },
    {
      path:'/demo/bird-grid',
      component:()=>import('./routes/demo/bird-grid')
    },
    {
      path:'/demo/bird-selector',
      component:()=>import('./routes/demo/bird-selector')
    },
    {
      path:'/demo/bird-multi',
      component:()=>import('./routes/demo/bird-multi')
    },
    {
      path:'/demo/bird-cascader',
      component:()=>import('./routes/demo/bird-cascader')
    },
    {
      path:'/demo/bird-form',
      component:()=>import('./routes/demo/bird-form')
    },
    {
      path:'/demo/bird-tree',
      component:()=>import('./routes/demo/bird-tree')
    },
    {
      path:'/demo/bird-button',
      component:()=>import('./routes/demo/bird-button')
    }
  ]

  return (
    <ConnectedRouter history={history}>
      <LocaleProvider locale={zhCN}>
        <App>
          <Switch>
            <Route exact path="/" render={() => (<Redirect to="/dashboard" />)} />
            {
              routes.map(({ path, ...dynamics }, key) => (
                <Route key={key}
                       exact
                       path={path}
                       component={dynamic({
                         app,
                         ...dynamics,
                       })}
                />
              ))
            }
            <Route component={()=>{return <Exception type={404} />}} />
          </Switch>
        </App>
      </LocaleProvider>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
