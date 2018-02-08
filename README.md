# bird-front

bird-front是基于react、ant-design的中后台管理系统模板。细粒度权限控制方案，同时封装了许多常用的数据组件。项目中使用了许多mock数据，所以暂不支持在线预览，可克隆至本地运行查看效果。

## 权限方案

bird-front对资源权限进行了全新设计，支持细粒度的权限控制（按钮级）。前端的权限应该控制什么？**资源的可见性**。其包括：

- 路由的可见性。
- 页面中按钮的可见性。

在登录时获取用户拥有的权限集合，在前端存储。

- 路由可见性控制：路由变化时，进行权限判断，通过则渲染对应组件，否则渲染403组件。
- 按钮的可见性控制：封装bird-button组件，传入按钮所需权限名，内部进行权限判断，通过则渲染按钮。

前端的权限控制只能处理页面渲染，不能保证系统的绝对安全，服务端也需要对接口的权限进行验证。


## 数据组件

bird-front对常用的数据组件进行了封装，使其简单易用，包括：

- 全自动数据表格：[bird-grid](https://github.com/liuxx001/bird-front/blob/master/doc/bird-grid.md)。示例代码：

```
render() {
    let gridOption = {
      title: "表格示例",
      url: {
        read: "/api/v1/table",
        add: "/test/add",
        edit: "/test/edit",
        delete: "/test/delete"
      },
      checkable:true,
      actions: [{
        name: '外部按钮',
        onClick: function (ids, datas) { }
      }],
      columns: [
        { title: "编号", data: "id", type: "number", },
        { title: "文本", data: "field-text", type: "text", editor: {}, query: true },
        { title: "整数", data: "field-number", type: "number", editor: {}, query: true },
        { title: "小数", data: "field-float", type: "number", editor: { step: 0.1, precision: 2 }, query: true },
        { title: "布尔值", data: "field-switch", type: "switch", editor: {}, query: true },
        { title: "单选", data: "field-dropdown", type: "dropdown", editor: {},source:{url:'/api/v1/getOptions'}, query: true },
        { title: "多选", data: "field-multi", type: "multi", editor: {},source:{key:'xx'} },
        { title: "级联选择", data: "field-cascader", type: "cascader", editor: {},source:{url:'/api/v1/tree'}, query: true },
        { title: "图片", data: "field-img", type: "img", editor: {ap:'hide',ep:'hide'},hide:true },
        { title: "多图片", data: "field-imgs", type: "imgs", editor: {ap:'hide',ep:'hide'},hide:true },
        { title: "文件", data: "field-file", type: "file", editor: {} },
        { title: "多文件", data: "field-files", type: "files", editor: {ap:'hide',ep:'hide'},hide:true },
        { title: "时间", data: "field-datetime", type: "datetime", editor: {}, query: true },
        // { title: "富文本", data: "field-richtext", type: "richtext", editor: {}, query: true },
        {
          title: "操作选项", type: "command", actions: [{
            name: '行内按钮',
            onClick: (data) => {
              console.log(data);
            }
          }]
        }
      ]
    };
    return (
      <div>
        <BirdGrid gridOption={gridOption} />
      </div>
    )
  }
```
很少的代码即可完成表格数据增删查改、高级搜索、排序、分页等功能，新增、编辑的弹框根据表格配置自动生成。效果图：![table.png-64.8kB][1]


- 全自动树表：[bird-tree-grid](https://github.com/liuxx001/bird-front/blob/master/doc/bird-tree-grid.md)
- 数据树：[bird-tree](https://github.com/liuxx001/bird-front/blob/master/doc/bird-tree.md)
- 全自动表单：[bird-form](https://github.com/liuxx001/bird-front/blob/master/doc/bird-form.md)
- 权限按钮：[bird-button](https://github.com/liuxx001/bird-front/blob/master/doc/bird-button.md)
- 下拉选择器：[bird-selector](https://github.com/liuxx001/bird-front/blob/master/doc/bird-selector.md)
- 多选组件：[bird-multi](https://github.com/liuxx001/bird-front/blob/master/doc/bird-multi.md)
- 级联组件：[bird-cascader](https://github.com/liuxx001/bird-front/blob/master/doc/bird-cascader.md)

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
![dashboard.png-89.2kB][3]


  [1]: http://static.zybuluo.com/liuxx-/ooto8w6enlesmmn1hnyo0g4y/table.png
  [2]: http://static.zybuluo.com/liuxx-/fuo5qdc7qo3nrzi4nr9l5m9x/edit.png
  [3]: http://static.zybuluo.com/liuxx-/6b95gug7z6q7v8eqrkgkgkof/dashboard.png