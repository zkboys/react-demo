import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/system/profile/pass',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./profile/Pass')));
            });
        },
    },
    {
        path: '/system/profile/message',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./profile/Message')));
            });
        },
    },
    {
        path: '/system/settings',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./setting/Setting')));
            });
        },
    },
];
