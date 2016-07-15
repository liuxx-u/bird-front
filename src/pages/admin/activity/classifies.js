
import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const ClassifyPage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"活动类型列表",
            url:{
                read:ApiPrefix+"activity/activities/GetClassifyPagedList",
                add:ApiPrefix+"activity/activities/CreateClassify",
                edit:ApiPrefix+"activity/activities/UpdateClassify",
                delete:ApiPrefix+"activity/activities/DeleteClassify"
            },
            columns:[
                {title:"类型名称",data:"name",type:"text",editor:{},query:true},
                {title:"是否静态类型（静态类型不允许编辑和删除）",data:"isStatic",type:"switch",editor:{},query:true},
                {title:"排序",data:"order",type:"int",editor:{},query:true},
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

export default ClassifyPage;
