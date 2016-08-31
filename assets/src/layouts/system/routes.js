import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/system/profile/pass',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./profile/Pass')));
            });
        },
    },
    {
        path: '/system/profile/message',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./profile/Message')));
            });
        },
    },
    {
        path: '/system/settings',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./setting/Setting')));
            });
        },
    },
];
