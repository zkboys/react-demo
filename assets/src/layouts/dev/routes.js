import connectComponent from '../../utils/connectComponent.js';
import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from '../../utils/route-utils';

export default [
    {
        path: '/dev/menus',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                // 由于异步的原因，这里要判断当前浏览器地址与组件的对应关系
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./menu/Menu')));
            });
        },
    },
    {
        path: '/dev/components',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./sys-component/SysComponent')));
            });
        },
    },
];
