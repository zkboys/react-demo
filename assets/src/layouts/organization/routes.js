import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/organization/users',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                // TODO 判断是否要执行cb？
                if (location.pathname !== nextState.location.pathname) {
                    return;
                }
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
