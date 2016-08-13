import React, {Component} from 'react';
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

export class LayoutComponent extends Component {

    componentDidMount() {
        const {actions} = this.props;
        /*
         * 监听地址栏改变，通过左侧菜单状态
         * */
        browserHistory.listen(() => {
            actions.setSideBarStatus();
            actions.getMenus();
        });
    }

    render() {
        return (
            <Router
                routes={routes}
                history={browserHistory}
            />
        );
    }
}


export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.setting,
    };
}
