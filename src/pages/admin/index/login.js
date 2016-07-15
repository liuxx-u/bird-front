import React from 'react';
import Template from './login.template';
import BodeFetch from '../../../assets/js/bode/bode.fetch';
import {UrlConf} from '../../../assets/js/bode/bode.conf';
import {BodeAuth} from '../../../assets/js/bode/bode';
import {History} from 'react-router';

const LoginPage = React.createClass({
    inputChange:function (e) {
        if(e.target.id=="userName"){
            this.setState({
                userName:e.target.value
            });
        }
        else {
            this.setState({
                password:e.target.value
            });
        }
    },
    rememberChange:function () {
      this.setState({
          remember:!this.state.remember
      })
    },

    loginClick:function () {
        let self=this;
        let dto={
            userName:this.state.userName,
            password:this.state.password
        }
        BodeFetch(UrlConf.login,dto,function (token) {
            BodeAuth.login(token);
            self.props.history.pushState(null, '/admin/index');
        });
    },
    getInitialState:function() {
        return {
            userName:"",
            password:"",
            remember:false
        };
    },

    render:Template
});

export default LoginPage;
