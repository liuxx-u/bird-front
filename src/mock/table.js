const { config } = require('./common')

const { apiPrefix } = config;
let database = {
  "items": [
    {
      "id":1,
      "field-text":"文本1",
      "field-number":10,
      "field-float":11.11,
      "field-switch":"true",
      "field-dropdown":"1",
      "field-multi":"1,2",
      "field-cascader":"16",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"sss"
    },
    {
      "id":2,
      "field-text":"文本2",
      "field-number":20,
      "field-float":22.22,
      "field-switch":"true",
      "field-dropdown":"2",
      "field-multi":"2,3",
      "field-cascader":"14",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"wwww"
    },
    {
      "id":3,
      "field-text":"文本3",
      "field-number":30,
      "field-float":33.33,
      "field-switch":"false",
      "field-dropdown":"4",
      "field-multi":"1,2,4",
      "field-cascader":"21",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"33333"
    },
    {
      "id":4,
      "field-text":"文本4",
      "field-number":40,
      "field-float":44.44,
      "field-switch":"false",
      "field-dropdown":"3",
      "field-multi":"1,2,3,4",
      "field-cascader":"13",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"44444"
    },
    {
      "id":5,
      "field-text":"文本5",
      "field-number":50,
      "field-float":55.55,
      "field-switch":"true",
      "field-dropdown":"1",
      "field-multi":"2,3",
      "field-cascader":"15",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"5555"
    },
    {
      "id":6,
      "field-text":"文本6",
      "field-number":60,
      "field-float":66.66,
      "field-switch":"false",
      "field-dropdown":"3",
      "field-multi":"1,2,3,4",
      "field-cascader":"12",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"6666"
    },
    {
      "id":7,
      "field-text":"文本7",
      "field-number":70,
      "field-float":77.77,
      "field-switch":"true",
      "field-dropdown":"1",
      "field-multi":"1,2",
      "field-cascader":"17",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"7777"
    },
    {
      "id":8,
      "field-text":"文本8",
      "field-number":80,
      "field-float":88.88,
      "field-switch":"false",
      "field-dropdown":"1",
      "field-multi":"1,2,4",
      "field-cascader":"16",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"8888"
    },
    {
      "id":9,
      "field-text":"文本9",
      "field-number":90,
      "field-float":99.99,
      "field-switch":"true",
      "field-dropdown":"1",
      "field-multi":"2,4",
      "field-cascader":"13",
      "field-img":"",
      "field-imgs":"",
      "field-file":"",
      "field-files":"",
      "field-datetime":"2017-12-01 17:53:04",
      "field-richtext":"9999"
    }
  ],
  "totalCount": "9"
};

export default  {

  [`POST ${apiPrefix}/table`] (req, res) {
    res.status(200).json(database)
  },
}
