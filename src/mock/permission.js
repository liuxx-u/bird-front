const { config } = require('./common')

const { apiPrefix } = config;
let database = ["sys:authorize:user","sys:authorize:user:add","sys:authorize:user:edit","sys:authorize:user:delete"];

export default  {

  [`GET ${apiPrefix}/permissions`] (req, res) {
    res.status(200).json(database)
  },
}
