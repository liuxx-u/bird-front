import React from 'react';
import {UrlConf} from '../../../assets/js/bode/bode.conf';
import BodeFetch from '../../../assets/js/bode/bode.fetch';
import Template from './sidebar.template.jsx';

const SideBar = React.createClass({
    getInitialState() {
        return {
            theme: 'light',
            menus:[]
        };
    },
    handleClick:function(e) {
        this.setState({
            current: e.key,
        });
    },
    componentWillMount:function () {
        BodeFetch(UrlConf.getUserNavigations,{},function (menus) {
            for(let i=0;i<menus.length;i++){
                if(menus[i].name==="admin"){
                    this.setState({
                        menus:menus[i].items
                    });
                    break;
                }
            }
        }.bind(this));
    },
    render: Template,
});

export default SideBar;
