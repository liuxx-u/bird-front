import React from 'react'
import { Icon, Menu, message, Modal, Form, Input } from 'antd'
import { request, permission,util } from 'utils'
import styles from './UserAvatar.less'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
class UserAvatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUser:util.auth.getUser(),
      pass: {},
      passVisible:false
    }
  }

  closeModal() {
    this.setState({
      passVisible: false
    })
  }

  onPassFieldChange(key, password) {
    let pass = this.state.pass;
    pass[key] = password;
    this.setState({
      pass: pass
    })
  }

  changePass() {
    let pass = this.state.pass;
    if (!pass['newPass'] || pass['newPass'].length < 6) {
      message.error("密码长度不能小于6位");
      return;
    }
    if (pass['newPass'] != pass['confirmPass']) {
      message.error("两次输入密码不一致");
      return;
    }

    request({
      url: '/sys/user/changePass',
      method: 'POST',
      data: pass
    }).then(() => {
      message.info("密码重置成功");
      this.setState({ passModalVisible: false })
    })
  }

  onMenuClick(item) {
    let key = item.key;
    if (key === 'logout') {
      util.auth.removeToken();
      permission.clear();
      window.location.href = "/login";
    } else if (key === 'changePass') {
      this.setState({
        passVisible: true
      })
    }
  }

  render() {
    return (
      <div className={styles.avatar}>
        <Menu mode="horizontal" onClick={item => { this.onMenuClick(item) }}>
        <Menu.SubMenu style={{float: 'right'}} title={<span><Icon type="user" style={{ fontSize: 20 }} />{this.state.curUser&&this.state.curUser.userName}</span>}>
          <Menu.Item key="changePass">
            修改密码
          </Menu.Item>
          <Menu.Item key="logout">
            安全退出
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
        <Modal
          title="修改密码"
          visible={this.state.passVisible}
          onOk={() => this.changePass()}
          onCancel={() => this.closeModal()}
        >
          <Form>
            <FormItem {...formItemLayout} label='原密码'>
              <Input prefix={<Icon type="lock" />} type="password" placeholder="原密码" onChange={e => this.onPassFieldChange('oldPass', e.target.value)} />
            </FormItem>
            <FormItem {...formItemLayout} label='新密码'>
              <Input prefix={<Icon type="lock" />} type="password" placeholder="新密码" onChange={e => this.onPassFieldChange('newPass', e.target.value)} />
            </FormItem>
            <FormItem {...formItemLayout} label='确认密码'>
              <Input prefix={<Icon type="lock" />} type="password" placeholder="确认密码" onChange={e => this.onPassFieldChange('confirmPass', e.target.value)} />
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default UserAvatar;
