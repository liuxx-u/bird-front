/**
 * Created by Administrator on 2016/4/22.
 */
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import AdminApp from './index/page';
import Login from './index/login';
import DashBoard from './index/dashboard';

import Users from './identity/users';
import Roles from './identity/roles';
import OrganizationUnits from './identity/organization-unit';

import Classifies from './activity/classifies';
import Activities from './activity/activities';
import AddActivity from './activity/addActivity';

import AuditLogs from './log/auditlogs';

const Bootstrapper = {
    start() {
        render((
            <Router history={browserHistory}>
                <Route path="/admin/login" component={Login} />

                <Route path="/admin" component={AdminApp}>
                    <Route path="index" component={DashBoard} />
                    <Route path="identity">
                        <Route path="users" component={Users} />
                        <Route path="roles" component={Roles}/>
                        <Route path="organizationUnits" component={OrganizationUnits}/>
                    </Route>
                    <Route path="activity">
                        <Route path="addActivity" component={AddActivity} />
                        <Route path="classifies" component={Classifies} />
                        <Route path="activities" component={Activities}/>
                    </Route>
                    <Route path="log">
                        <Route path="auditLogs" component={AuditLogs} />
                    </Route>
                </Route>
            </Router>
        ), document.getElementById('mainContainer'));
    },
};

export default Bootstrapper;
