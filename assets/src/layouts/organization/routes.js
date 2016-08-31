import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/organization/users',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                // 由于异步的原因，这里要判断当前浏览器地址与组件的对应关系
                if (window.location.pathname !== nextState.location.pathname) return;
                cb(null, connectComponent(require('./user/UserList')));
            });
        },
    },
    {
        path: '/organization/organizations',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./org/Organization')));
            });
        },
    },
    {
        path: '/organization/roles',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./role/Role')));
            });
        },
    },
];
