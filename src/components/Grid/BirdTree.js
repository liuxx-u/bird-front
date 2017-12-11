import React from 'react';
import PropTypes from 'prop-types';
import { request } from 'utils';
import {Tree} from 'antd';
const TreeNode = Tree.TreeNode;

class BirdTree extends React.Component {
  constructor(props) {
    super(props);

    let defaultOption = {
      textField: 'text',
      valueField: 'value',
      parentField: 'parentValue',
      initialValue: '0',

      initFirstLeaf: false,
      canSelectFolder: false,
      checkable: false,
      expandAll: false
    };

    let option = Object.assign(defaultOption, this.props.treeOption);
    this.state = {
      treeOption: option,
      itemHash: {},
      selectedKeys: [],
      expandedKeys: []
    }
  }

  componentDidMount() {
    let self = this;
    let option = self.state.treeOption;

    self.load(function () {
      let itemHash = self.state.itemHash;
      if (option.initFirstLeaf) {//点击第一个叶子节点
        let firstKey = '';
        let defaultExpandKeys = [];

        //计算第一项及其所有父节点
        let curNodes = itemHash[option.initialValue] || [];
        while (curNodes.length > 0) {
          let node = curNodes[0];
          let nodeKey = 'tree_' + node[option.valueField];
          let children = itemHash[node[option.valueField]] || []
          if (children.length > 0) {
            defaultExpandKeys.push(nodeKey);
            curNodes = children;
          } else {
            firstKey = nodeKey;
            break;
          }
        }

        self.setState({
          expandedKeys: defaultExpandKeys
        }, () => self.itemClick([firstKey], true))
      }
      if (option.expandAll) {//展开全部
        let expandKeys = [];
        let curNodes = itemHash[option.initialValue] || [];
        while (curNodes.length > 0) {
          let temp = [];
          for (let i = 0, len = curNodes.length; i < len; i++) {
            let node = curNodes[i];
            let children = itemHash[node[option.valueField]] || [];
            if (children.length > 0) {
              let nodeKey = 'tree_' + node[option.valueField];
              expandKeys.push(nodeKey);
              temp = temp.concat(children);
            }
          }
          curNodes = temp;
        }
        self.setState({expandedKeys: expandKeys});
      }
    })
  }

  //加载数据源
  load(onComplete) {
    let self = this;
    let itemHash = {};
    let option = self.state.treeOption;

    request({
      url: this.props.treeOption.url,
      method: "get"
    }).then(function (result) {
      for (let i = 0, len = result.length; i < len; i++) {
        let item = result[i];
        if (!itemHash[item[option.parentField]]) {
          itemHash[item[option.parentField]] = [];
        }
        itemHash[item[option.parentField]].push(item);
      }
      self.setState({itemHash: itemHash}, () => {
        onComplete && onComplete()
      });
    });
  }

  //点击事件，不支持点选多个节点
  itemClick(selectKeys, isLeaf) {
    if (selectKeys.length == 0) return;

    let clickKey = selectKeys[0];
    //执行点击事件
    if (this.state.treeOption.canSelectFolder || isLeaf) {
      this.setState({
        selectedKeys: selectKeys
      }, () => {
        this.props.treeOption.onSelect && this.props.treeOption.onSelect(clickKey.replace('tree_', ''))
      });
    }
    else {//文件夹不允许点击且是非叶子节点，展开/收缩
      let expandKeys = this.state.expandedKeys;
      let index = expandKeys.findIndex(key => key == clickKey);
      if (index < 0) {
        expandKeys.push(clickKey);
      } else {
        expandKeys = expandKeys.filter(key => key != clickKey);
      }
      this.setState({
        expandedKeys: expandKeys
      });
    }
  }

  expandClick(expandedKeys) {
    this.setState({
      expandedKeys: expandedKeys
    })
  }

  checkClick(cKeys) {
    let keys = cKeys || [];
    keys = keys.map(key => key.substring(5, key.length));//移除'tree_'前缀
    this.props.treeOption.onCheck && this.props.treeOption.onCheck(keys);
  }

  render() {
    let self = this;
    let option = self.state.treeOption;
    let roots = self.state.itemHash[option.initialValue] || [];

    let getTreeNode = function (node) {
      if (!node) return;
      let textField = self.state.treeOption.textField;
      let valueField = self.state.treeOption.valueField;
      let itemHash = self.state.itemHash;

      let key = 'tree_' + node[valueField];

      let children = itemHash[node[valueField]] || []
      if (children.length > 0) {
        return <TreeNode title={node[textField]} key={key}>
          {children.map(getTreeNode)}
        </TreeNode>
      } else {
        return (<TreeNode title={node[textField]} key={key} isLeaf/>)
      }
    };

    let checkedKeys = self.props.treeOption.checkedKeys || [];
    checkedKeys = checkedKeys.map(key => 'tree_' + key);

    return (
      <Tree onSelect={(sKeys, e) => self.itemClick(sKeys, e.node.props.isLeaf)}
            onExpand={(eKeys) => self.expandClick(eKeys)}
            selectedKeys={self.state.selectedKeys}
            expandedKeys={self.state.expandedKeys}
            autoExpandParent={false}
            showLine
            checkable={self.state.treeOption.checkable}
            checkedKeys={checkedKeys}
            onCheck={cKeys=>self.checkClick(cKeys)}
      >
        {roots.map(getTreeNode)}
      </Tree>)
  }
}

BirdTree.propTypes = {
  treeOption: PropTypes.shape({
    url: PropTypes.string.isRequired,
    textField: PropTypes.string,
    valueField: PropTypes.string,
    parentField: PropTypes.string,
    initialValue: PropTypes.string,

    initFirstLeaf: PropTypes.bool,//是否默认点击第一个叶子节点
    canSelectFolder: PropTypes.bool,//文件夹是否允许选中
    checkable: PropTypes.bool,//节点前添加 Checkbox 复选框
    checkedKeys:PropTypes.array,//选中的keys
    expandAll: PropTypes.bool,//是否展开全部
    onCheck: PropTypes.func,//点击复选框触发
    onSelect: PropTypes.func//点击节点时触发
  })
};

export default BirdTree;
