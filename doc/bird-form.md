# bird-form

bird-form简化了普通表单的编码操作，表单的内容通过配置自动渲染。

## 功能特性

- 支持表单中字段的配置，并根据配置自动渲染相关组件。
- 支持字段提示配置。
- 自持字段是否必填配置。
- 支持提交时字段正则表达式验证配置。
- 支持按tab分组。
- 支持配置每行显示的字段数量，最小1，最大4。

## 示例代码

```
const fields=[
  {
    name: "字段1",
    key: "name",
    defaultValue: "aaa",
    tips: '我是提示啊',
    groupName: '分组1',
    isRequired: true,
    fieldType: 'text',
    validateRegular: '',
    value:'',
    disabled:false
  },
  {
    name: "字段2",
    key: "name2",
    defaultValue: "aaa2",
    tips: '我是提示啊2',
    groupName: '分组2',
    isRequired: false,
    fieldType: 'number',
    validateRegular: '',
    value:'',
    disabled:false
  }
];

<BirdForm fields={fields} withTab={true} saveUrl={'/save'} ref='form' />
```
## 效果图

![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-form.png)

## API

参数 | 说明 | 类型 | 默认值
---|---|---|---
fields | 列配置数组 | array | 
lineCapacity | 每行容量，1~4 | number | 1
withTab | 是否使用tab进行分组 | bool | false
defaultGroupName | 默认的分组名 | string | '基础信息'
activeGroupName | 默认选中的分组名 | string | 
tabType | tab的类型。'line','card' | string | 'line'
tabPosition | tab的位置。'top', 'right', 'bottom', 'left' | string | 'top'
saveUrl | 数据提交地址 | string | ''
value | 初始值 | object | {}


- saveUrl配置之后自动渲染提交按钮。
- 示例代码中可用this.refs.form.getResult()获取表单编辑之后的数据。

### fields相关API

参数 | 说明 | 类型 | 默认值
---|---|---|---
name | 名称 | string | 
key | 对应提交的字段名 | string | 
fieldType | 字段类型。text,textarea,number,switch,dropdown,img,date,datetime,hide,command | string | ''
isRequired | 是否必填 | bool | false
tips | 提示 | string | 
groupName | 分组名 | string | ''
validateRegular | 提交时验证的正则表达式 | string | 
source | 当fieldType=’dropdown’时的数据源 | object | 

source对应bird-selector中的source
