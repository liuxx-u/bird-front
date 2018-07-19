const { config } = require('./common')

const { apiPrefix } = config;
let database = {
  placeholder:'请选择',
  selectedValue:'',
  options:[
    {
      "label": "选项1",
      "value": "1",
      "disabled": "false"
    },
    {
      "label": "选项2",
      "value": "2",
      "disabled": "false"
    },
    {
      "label": "选项3",
      "value": "3",
      "disabled": "false"
    },
    {
      "label": "选项4不可选",
      "value": "4",
      "disabled": "true"
    },
  ]
}

export default  {
  [`GET ${apiPrefix}/getdic`] (req, res) {
    res.status(200).json(database)
  },
}
