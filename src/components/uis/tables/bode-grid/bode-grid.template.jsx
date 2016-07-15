import React from 'react';
import BodeQuery from '../../query/bode-query/bode-query';
import EmptyTag from '../../../uis/empty/empty';
import AutoForm from '../../../forms/autoform/autoform';
import {Pagination,Modal,Card,Popconfirm,Button,Icon,Popover } from 'antd';

const render = function() {
    let gridOptions=this.props.gridOptions;

    let gridEditClick=this.editClick;
    let editClick=function (data) {
        gridEditClick(data);
    };

    let gridDeleteClick=this.deleteClick;
    let deleteClick=function (id) {
        let ids=[{id:id}];
        gridDeleteClick(ids);
    }

    let gridSortClick=this.sortClick;
    let sortClick=function (col) {
        if(col.sortDisable|| col.type==="command")return;
        gridSortClick(col.data);
    };

    let grid=this;
    let ths=gridOptions.columns.map(function(col){
        let sortClass=col.sortDisable|| col.type==="command"?"":"sorting";
        if(grid.state.sortField===col.data){
            sortClass+="_"+grid.state.sortDirection;
        }

        if(col.hide)return;
        return <th key={col.data} className={sortClass} onClick={sortClick.bind(this,col)}>
            {col.query?<BodeQuery field={col} onFilter={grid.setFilter} onClear={grid.removeFilter} />:<EmptyTag />}
            {col.title}
        </th>;
    });
    let trs=grid.state.gridDatas.items.map(function (data) {
        return <tr className="ant-table-row  ant-table-row-level-0" key={data["id"]}>
            {
                gridOptions.columns.map(function(col){
                    if(col.hide)return;

                    if(col.type==="command"){
                        let tdActions= col.actions||[];

                        return <td key={col.data}>
                            {grid.props.gridOptions.url.edit?<a href="#" onClick={editClick.bind(this,data)}>编辑</a>:<EmptyTag />}

                            {
                                tdActions.map(function (action) {
                                    var actionName=action.nameFormat?action.nameFormat(data):action.name;
                                    return <a href="#" onClick={action.onClick.bind(gridOptions.ref,data)}>{actionName}</a>
                                })
                            }

                            {grid.props.gridOptions.url.delete?
                                <Popconfirm title="确定要删除这条记录吗？" onConfirm={deleteClick.bind(this,data["id"])}>
                                <a href="#">删除</a>
                            </Popconfirm>:<EmptyTag />}


                        </td>;
                    }
                    else {
                        let formatValue;
                        if(col.render){
                            formatValue=col.render(data[col.data],data)
                        }else {
                            formatValue= data[col.data]===null?"":data[col.data].toString();
                        }
                        return <td key={col.data}>{formatValue}</td>;
                    }
                })
            }
        </tr>
    });

    let actions=this.state.actions.map(function (action) {
        return <Button type="ghost" onClick={action.onClick}>{action.name}</Button>
    });

    return (
        <Card bodyStyle={{paddingTop: 12,paddingBottom:0}}>
            <div className="table-operations">
                <div className="table-title">{this.props.gridOptions.title}</div>
                {actions}
            </div>
            <div className="ant-table ant-table-large ant-table-bordered ant-table-scroll-position-left">
                <div className="ant-table-body">
                    <table className="table table-striped table-bordered table-advance table-hover dataTable">
                        <thead className="ant-table-thead">
                        <tr>
                            {ths}
                        </tr>
                        </thead>
                        <tbody className="ant-table-tbody">
                        {trs}
                        </tbody>
                    </table>
                    <Pagination className="bode-table-pagination"
                                current={this.state.curIndex}
                                total={this.state.gridDatas.totalCount}
                                pageSizeOptions={this.props.gridOptions.pageSizeOptions||["10","15","20","30","50","100"]}
                                pageSize={this.state.pageSize}
                                onChange={this.pageClick}
                                showSizeChanger={true}
                                onShowSizeChange={this.pageSizeChange}
                                showTotal={function(total) {
                              return `共 ${total} 条`;
                            }} showSizeChanger />
                </div>

                <Modal title={this.state.formOption.title}
                       visible={this.state.formVisiable}
                       onOk={this.saveClick}
                       onCancel={this.cancelClick}
                       confirmLoading={this.state.formConfirmLoading}
                >
                    <AutoForm formOption={this.state.formOption} ref="autoForm" />
                </Modal>
            </div>
        </Card>
    );
};

export default render;
