
import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from './addActivity.template';

const AddActivityPage = React.createClass({
    getInitialState() {
        let formOption={
            title:"新增活动",
            saveUrl:ApiPrefix+"activity/activities/CreateActivity",
            fields:[
                {title:"活动标题",data:"title",type:"text"},
                {title:"活动描述",data:"description",type:"text"},
                {title:"活动内容",data:"content",type:"text"},
                {title:"活动封面图",data:"cover",type:"text"},
                {title:"最大参与人数",data:"limit",type:"number"},
                {title:"是否免费",data:"isFree",type:"switch"},
                {title:"是否置顶",data:"isTop",type:"switch"},
                {title:"是否发布",data:"isPublish",type:"switch"},
                {title:"创建时间",data:"creationTime",type:"datepicker"}
            ],
            value:{}
        };
        return {
            formOption: formOption
        };
    },
    render: Template,
});

export default AddActivityPage;
