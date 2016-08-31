import connectComponent from '../../utils/connectComponent.js';
import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from '../../utils/route-utils';

export default [
    {
        path: '/system/profile/pass',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./profile/Pass')));
            });
        },
    },
    {
        path: '/system/profile/message',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./profile/Message')));
            });
        },
    },
    {
        path: '/system/settings',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./setting/Setting')));
            });
        },
    },
];
