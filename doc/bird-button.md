# bird-button

bird-button是基于react antd的Button组件进行封装的支持权限控制与幂等性控制的按钮组件。

## 功能特性

- 支持所有antd Button组件的api
- 支持权限控制
- 支持幂等性控制

## 幂等性实现思路

 1. 按钮加载完成之后获取操作的token；
 2. 使用axios拦截按钮点击事件内部的请求，添加bird-idempotency请求头；
 3. 服务端验证bird-idempotency带上来的token是否有效；
 4. 使用axios拦截服务端响应，移除axios拦截器，并在请求成功后刷新操作的token；

## 使用方式

```
<BirdButton permissionName={'sys'} type='primary' idempotency={true}>测试按钮</BirdButton>
```

## API

支持antd的Button组件的所有api，另外支持：


参数 | 说明 | 类型 | 默认值
---|---|---|---
permissionName | 所需权限名 | string | ''
idempotency | 是否幂等性按钮 | bool | false

默认permissionName为''，表示不验证权限。当permissionName有值时则验证当前用户是否拥有该权限，有则显示。
