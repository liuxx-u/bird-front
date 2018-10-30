const config = require('../src/utils/config')

const { apiPrefix } = config

const adminUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin'
  }, {
    id: 2,
    username: 'guest',
    password: 'guest'
  }
]

module.exports = {

  [`POST ${apiPrefix}/user/login`] (req, res) {
    const { username, password } = req.body
    const user = adminUsers.filter(item => item.username === username)

    if (user.length > 0 && user[0].password === password) {
      res.json({ success: true, message: 'Ok',user:user[0] })
    } else {
      res.status(400).end()
    }
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token')
    res.status(200).end()
  }
}
