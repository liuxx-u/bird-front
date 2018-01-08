# bird-tree-grid

bird-grid简化了单表的增删查改操作，但是很多业务场景下，单表操作并不能满足业务需求，特开发树表组件以满足更多的业务需要。其由bird-tree组件与bird-grid组件合并而来。

## 功能特性

- 保留bird-grid的配置模式
- 保留bird-tree自动处理数据、无限递归的特性

## 示例代码

```
render() {
    let gridOption = {
      title: "属性列表",
      url: {
        read: "/cms/attribute/getPaged",
        add: "/cms/attribute/save",
        edit: "/cms/attribute/save",
        delete: "/cms/attribute/delete"
      },
      columns: [
        {title: "编号", data: "id", type: "number",},
        {title: "属性名称", data: "name", type: "text", editor: {}, query: true},
        {title: "Key", data: "key", type: "text", editor: {}, query: true},
        {
          title: "属性类型",
          data: "attributeType",
          type: "dropdown",
          editor: {},
          source: {key: 'cms.attributeType'},
          query: true
        },
        {title: "默认值", data: "defaultValue", type: "text", editor: {}, query: true},
        {title: "提示", data: "tips", type: "text", editor: {}, query: true},
        {title: "分组名", data: "groupName", type: "text", editor: {}, query: true},
        {title: "是否必填", data: "isRequired", type: "switch", editor: {}, query: true},
        {title: "验证正则", data: "validateRegular", type: "text", editor: {}, query: true},
        {title: "排序号", data: "orderNo", type: "number", editor: {}, query: true},
        {title: "选项Key", data: "optionsKey", type: "text", editor: {}, query: true},
        {title: "创建时间", data: "createTime", type: "datetime", query: true},
        {title: "操作选项", type: "command", actions: []}
      ]
    };

    let treeOption = {
      url: '/cms/classify/getTreeData',
      title: '分类',
      paramName: 'classifyId'
    }

    return (<BirdTreeGrid gridOption={gridOption} treeOption={treeOption}/>)
  }

```
## 效果图

![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-tree-grid.png)

## API
gridOption与bird-grid中api一致。treeOption相关API如下：

参数 | 说明 | 类型 | 默认值
---|---|---|---
url | 服务端提供树数据地址 | string | ''
title | 树标题名称 | string | ''
paramName | 树表连接参数名 | string | ''

树表组件中树的点击操作可以看做是点击树节点时向表格传递了一个外部参数，其参数名称为配置的paramName，参数值为点击节点value。
