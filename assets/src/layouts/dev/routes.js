import connectComponent from '../../utils/connectComponent.js';

export default [
    {
        path: '/dev/menus',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./menu/Menu')));
            });
        },
    },
    {
        path: '/dev/components',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./sys-component/SysComponent')));
            });
        },
    },
];
