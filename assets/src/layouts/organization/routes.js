import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/organization/users',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('../demo/Demo')));
            });
        },
    },
    {
        path: '/organization/organizations',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('../demo2/Demo')));
            });
        },
    },
    {
        path: '/organization/roles',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('../demo2/Demo')));
            });
        },
    },
];
