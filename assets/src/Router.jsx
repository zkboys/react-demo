import React from 'react';
import {Router, browserHistory} from 'react-router';
import pageRouts from './AllRoutes';
import * as Index from './layouts/app/App';
import * as Home from './layouts/home/Home';
import connectComponent from './utils/connectComponent.js';

/*
 * 根据菜单数据，初始化路由
 * */
const routes = {
    path: '/',
    component: connectComponent(Index),
    indexRoute: {
        component: connectComponent(Home),
    },
    childRoutes: pageRouts,
};

pageRouts.push(
    /*{
     path: '/system/settings',
     getComponent: (location, cb) => {
     require.ensure([], (require) => {
     cb(null, require('./settings/SettingsPage'));
     });
     },
     },
     {
     path: '*',
     getComponent: (location, cb) => {
     require.ensure([], (require) => {
     cb(null, require('../page/error/Error404'));
     });
     },
     }*/
);

export default function () {
    return (
        <Router
            routes={routes}
            history={browserHistory}
        />
    );
}

