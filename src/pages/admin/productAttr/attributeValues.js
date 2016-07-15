
import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const attributeValuePage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"属性值列表",
            url:{
                read:ApiPrefix+"product/attributes/GetAttributeValuePagedList",
                add:ApiPrefix+"product/attributes/CreateAttributeValue",
                edit:ApiPrefix+"product/attributes/UpdateAttributeValue",
                delete:ApiPrefix+"product/attributes/DeleteAttributeValue"
            },
            columns:[
                {title:"属性值",data:"value",type:"text",editor:{},query:true},
                {title:"模版Id",data:"templateId",type:"number",editor:{},query:true},
                {title:"操作选项",type:"command"}
            ]
        };
        return {
            gridOptions: gridOptions
        };
    },
    render: Template,
});

export default attributeValuePage;



