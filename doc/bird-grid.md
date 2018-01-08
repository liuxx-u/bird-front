# bird-grid

bird-grid是一个简化业务系统增删改查的全自动表格组件。组件内部处理数据加载、分页、排序、查询、新增、编辑等一系列操作。让业务表格开发变得异常简单。

## 功能特性

- 新增、编辑零代码，支持自定义的编辑配置（提示、是否必填、正则验证等）。
- 查询、排序、分页零代码。每列均可查询、排序。
- 自定义操作，默认提供新增、修改、删除的操作按钮。
- 按钮级权限控制。

## 示例代码

```
render() {
    let gridOption = {
      title: "字典类型",
      url: {
        read: "/sys/dic/getPaged",
        add: "/sys/dic/save",
        edit: "/sys/dic/save",
        delete: "/sys/dic/delete"
      },
      columns: [
        {title: "编号", data: "id", type: "number",},
        {title: "字典名称", data: "name", type: "text", editor: {}, query: true},
        {title: "Key", data: "key", type: "text", editor: {}, query: true},
        {title: "默认业务码", data: "defaultCode", type: "text", editor: {}, query: true},
        {title: "创建时间",data: "createTime",type: "datetime",query: true},
        {title: "操作选项", type: "command", actions: []}
      ]
    };
    return (<BirdGrid gridOption={gridOption}/>)
  }

```

## 效果图

![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-grid.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
url | 表格相关服务api配置 | object | {}
permission | 权限相关配置 | object/string | {}
checkable | 是否添加Checkbox选择框 | bool | false
columns | 表格列配置 | array | []
pageSize | 每页数据条数 | number | 15
pageSizeOptions | 每页数量选项数组 | array | ["10", "15", "20", "30", "50", "100"]
primaryKey | 标识列 | string | 第一列的data参数
sortField | 排序字段 | string | primaryKey
sortDirection | 排序方式：asc、desc | string | 'desc'
actions | 右上角操作按钮集合 | array | [新增]
customRules | 自定义筛选条件 | array | []


### url相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
read | 数据读取url | string | ''
add | 数据新增url | string | ''
edit | 数据编辑url | string | ''
delete | 数据删除url | string | ''

注：所有接口均使用POST提交，read为必填项，其他配置均选填，不配置则不显示相关的操作按钮。

表格请求json格式：

```
{
  "filters": [
    {
      "field": "string",
      "operate": "string",
      "value": "string"
    }
  ],
  "pageIndex": 0,
  "pageSize": 0,
  "sortDirection": 0,
  "sortField": "string"
}
```
接口返回json格式：

```
{
    "items": [],
    "totalCount": "10"
}
```
items中对象的字段对应表格中的列。

### permission相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
add | 新增权限名称 | string | ''
edit | 编辑权限名称 | string | ''
delete | 删除权限名称 | string | ''

add/edit/delete各自对应新增/编辑/删除的权限名称，不配置则表示不验证对应的权限。
permission支持字符串格式，表格初始化时会自动为其添加:add/:edit/:delete权限名。

### columns相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
title | 列名称 | string | 
data | 对应数据的字段名 | string | 
type | 列类型。text、textarea、number、switch、dropdown、cascader、img、date、datetime、hide、command | string | 
query | 列是否可查询 | bool | false
sortDisable | 列是否禁止排序 | bool | false
hide | 列是否隐藏 | bool | false
render | 列渲染方法 | function(v,d) | 
source | 当列类型为dropdown（下拉选择）或cascader（级联选择）时的数据源 | object | 
actions | 当列类型为command时的操作按钮数组 | array |[编辑,删除]
editor | 列的编辑设置 | object | null
说明：

- render(v,d){}方法第一个参数表示当前行当前列的数据，第二个参数表示整行的数据。
- scource:{data:[],url:'',key:''}。当类型为`dropdown`时，其中data、url、key分别对应`bird-selector`中的data、url、dicKey。当类型为`cascader`时，data、url分别对应`bird-cascader`中的data、url。

#### editor相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
ep | 编辑模式。default、hide、disabled | string | default
ap | 新增模式。default、hide、disabled | string | default
tips | 提示信息 | string | ''
isRequired | 是否必填 | bool | false
validateRegular | 验证的正则表达式 | string |
step | number类型下的步长 | number | 1
precision | number类型的精度(小数的位数) | number | 0


#### actions相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
name | 按钮名称 | string | 
onClick | 点击事件 | function(data){} | (data)=>{}
nameFormat | 按钮名称渲染方法，根据行数据渲染不同的按钮名 | function(data){} | 
hideFunc | 根据行数据判断按钮是否显示方法 | function(data){} | 
permissionName | 所需权限名 | string |

说明：

- 本表格所有方法接收的data为行数据（右上角按钮的onClick事件除外）；
- nameFormat，只对行内action有效，优先级高于name；
- hideFunc，只对行内action有效，存在且hideFunc(data)为true时，该按钮隐藏；
- permissionName实现按钮级权限控制；
- onClick。右上角按钮：data表示表格选中的值；行内按钮：data表示行数据；

### customRules相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
field | 列字段名称 | string | 
value | 值 | string | 

说明：
customRules是在表格初始化之前为表格添加自定义查询条件，可用于url上不同参数对于表格数据的控制。
