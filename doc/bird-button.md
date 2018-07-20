# bird-button

bird-button是基于react antd的Button组件进行封装的支持权限控制的按钮组件。

## 功能特性

- 支持所有antd Button组件的api
- 支持权限控制

## 使用方式

```
<BirdButton permission={'sys'} type='primary'>测试按钮</BirdButton>
```

## API
除permission外属性都会渲染至antd的Button组件


参数 | 说明 | 类型 | 默认值
---|---|---|---
permission | 所需权限名 | string | ''

默认permission为''，表示不验证权限。当permission有值时则验证当前用户是否拥有该权限，有则显示。
