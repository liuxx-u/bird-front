# bird-selector

bird-selector是基于react antd的Selector组件进行封装的支持服务端数据与本地数据的两用下拉选择器。

## 功能特性

- 简化下拉选择器的使用
- 支持与服务端数据源
- 支持本地数据源

## 使用方式

```
<BirdSelector dicKey={'zero.test'} onChange={this.selectChange}/>
```
## 效果图

![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-selector.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
data | 指定数据源，示例：[{value:1,label:”选项1”,disable:false}] | array | []
url | 数据源获取地址，返回`data`数组类型的数据格式 | string | ''
dicKey | 字典Key，对应服务端数据源Key | string | ''
disabled | 是否禁用下拉框 | bool | false
size | 输入框大小，可选 large、default、small | string | default
selectedValue | 选中的值 | string | 
width | 宽度,支持数字和百分比 | string | 100%
getPopupContainer | 渲染容器，对应antd中Selector的getPopupContainer | function(node) | ()=>document.body
onChange | 下拉框值改变事件 | function(value) |

数据源使用优先级：data > url > dicKey
关于dicKey的说明，服务端会对系统中所有的下拉选项进行管理，俗称“字典管理”。这个key对应相关字典的Key，服务端需要实现通过key返回对应的下拉选项数组的功能。


### 数据源data相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
value | 选项的值 | string |
label | 选项的显示文本 | string |
disabled | 选项是否可选 | bool | false
