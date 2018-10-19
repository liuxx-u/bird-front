const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports =  {
  name: 'bird-front',
  prefix: 'bird',
  footerText: 'bird admin  © 2018 liuxx',
  logo: '/logo.svg',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  CORS: ['http://localhost:8000'],
  openPages: ['/login'],
  apiPrefix: '/api/v1',
  APIV1,
  APIV2,
  color:{
    success:'#52c41a',
    warn:'#E6A23C',
    error:'#ff4d4f'
  },
  api: {
    userLogin: `${APIV1}/user/login`,
    userLogout: `${APIV1}/user/logout`,
    user: `${APIV1}/user/:id`,
    menus: `${APIV1}/menus`,
    getDic:`${APIV1}/getdic?key=`,
    upload:`/file/upload`,
    getFileName:`/file/getName?url=`,
    getOperationToken:`${APIV1}/getOperationToken`,
    permissions:`${APIV1}/permissions`
  }
}
