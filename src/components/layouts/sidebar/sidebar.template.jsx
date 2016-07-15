import React from 'react';
import { Link } from 'react-router'
import { Menu, Icon, Switch } from 'antd';
const SubMenu = Menu.SubMenu;

const render = function() {
    return (
        <div className="page-sidebar">
            <div className="sidebar-header-wrapper">
            </div>
            <Menu className="sidebar-menu"
                  onClick={this.handleClick}
                  style={{ width: 240 }}
                  defaultOpenKeys={['sub1']}
                  selectedKeys={[this.state.current]}
                  mode={"inline"}
            >
                {this.state.menus.map(function (menu) {
                    if(menu.items.length>0){
                        return <SubMenu key={menu.name} title={<span><Icon type="mail" /><span>{menu.displayName}</span></span>}>
                                {
                                    menu.items.map(function (item) {
                                        return <Menu.Item key={item.name}><Link to={item.url}>{item.displayName}</Link></Menu.Item>;
                                    })
                                }
                        </SubMenu>
                    }
                    else{
                        return <Menu.Item key={menu.name}><Link to={menu.url}>{menu.displayName}</Link></Menu.Item>;
                    }
                })}
            </Menu>
        </div>
    );
};

export default render;
