const { config } = require('./common')

const { apiPrefix } = config;

export default  {
  [`GET ${apiPrefix}/file/getName`] (req, res) {
    res.status(200).json('file')
  },
}
