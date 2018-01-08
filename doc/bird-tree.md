# bird-tree

bird-tree是基于react antd的Tree组件进行封装的自动化组件树。

## 功能特性

- 自动获取数据，递归渲染树
- 支持默认选中第一个子节点
- 支持全部展开
- 支持数据源灵活组装以及指定节点类型

## 使用方式

```
let treeOption = {
  url: '/api/v1/tree',
  canSelectFolder: true,
  expandAll: true,
  onSelect: value => this.itemClick(value)
};

<BirdTree treeOption={treeOption}/>
```
## 效果图

![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-tree.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
url | 服务端提供数据地址 | string | ''
data | 指定数据源，示例：[{value:1,label:”节点1”,parentValue:0}] | array | []
textField | 节点名称字段名 | string | 'label'
valueField | 节点值字段名 | string | 'value'
parentField | 父节点字段名 | string | 'parentValue'
initialValue | 一级节点的parentValue | string | '0'
initFirstLeaf | 是否默认点击第一个子节点 | bool | false
canSelectFolder | 文件夹是否允许选中 | bool | false
checkable | 节点前是否添加CheckBox选择框 | bool | false
expandAll | 是否展开全部 | bool | false
onCheck | 点击CheckBox时触发 | function(checkedKeys) | (checkedKeys)=>{}
onSelect | 点击树节点时触发 | function(key) | (key)=>{}


### 数据源data相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
value | 节点的值 | string |
label | 节点显示值 | string |
parentValue | 父节点的值 | string |
folder | 是否强制渲染为文件夹 | bool | false

说明：folder为true的节点如果子节点为空，会向上递归删除空的文件夹节点
