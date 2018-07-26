const { config } = require('./common')

const { apiPrefix } = config;

export default  {
  [`GET ${apiPrefix}/getOperationToken`] (req, res) {
    res.status(200).json('xxxkaskrr')
  },
}
