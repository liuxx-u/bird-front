import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const attributeTemplatePage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"属性模版列表",
            url:{
                read:ApiPrefix+"product/attributes/GetAttributeTemplatePagedList",
                add:ApiPrefix+"product/attributes/CreateAttributeTemplate",
                edit:ApiPrefix+"product/attributes/UpdateAttributeTemplate",
                delete:ApiPrefix+"product/attributes/DeleteAttributeTemplate"
            },
            columns:[
                {title:"模版名称",data:"name",type:"text",editor:{},query:true},
                {title:"是否必填项",data:"isRequired",type:"switch",editor:{},query:true},
                {title:"是否SKU属性",data:"isSkuAttribute",type:"switch",editor:{},query:true},
                {title:"是否在客户端展示",data:"isShowToClient",type:"switch",editor:{},query:true},
                {title:"操作选项",type:"command"}
            ]
        };
        return {
            gridOptions: gridOptions
        };
    },
    render: Template,
});

export default attributeTemplatePage;
