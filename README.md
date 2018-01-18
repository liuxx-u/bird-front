# bird-front

bird-front是基于react的后台管理系统前端项目，框架构建部分严重借鉴于antd管理系统解决方案antd-admin，其项目地址：[https://github.com/zuiidea/antd-admin](https://github.com/zuiidea/antd-admin)。本项目对于权限部分进行了重新设计，支持按钮级的权限控制，同时封装了很多易用且功能强大的业务组件。

## 权限方案

bird-front对权限部分进行了重新设计，支持更细粒度的权限控制（按钮级）。前端的权限应该控制什么？**资源的可见性**。其包括：

- 路由的可见性。
- 页面中按钮的可见性。

在登录时获取用户拥有的权限集合，在前端存储。

- 路由可见性控制：路由变化时，进行权限判断，通过则渲染对应组件，否则渲染403组件。
- 按钮的可见性控制：封装bird-button组件，传入按钮所需权限名，内部进行权限判断，通过则渲染按钮。

前端的权限控制只能处理页面渲染，不能保证系统的绝对安全，服务端也需要对接口的权限进行验证。


## 组件

bird-front对常用的数据组件进行了封装，使其简单易用，包括：

- 全自动数据表格：bird-grid。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-grid.md)
- 全自动树表：bird-tree-grid。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-tree-grid.md)
- 数据树：bird-tree。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-tree.md)
- 全自动表单：bird-form。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-form.md)
- 权限按钮：bird-button。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-button.md)
- 下拉选择器：bird-selector。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-selector.md)
- 多选组件：bird-multi。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-multi.md)
- 级联组件：bird-cascader。[查看文档](https://github.com/liuxx001/bird-front/blob/master/doc/bird-cascader.md)

所有业务组件的理念均是结合服务端接口进行组件的封装，兼顾灵活性的同时保证更优的业务开发速度。


## 项目获取

```
git clone https://github.com/liuxx001/bird-front
```

## 安装依赖包

```
npm install
```

## 启动项目

```
npm run start
```

登录名：admin
登录密码：admin

## 效果图
![image](https://raw.githubusercontent.com/liuxx001/bird-front/master/doc/bird-admin.png)
