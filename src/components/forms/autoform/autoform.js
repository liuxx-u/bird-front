/**
 * Created by Administrator on 2016/6/2.
 */
import React from 'react';
import BodeFetch from '../../../assets/js/bode/bode.fetch'
import {BodeTools} from '../../../assets/js/bode/bode'
import Template from './autoform.template.jsx';
import {message} from 'antd';


const AutoForm = React.createClass({
    saveClick:function (callback) {
        let dto=this.state.initValue;
        let extraParams=this.state.extraParams;
        for(let i=0;i<extraParams.length;i++){
            dto[extraParams[i].field]=extraParams[i].value;
        }
        BodeFetch(this.props.formOption.saveUrl,this.state.initValue,function (result) {
            message.success('保存成功');
            if(callback)callback(result);
        });
    },

    onFieldChange:function (key,value) {
        let initValue=this.state.initValue;
        initValue[key]=value;
        this.setState({
            initValue:initValue
        });
    },
    getInitialState:function () {
        var initValue=BodeTools.deepClone(this.props.formOption.value);

        return {
            initValue:initValue,
            extraParams:this.props.formOption.extraParams
        };
    },
    componentWillReceiveProps:function (nextProps) {
        var initValue=BodeTools.deepClone(nextProps.formOption.value);
        this.setState({
            initValue:initValue,
            extraParams:nextProps.formOption.extraParams
        });
    },
    render: Template,
});

export default AutoForm;
