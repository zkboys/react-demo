import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import pageRouts from './allRoutes';
import * as Index from './layouts/app/App';
import * as Home from './layouts/home/Home';
import connectComponent from './utils/connectComponent.js';

const routes = {
    path: '/',
    component: connectComponent(Index),
    indexRoute: {
        component: connectComponent(Home),
    },
    childRoutes: pageRouts,
};

export class LayoutComponent extends Component {

    componentDidMount() {
        const {actions} = this.props;

        browserHistory.listen(() => {
            actions.setSideBarStatus();
            actions.setHeaderMenuStatus();
            actions.setPageHeaderStatus();
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
