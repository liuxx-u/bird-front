const { config } = require('./common')

const { apiPrefix } = config;
let database = [
  {
    "icon": "setting",
    "id": "1",
    "name": "系统管理",
    "parentId": "0",
    "url": ""
  },
  {
    "icon": "solution",
    "id": "2",
    "name": "权限管理",
    "parentId": "1",
    "url": ""
  },
  {
    "icon": "user",
    "id": "3",
    "name": "用户管理",
    "parentId": "2",
    "url": "/sys/authorize/user"
  }
]

export default  {

    [`GET ${apiPrefix}/menus`] (req, res) {
        res.status(200).json(database)
    },
}
