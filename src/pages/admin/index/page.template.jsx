import React from 'react';
import AdminHead from '../../../components/layouts/header/header';
import SideBar from '../../../components/layouts/sidebar/sidebar';
import { Breadcrumb,Icon } from 'antd';

const render = function() {
    var page=this;
    window.onresize = function () {
        page.setState({
            contentHeight:window.innerHeight - 85
        })
    };

    return (
        <div>
            <AdminHead />
            <div className="main-container">
                <div className="page-container">
                    <SideBar />
                    <div className="page-content">
                        <div className="page-breadcrumbs">
                            <Breadcrumb>
                                <Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item>
                                <Breadcrumb.Item><a href="">应用中心</a></Breadcrumb.Item>
                                <Breadcrumb.Item><a href="">应用列表</a></Breadcrumb.Item>
                                <Breadcrumb.Item>某应用</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="page-body" style={{height:this.state.contentHeight}}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default render;
