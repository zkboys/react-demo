import connectComponent from '../../utils/connectComponent.js';
import {startFetchingComponent, endFetchingComponent, shouldComponentMount} from '../../utils/route-utils';

export default [
    {
        path: '/organization/users',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./user/UserList')));
            });
        },
    },
    {
        path: '/organization/organizations',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./org/Organization')));
            });
        },
    },
    {
        path: '/organization/roles',
        getComponent: (nextState, cb) => {
            startFetchingComponent();
            require.ensure([], (require) => {
                if (!shouldComponentMount(nextState)) return;
                endFetchingComponent();
                cb(null, connectComponent(require('./role/Role')));
            });
        },
    },
];
