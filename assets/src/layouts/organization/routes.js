import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/organization/users',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./user/UserList')));
            });
        },
    },
    {
        path: '/organization/organizations',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./org/Organization')));
            });
        },
    },
    {
        path: '/organization/roles',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./role/Role')));
            });
        },
    },
];
