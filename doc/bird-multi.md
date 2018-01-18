# bird-multi

bird-multi是基于react antd的CheckBox.Group组件进行封装的支持服务端数据与本地数据源的两用多选组件。

## 功能特性

- 简化多选组件的使用
- 支持服务端数据源
- 支持本地数据源

## 使用方式

```
<BirdSelector dicKey={'zero.test'} onChange={this.selectChange}/>
```
## 效果图

![!\[image\]](http://static.zybuluo.com/liuxx-/8iz878xh02pyg0o4qhyselj4/image.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
options | 指定数据源，示例：[{value:1,label:'选项1',disable:false}] | array | []|
url | 数据源获取地址，返回`options`数组类型的数据格式 | string | ''|
dicKey | 字典Key，对应服务端数据源Key | string | ''|
disabled | 是否禁用 | bool | false|
selectedValue | 选中的值（逗号分隔） | string |  ''|
onChange | 下拉框值改变事件 | function(value) ||
canCheckAll | 是否渲染全选按钮 | bool | false 

数据源使用优先级：options > url > dicKey
关于dicKey的说明，服务端会对系统中所有的下拉选项进行管理，俗称“字典管理”。这个key对应相关字典的Key，服务端需要实现通过key返回对应的下拉选项数组的功能。


### 数据源options相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
value | 选项的值 | string |
label | 选项的显示文本 | string |
disabled | 选项是否可选 | bool | false
