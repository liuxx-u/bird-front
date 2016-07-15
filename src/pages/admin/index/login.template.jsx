import React from 'react';
import "./login.css";
import {Card,Form,Input,Checkbox,Button} from 'antd';
const FormItem=Form.Item;

const render = function() {
    return (
        <div className="login">
            <Card>
                <Form ref="form">
                    <FormItem label="账户">
                        <Input id="userName" value={this.state.userName} onChange={this.inputChange} placeholder="请输入账户名"/>
                    </FormItem>
                    <FormItem label="密码">
                        <Input type="password" id="password" value={this.state.password} onChange={this.inputChange} placeholder="请输入密码"/>
                    </FormItem>
                    <FormItem>
                        <Checkbox >记住我</Checkbox>
                    </FormItem>
                    <Button type="primary" onClick={this.loginClick}>登录</Button>
                </Form>
            </Card>
        </div>
    );
};

export default render;
