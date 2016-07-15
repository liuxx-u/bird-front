import React from 'react';
import {Row,Col,Tree,Card} from 'antd';
import BodeGrid from '../bode-grid/bode-grid';
const TreeNode=Tree.TreeNode;


const render = function() {
    let getTreeNode=function (node) {
        if(node.children.length>0){
            return (
                <TreeNode title={node.text} key={node.value}>
                    {node.children.map(getTreeNode)}
                </TreeNode>
            )
        }
        else {
            return (<TreeNode title={node.text} key={node.value} isLeaf />)
        }
    };

    return (
        <Row type="flex" justify="center">
            <Col span={4}>
               <Card title={this.props.treeGridOptions.treeOptions.title}>
                   <Tree onSelect={this.onTreeSelect}>
                       {this.state.treeDatas.map(getTreeNode)}
                   </Tree>
               </Card>
            </Col>
            <Col span={20}>
                <BodeGrid gridOptions={this.props.treeGridOptions.gridOptions} ref="grid" />
            </Col>
        </Row>
    )
}

export default render;
