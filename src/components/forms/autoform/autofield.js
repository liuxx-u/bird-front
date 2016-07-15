/**
 * Created by Administrator on 2016/6/2.
 */
import React from 'react';
import Template from './autofield.template.jsx';

const AutoField = React.createClass({
    getInitialState:function () {
        let fieldOption={
            title:"是否默认角色",
            data:"isDefault",
            type:"bool",
            editor:{},
            initValue:""
        };
        return {
            fieldOption: fieldOption
        };
    },
    render: Template,
});

export default AutoField;


