import React from 'react';
import {message} from 'antd';
import BodeFetch from '../../../assets/js/bode/bode.fetch';
import {BodeTools} from '../../../assets/js/bode/bode';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from './users.template';


let switchUserStatus=function (data) {
    let self=this;
    BodeFetch(ApiPrefix+"zero/user/ActiveUserOrNot?userId="+data["id"],{},function () {
        let msg=data["isActive"]?"冻结成功":"解冻成功";
        message.success(msg);
        self.refs.grid.query();
    })
};

let showRoleModel=function (data) {
    let self=this;
    BodeFetch(ApiPrefix+"zero/user/GetUserRoles?userId="+data["id"],{},function (roleNames) {
        self.setState({
            roleFormVisiable:true,
            checkedRoles:roleNames
        });
    });
};

const UserPage = React.createClass({
    onRoleChange:function (checkedValues) {
        this.setState({
            checkedRoles:checkedValues
        })
    },

    saveClick:function () {
        let self=this;
        self.setState({
            roleFormConfirmLoading:true
        });

        let roleNames=BodeTools.expandAndToString(this.state.checkedRoles);
        BodeFetch(ApiPrefix+"zero/user/SetUserRoles?roleNames="+roleNames,{},function (result) {
            message.success("角色设置成功");
            self.setState({
                roleFormVisiable:false,
                roleFormConfirmLoading:false
            });
        });
    },
    //弹出框取消事件
    cancelClick:function () {
        this.setState({
            roleFormVisiable:false,
            roleFormConfirmLoading:false
        });
    },

    componentWillMount:function () {
        let self=this;
        BodeFetch(ApiPrefix+"zero/role/getAllRoleNames",{},function (result) {
            let roles=[];
            for(let i=0;i<result.length;i++){
                roles.push({
                    label:result[i].displayName,
                    value:result[i].roleName
                });
            }
            self.setState({
                roles:roles
            })
        });
    },

    getInitialState:function() {
        let gridOptions={
            ref:this,
            title:"用户列表",
            url:{
                read:ApiPrefix+"zero/user/GetUserPagedList"
            },
            columns:[
                {title:"用户名",data:"userName",type:"text",editor:{}},
                {title:"名称",data:"name",type:"text",editor:{}},
                {title:"手机号码",data:"phoneNo",type:"text",editor:{}},
                {title:"邮箱",data:"emailAddress",type:"text",editor:{}},
                {title:"是否验证邮箱.",data:"isEmailConfirmed",type:"switch",editor:{}},
                {title:"是否验证手机",data:"isPhoneNoConfirm",type:"switch",editor:{}},
                {title:"是否激活",data:"isActive",type:"switch",editor:{}},
                {title:"最后登录时间",data:"lastLoginTime",type:"datetimepicker",editor:{}},
                {title:"创建时间",data:"creationTime",type:"datepicker",editor:{}},
                {
                    title:"操作选项",
                    type:"command",
                    actions:[
                        {name:"冻结",nameFormat:function (data) {return data["isActive"]?"冻结":"解冻";},onClick:switchUserStatus},
                        {name:"设置角色",onClick:showRoleModel},
                    ]
                },
            ]
        };
        return {
            gridOptions: gridOptions,
            roleFormVisiable:false,
            roleFormConfirmLoading:false,
            roles:[],
            checkedRoles:[]
        };
    },

    render: Template,
});

export default UserPage;



