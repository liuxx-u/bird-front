
import React from 'react';
import {ApiPrefix} from '../../../assets/js/bode/bode.conf';
import Template from '../app-common-grid.template.jsx';

const classifyPage = React.createClass({
    getInitialState() {
        let gridOptions={
            title:"分类列表",
            url:{
                read:ApiPrefix+"product/attributes/GetClassifyPagedList",
                add:ApiPrefix+"product/attributes/CreateClassify",
                edit:ApiPrefix+"product/attributes/UpdateClassify",
                delete:ApiPrefix+"product/attributes/DeleteClassify"
            },
            columns:[
                {title:"名称",data:"name",type:"text",editor:{},query:true},
                {title:"排序号",data:"orderNo",type:"number",editor:{},query:true},
                {title:"父级Id",data:"parentId",type:"number",editor:{},query:true},
                {title:"操作选项",type:"command"}
            ]
        };
        return {
            gridOptions: gridOptions
        };
    },
    render: Template,
});

export default classifyPage;



