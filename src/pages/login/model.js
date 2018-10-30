import { routerRedux } from 'dva/router'
import { login } from './service'
import {util} from 'utils';

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login({
      payload
    }, { put, call, select }) {
      const data = yield call(login, payload)

      const { locationQuery } = yield select(_ => _.app)
      if (data.success) {
        console.log(data);
        util.auth.setUser(data.user);
        const { from } = locationQuery
        yield put({ type: 'app/query' })
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        throw data
      }
    }
  }
}
