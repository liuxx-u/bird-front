import React from 'react';
import {message} from 'antd';
import Template from './roles.template';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf'
import BodeFetch from '../../../assets/js/bode/bode.fetch';

let showPermissionModel=function (data) {
    let self=this;
    self.setState({
        curRoleId:data["id"],
        pVisiable:true
    });
    BodeFetch(ApiPrefix+"zero/role/GetRolePermissionNames?roleId="+data["id"],{},function (permissionNames) {
        self.setState({
            checkedPermissions:permissionNames
        });
    });
};

const RolePage = React.createClass({
    onPermissionCheck:function (checkedKeys,e) {
        this.setState({
            checkedPermissions:checkedKeys
        })
    },

    saveClick:function () {
        let self=this;
        self.setState({
            pConfirmLoading:true
        });

        let dto={
            roleId:this.state.curRoleId,
            PermissionNames:this.state.checkedPermissions
        }
         BodeFetch(ApiPrefix+"zero/role/GrantPermissions",dto,function (result) {
             message.success("权限设置成功");
             self.setState({
                 pVisiable:false,
                 pConfirmLoading:false,
                 checkedPermissions:[]
             });
         });
    },
    //弹出框取消事件
    cancelClick:function () {
        this.setState({
            pVisiable:false,
            pConfirmLoading:false,
            checkedPermissions:[]
        });
    },

    componentWillMount:function () {
        let self=this;
        BodeFetch(ApiPrefix+"zero/permission/getAllPermission",{},function (result) {
            self.setState({
                permissions:result
            })
        });
    },

    getInitialState:function () {
        let gridOptions={
            ref:this,
            title:"角色列表",
            url:{
                read:ApiPrefix+"zero/role/GetRolePagedList",
                add:ApiPrefix+"zero/role/CreateRole",
                edit:ApiPrefix+"zero/role/UpdateRole",
                delete:ApiPrefix+"zero/role/DeleteRole"
            },
            columns:[
                {title:"角色名",data:"name",type:"text",editor:{},query:true},
                {title:"显示名",data:"displayName",type:"text",editor:{},query:true},
                {title:"是否静态角色",data:"isStatic",type:"switch",editor:{},query:true},
                {title:"是否默认角色",data:"isDefault",type:"switch",editor:{},query:true},
                {title:"操作选项",type:"command",actions:[{name:"设置权限",onClick:showPermissionModel}]}

            ]
        };
        return {
            gridOptions: gridOptions,
            pVisiable:false,
            pConfirmLoading:false,
            permissions:[],
            checkedPermissions:[],
            curRoleId:0
        };
    },
    render: Template,
});

export default RolePage;

