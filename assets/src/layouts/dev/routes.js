import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/dev/menus',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./menu/Menu')));
            });
        },
    },
    {
        path: '/dev/components',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./sys-component/SysComponent')));
            });
        },
    },
];
