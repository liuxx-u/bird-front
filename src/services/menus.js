import { request } from 'utils'

export async function query (params) {
  return request({
    url: '/api/v1/menus',
    method: 'get',
    data: params,
  })
}
