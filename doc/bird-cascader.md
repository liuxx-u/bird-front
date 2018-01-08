# bird-cascader

bird-cascader是基于react antd的Cascader组件进行封装的支持url获取数据的级联选择器。

## 功能特性

- 支持配置本地数据源
- 支持url获取远程数据
- 支持数据源灵活组装以及指定节点类型

## 使用方式

```
<BirdCascader url={'/api/v1/tree'} />
```

## 效果图

![image.png-9.3kB](http://static.zybuluo.com/liuxx-/1lp7capr6fo18skqsgm91an7/image.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
url | 服务端提供数据地址 | string | ''
data | 指定数据源，示例：[{value:1,label:"节点1",parentValue:0}] | array | []
disabled | 是否禁用 | bool | false
expandTrigger | 展开触发器，`hover`、`click` | string | `click`
placeholder | 占位符 | string | ''
size | 输入框大小，可选 `large` `default` `small` | string | `default`
value | 受控的值 | string | 
getPopupContainer | 菜单渲染父节点。| function | () => document.body


### 数据源data相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
value | 节点的值 | string |
label | 节点显示值 | string |
parentValue | 父节点的值 | string |
folder | 是否强制渲染为文件夹 | bool | false

说明：folder为true的节点如果子节点为空，会向上递归删除空的文件夹节点
