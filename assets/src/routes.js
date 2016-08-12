export default [
    {
        path: '/demo',
        asyncComponent: './layouts/demo/Demo', // 异步加载组件，最终通过脚本转换为如下格式 所有的routes通过脚本转换到AllRoutes.js中
        // getComponent: (location, cb) => require.ensure([], (require) => cb(null, connectComponent(require('./layouts/demo/Demo')))),
    },
    {
        path: '/demo2',
        asyncComponent: './layouts/demo2/Demo',
    },
];
