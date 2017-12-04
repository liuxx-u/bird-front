import React from 'react';
import {BirdGrid} from 'components/Grid';

class SysUserPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    let gridOption = {
      title: "用户列表",
      url: {
        read: "/api/v1/table",
        add: "/sys/user/save",
        edit: "/sys/user/save",
        delete: "/sys/user/delete"
      },
      columns: [
        {title: "编号", data: "id", type: "number",},
        {title: "用户名", data: "userName", type: "text", editor: {}, query: true},
        {title: "昵称", data: "nickName", type: "text", editor: {}, query: true},
        {title: "联系电话", data: "phoneNo", type: "text", editor: {}, query: true},
        {title: "锁定", data: "locked", type: "switch", editor: {}, query: true},
        {
          title: "最后登录时间",
          data: "lastLoginTime",
          type: "datetime",
          editor: {ep: 'hide', ap: 'hide'},
          query: true
        },
        {
          title: "操作选项", type: "command", actions: [{
          name: '查看行数据',
          onClick: (data) => {
            console.log(data);
          }
        }]
        }
      ]
    };
    return (
      <div>
        <BirdGrid gridOption={gridOption}/>
      </div>
    )
  }
}

export default SysUserPage
