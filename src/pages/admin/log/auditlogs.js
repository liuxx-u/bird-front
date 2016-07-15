import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const auditLogPage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"审计日志列表",
            url:{
                read:ApiPrefix+"zero/auditing/GetAuditLogPagedList",
                delete:ApiPrefix+"zero/auditing/DeleteAuditLog"
            },
            columns:[
                {title:"UserId.",data:"userId",type:"int",editor:{},query:true},
                {title:"服务名称",data:"serviceName",type:"text",editor:{},query:true},
                {title:"方法名称",data:"methodName",type:"text",editor:{},query:true},
                {title:"参数",data:"parameters",type:"text",editor:{},query:true},
                {title:"执行时间",data:"executionTime",type:"datetimepicker",editor:{},query:true},
                {title:"耗时",data:"executionDuration",type:"int",editor:{},query:true},
                {title:"客户端ip",data:"clientIpAddress",type:"text",editor:{},query:true},
                {title:"客户端名称",data:"clientName",type:"text",editor:{},query:true},
                {title:"浏览器信息",data:"browserInfo",type:"text",editor:{},query:true},
                {title:"操作选项",type:"command"},
            ]
        };
        return {
            gridOptions: gridOptions
        };
    },
    render: Template,
});

export default auditLogPage;
