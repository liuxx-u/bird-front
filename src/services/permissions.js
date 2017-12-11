import { request,config } from 'utils'

export async function query (params) {
  return request({
    url: config.api.permissions,
    method: 'get',
    data: params,
  })
}
