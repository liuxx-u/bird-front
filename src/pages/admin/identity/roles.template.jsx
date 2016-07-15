import React from 'react';
import {Modal,Tabs,Tree} from 'antd';
import BodeGrid from '../../../components/uis/tables/bode-grid/bode-grid';
const TabPane=Tabs.TabPane;
const TreeNode=Tree.TreeNode;

const render = function() {
    let self=this;
    let getTreeNode=function (permission) {
        if(permission.children.length>0){
            return (
                <TreeNode title={permission.displayName} key={permission.name}>
                    {permission.children.map(getTreeNode)}
                </TreeNode>
            )
        }
        else {
            return (<TreeNode title={permission.displayName} key={permission.name} />)
        }
    };

    return (
        <div>
            <BodeGrid gridOptions={this.state.gridOptions} ref="grid"></BodeGrid>

            <Modal title={"设置角色权限"}
                   visible={this.state.pVisiable}
                   onOk={this.saveClick}
                   onCancel={this.cancelClick}
                   confirmLoading={this.state.pConfirmLoading}
            >
                <Tabs tabPosition={"left"}>
                    {self.state.permissions.map(function (modulePermission) {
                        return(
                            <TabPane tab={modulePermission.displayName} key={modulePermission.name}>
                                <Tree className="myCls" defaultExpandAll multiple checkable
                                onCheck={self.onPermissionCheck} checkedKeys={self.state.checkedPermissions}>
                                    {modulePermission.children.map(getTreeNode)}
                                </Tree>
                            </TabPane>)
                    })}
                </Tabs>
            </Modal>
        </div>
    );
};

export default render;
