
import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const ActivityPage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"活动列表",
            url:{
                read:ApiPrefix+"activity/activities/GetActivityPagedList",
                add:ApiPrefix+"activity/activities/CreateActivity",
                edit:ApiPrefix+"activity/activities/UpdateActivity",
                delete:ApiPrefix+"activity/activities/DeleteActivity"
            },
            columns:[
                {title:"活动标题",data:"title",type:"text",editor:{},query:true},
                {title:"活动描述",data:"description",type:"text",editor:{},query:true},
                {title:"活动内容",data:"content",type:"text",editor:{},query:true},
                {title:"活动封面图",data:"cover",type:"text",editor:{},query:true},
                {title:"最大参与人数",data:"limit",type:"number",editor:{},query:true},
                {title:"是否免费",data:"isFree",type:"switch",editor:{},query:true},
                {title:"是否置顶",data:"isTop",type:"switch",editor:{},query:true},
                {title:"是否发布",data:"isPublish",type:"switch",editor:{},query:true},
                {title:"活动类型Id",data:"classifyId",type:"number",editor:{},query:true},
                {title:"创建时间",data:"creationTime",type:"datepicker",editor:{},query:true},
                {title:"操作选项",type:"command"}
            ]
        };
        return {
            gridOptions: gridOptions
        };
    },
    render: Template,
});

export default ActivityPage;
