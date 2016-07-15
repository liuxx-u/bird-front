import React from 'react';
import Template from './bode-treegrid.template';
import BodeFetch from '../../../../assets/js/bode/bode.fetch';

const BodeTreeGrid=React.createClass({
    tableQuery:function () {
        this.refs.grid.query();
    },
    tableRefresh:function () {
        this.refs.grid.reload();
    },
    treeRefresh:function () {

    },

    onTreeSelect:function (selectKeys,e) {
        if(selectKeys.length==0)return;
        if(!this.props.treeGridOptions.treeOptions.canAllClick&&!e.node.props.isLeaf)return;
        this.refs.grid.setCustomDatas([{
            field:this.props.treeGridOptions.treeOptions.paramName,
            value:selectKeys[0]
        }]);
    },

    componentWillMount:function () {
        let self=this;
        BodeFetch(this.props.treeGridOptions.treeOptions.url,{},function (result) {
            self.setState({
                treeDatas:result
            })
        })
    },

    getInitialState:function () {
        return {
            treeDatas:[]
        };
    },
    render:Template
});

export default BodeTreeGrid;
