const { config } = require('./common')

const { apiPrefix } = config;
let database = {
  "items": [
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:53:19",
      "nickName": "小花猫",
      "id": 10,
      "userName": "xiaohuamao",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:53:04",
      "nickName": "德芙",
      "id": 9,
      "userName": "defu",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:52:52",
      "nickName": "饭饭",
      "id": 8,
      "userName": "fanfan",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:52:36",
      "nickName": "李二",
      "id": 7,
      "userName": "lier",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:52:20",
      "nickName": "王五",
      "id": 6,
      "userName": "wangwu",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:52:09",
      "nickName": "李四",
      "id": 5,
      "userName": "lisi",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:51:24",
      "nickName": "xxx",
      "id": 4,
      "userName": "xxxx",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-12-01 17:51:18",
      "nickName": "gengqingyang",
      "id": 3,
      "userName": "gengqingyang",
      "locked": 0,
      "phoneNo": null
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-11-23 14:48:44",
      "nickName": "liuweidong",
      "id": 2,
      "userName": "liuweidong",
      "locked": 0,
      "phoneNo": ""
    },
    {
      "lastLoginTime": null,
      "createTime": "2017-11-20 17:15:26",
      "nickName": "liuxx",
      "id": 1,
      "userName": "liuxx",
      "locked": 0,
      "phoneNo": null
    }
  ],
  "totalCount": "10"
};

export default  {

  [`POST ${apiPrefix}/table`] (req, res) {
    res.status(200).json(database)
  },
}
