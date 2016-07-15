import React from 'react';
import {Modal,Checkbox} from 'antd';
import BodeGrid from '../../../components/uis/tables/bode-grid/bode-grid';

const render = function() {
    return (
        <div>
            <BodeGrid gridOptions={this.state.gridOptions} ref="grid"></BodeGrid>

            <Modal title={"设置用户角色"}
                   visible={this.state.roleFormVisiable}
                   onOk={this.saveClick}
                   onCancel={this.cancelClick}
                   confirmLoading={this.state.roleFormConfirmLoading}
            >
                <Checkbox.Group options={this.state.roles} value={this.state.checkedRoles} onChange={this.onRoleChange} />
            </Modal>
        </div>
    );
};

export default render;
