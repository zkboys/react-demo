# 前端项目

> 基于 react redux antd webpack es6

## Build Setup

``` bash
# install webpack global
sudo npm install webpack -g

# install dependencies
npm install

# serve with hot reload at localhost:6080
npm run dev

# build for production with minification
npm run build

```
## 项目特点
- 前后端分离，前端dev-server反向代理请求

## 文件命名规范
jax文件名首字母大写
js文件名首字母小写

## 页面头部设置
默认根据菜单状态自动设置头部
```
// src/Router.jsx 中代码片段
...
componentDidMount() {
    const {actions} = this.props;

    browserHistory.listen(() => {
        ...
        actions.autoSetPageHeaderStatus();
        ...
    });
}
...
```
各个页面可以自定义头部
```
componentWillMount() {
    const {actions} = this.props;
    actions.setPageHeaderStatus({
        hidden: true,
        title: '自定义title', // 缺省不显示
        breadcrumb:[ // 缺省不显示
            {
                icon: '',
                text: '',
                path: '',
            }
        ],
    });
}

```



## 坑
webpack配置，allChunks要设置为true，否则 webpack异步方式加载的组件 样式无法引入 坑！！！
```
new ExtractTextPlugin('[name].css', {
    disable: false,
    allChunks: true // 不设置成true，webpack异步方式加载的组件 样式无法引入 坑！！！
}),
```
## TODO
- [ ] webpack 打包速度优化，研究一下dll，关于配置 github上搜索 react webpack，看看其他项目webpack是怎么配置的，项目是如何组织的。
- [ ] 单元测试，端对端测试，目前搭建了结构，但是运行报错。
