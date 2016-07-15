import React from 'react';
import Template from './organization-unit.template';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf'

const OrganizationUnitPage = React.createClass({
    getInitialState:function () {
        let treeGridOptions= {
            treeOptions:{
                title:"组织机构树",
                url:ApiPrefix + "zero/organization/GetOrganizationUnitTreeData",
                paramName:"parentId",
                canAllClick:true
            },
            gridOptions: {
                ref: this,
                title: "组织机构列表",
                url: {
                    read: ApiPrefix + "zero/organization/GetOrganizationUnitPagedList",
                    add: ApiPrefix + "zero/organization/CreatOrganizationUnit",
                    edit: ApiPrefix + "zero/organization/UpdateOrganizationUnit",
                    delete: ApiPrefix + "zero/organization/DeleteOrganizationUnit"
                },
                columns: [
                    {title: "名称", data: "displayName", type: "text", editor: {}, query: true},
                    {title: "编码", data: "code", type: "text", editor: {}, query: true},
                    {title: "操作选项", type: "command"}

                ]
            }
        };
        return {
            treeGridOptions:treeGridOptions
        };
    },
    render: Template,
});

export default OrganizationUnitPage;
