/**
 * Created by Administrator on 2016/4/27.
 */
import './bode-grid.css';
import BodeFetch from '../../../../assets/js/bode/bode.fetch';
import React from 'react';
import {message} from 'antd';
import Template from './bode-grid.template';
import {DateRender,DateTimeRender,TimeRender,SwitchRender} from './render';

const BodeGrid=React.createClass({

    /* 分页点击事件 */
    pageClick:function (pageIndex) {
        this.query(function (dto) {
            dto.pageIndex=pageIndex;
        });
        this.setState({
            curIndex:pageIndex
        });
    },
    /* 每页显示数量改变事件 */
    pageSizeChange:function (current, pageSize) {
        this.query(function (dto) {
            dto.pageIndex=1;
            dto.pageSize=pageSize;
        });
        this.setState({
            pageIndex:1,
            pageSize:pageSize
        });
    },
    /* 新增点击事件 */
    addClick:function () {
        let formOption={
            title:"新增",
            saveUrl:this.props.gridOptions.url.add,
            isModelForm:true,
            fields:this.props.gridOptions.columns,
            value:{},
            isSeparate:this.props.gridOptions.isFormSeparate,
            extraParams:this.state.customDatas
        };
        this.setState({
            formVisiable:true,
            formOption:formOption
        });
    },
    /* 编辑点击事件 */
    editClick:function (data) {
        let formOption={
            title:"编辑",
            saveUrl:this.props.gridOptions.url.edit,
            isModelForm:true,
            fields:this.props.gridOptions.columns,
            value:data,
            isSeparate:this.props.gridOptions.isFormSeparate,
            extraParams:this.state.customDatas
        };
        this.setState({
            formVisiable:true,
            formOption:formOption
        });
    },
    /* 删除点击事件 */
    deleteClick:function (ids) {
        let self=this;
        BodeFetch(this.props.gridOptions.url.delete,ids,function (data) {
            message.success('删除成功');
            self.query();
        });
    },
    /* 表单保存 */
    saveClick:function () {
        let self=this;
        self.setState({
            formConfirmLoading:true
        });

        this.refs.autoForm.saveClick(function (result) {
            self.setState({
                formVisiable:false,
                formConfirmLoading:false
            });
            self.query();
        });
    },
    //弹出框取消事件
    cancelClick:function () {
        this.setState({
            formVisiable:false,
            formConfirmLoading:false
        });
    },
    /* 排序点击事件 */
    sortClick:function (sortField) {
        let sortDirection=sortField!==this.state.sortField?"asc":this.state.sortDirection==="asc"?"desc":"asc";
        this.query(function (dto) {
            dto.sortConditions=[{
                sortField:sortField,
                listSortDirection:sortDirection==="asc"?0:1
            }];
        });
        this.setState({
            sortField:sortField,
            sortDirection:sortDirection
        });
    },

    /* 数据查询 */
    query:function (dtoHandler) {
        let customRules= this.state.customDatas.map(function (data) {
            return {
                field:data.field,
                operate:"equal",
                value:data.value
            }
        });

        let dto={
            pageIndex: this.state.curIndex,
            pageSize: this.state.pageSize,
            sortConditions:[{
                sortField:this.state.sortField,
                listSortDirection:this.state.sortDirection==="asc"?0:1
            }],
            filterGroup:{rules:this.state.filterRules.concat(customRules)}
        };
        if(dtoHandler)dtoHandler(dto);

        BodeFetch(this.props.gridOptions.url.read,dto,function (data) {
            this.setState({
                gridDatas:data
            });
        }.bind(this));
    },
    reload:function (customDatas) {
        let self=this;
        let cusDatas=customDatas||this.state.customDatas;

        let customRules= cusDatas.map(function (data) {
            return {
                field:data.field,
                operate:"equal",
                value:data.value
            }
        });
        this.query(function (dto) {
            dto.pageIndex=1;
            dto.pageSize=self.props.gridOptions.pageSize||15;
            dto.sortConditions=[{
                sortField:self.props.gridOptions.sortField||self.props.gridOptions.columns[0].data,
                listSortDirection:self.props.gridOptions.sortDirection||"desc"
            }];
            dto.filterGroup={
                rules:customRules
            }
        });

        self.setState({
            curIndex:1,
            pageSize:self.props.gridOptions.pageSize||15,
            sortField:self.props.gridOptions.sortField||self.props.gridOptions.columns[0].data,
            sortDirection:self.props.gridOptions.sortDirection||"desc",
            filterRules:[],
        });
    },
    setCustomDatas:function (datas) {
        this.reload(datas);
        this.setState({
            customDatas:datas
        });
    },

    _handlerFilter:function(rule,hook){
        let rules=this.state.filterRules;
        let newRules=[];
        for(let i=0;i<rules.length;i++){
            if(rules[i].field!==rule.field){
                newRules.push(rules[i]);
            }
        }
        hook(newRules);
        let customRules= this.state.customDatas.map(function (data) {
            return {
                field:data.field,
                operate:"equal",
                value:data.value
            }
        });
        this.query(function (dto) {
            dto.filterGroup={
                rules:newRules.concat(customRules)
            };
        });
        this.setState({
            filterRules:newRules
        });
    },

    removeFilter:function (rule) {
        this._handlerFilter(rule,function () {});
    },

    setFilter:function (rule) {
        this._handlerFilter(rule,function (rules) {
            rules.push(rule);
        });
    },
    /* 初始化State */
    getInitialState:function () {
        return {
            actions:[],
            curIndex:1,
            pageSize:this.props.gridOptions.pageSize||15,
            sortField:this.props.gridOptions.sortField||this.props.gridOptions.columns[0].data,
            sortDirection:this.props.gridOptions.sortDirection||"desc",
            filterRules:[],
            gridDatas:{
                totalCount:0,
                items:[]
            },
            formVisiable:false,
            formConfirmLoading:false,
            formOption:{
                saveUrl:"",
                isModelForm:true,
                fields:[],
                value:{},
                isSeparate:this.props.gridOptions.isFormSeparate
            },
            customDatas:[]
        };
    },
    /* 初始化渲染执行之前执行 */
    componentWillMount:function () {
        let defaultActions=[];
        if(this.props.gridOptions.url.add){
            defaultActions.push({
                name:"新增",
                onClick:this.addClick
            });
        }
        let optionActions=this.props.gridOptions.actions||[];
        optionActions=optionActions.concat(defaultActions);
        this.setState({actions:optionActions});

        for(let i=0;i<this.props.gridOptions.columns.length;i++){
            var column=this.props.gridOptions.columns[i];
            if(column.render)continue;
            if(column.type==="datepicker"){
                column.render=DateRender;
            }
            else if(column.type==="datetimepicker"){
                column.render=DateTimeRender;
            }
            else if(column.type==="timepicker"){
                column.render=TimeRender;
            }
            else if(column.type==="switch"){
                column.render=SwitchRender;
            }
        }

        this.query();
    },
    componentWillReceiveProps:function (nextProps) {

    },
    render: Template,
})

export default BodeGrid;
