import { config, util, arrayToTree,permission } from 'utils'
import { routerRedux } from 'dva/router'
import * as menuService from 'services/menus'
import * as permissionsService from 'services/permissions'
import queryString from 'query-string'

export default {
  namespace: 'app',
  state: {
    cfMenu: {},
    menus: [],
    menuHash: {},
    menuPath: [],
    openKeys: [],
    selectedKeys: [],
    locationPath: '',
    locationQuery: {}
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPath: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setup({ dispatch }) {
      dispatch({ type: 'query' })
    }
  },
  effects: {

    * query({ payload }, { call, put, select }) {
      const { locationPath } = yield select(_ => _.app);

      let user = util.auth.getUser();
      if (user) {
        let menus = yield call(menuService.query);
        let menuHash = {}, openKeys = [];
        menus.forEach(item => { menuHash[item.id] = item });
        if (menus.length > 0) {
          openKeys = [`sMenu_${menus[0].id}`];
        }
        let menuTree = arrayToTree(menus, 'id', 'parentId');

        let permissions = permission.getPermissions();
        if (!permissions) {
          permissions = yield call(permissionsService.query);
          permission.setPermissions(permissions)
        }

        yield put({
          type: 'updateState',
          payload: {
            user: { userName: user.userName },
            menus: menuTree,
            cfMenu: menuTree.length > 0 ? menuTree[0] : {},
            menuHash,
            openKeys
          },
        })
      }else if(config.openPages && config.openPages.indexOf(locationPath) < 0){
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPath
          })
        }))
      }
    }
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  }
}