/**
 * Created by Administrator on 2016/6/2.
 */
import React from 'react';
import Template from './bode-query.template';

const empty=React.createClass({
    query:function () {
        if(this.state.value===""){
            return;
        }
        this.props.onFilter({
            field:this.props.field.data,
            operate:this.state.oprator,
            value:this.state.value
        });
    },
    clear:function () {
        this.setState({
            value:"",
            oprator:"equal"
        });
        this.props.onClear({
            field:this.props.field.data,
            operate:this.state.oprator,
            value:this.state.value
        });
    },

    onOpratorChange:function (operator) {
        this.setState({
            oprator:operator
        });
    },

    onValueChange:function (value) {
        this.setState({
            value:value
        });
    },

    getInitialState:function () {
        return {
            searchOperators:{
                common: [{ value: "equal", text: "等于" }, { value: "notequal", text: "不等于" }],
                struct: [{ value: "less", text: "小于" }, { value: "lessorequal", text: "小于等于" }, { value: "greater", text: "大于" }, { value: "greaterorequal", text: "大于等于" }],
                text: [{ value: "contains", text: "包含" }, { value: "startswith", text: "开始于" }, { value: "endswith", text: "结束于" }]
            },
            oprator:"equal",
            value:""
        };
    },
    render: Template
})

export default empty;
