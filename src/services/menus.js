import { request, config } from 'utils'

export async function query(params) {
  return request({
    url: config.api.menus,
    method: 'get',
    data: params
  })
}
