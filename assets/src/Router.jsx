import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import pageRouts from './allRoutes';
import * as Index from './layouts/app/App';
import * as Home from './layouts/home/Home';
import connectComponent from './utils/connectComponent.js';

pageRouts.push(
    {
        path: '*',
        getComponent: (location, cb) => {
            require.ensure([], (require) => {
                cb(null, connectComponent(require('./layouts/error/Error404')));
            });
        },
    }
);

const routes = {
    path: '/',
    component: connectComponent(Index),
    indexRoute: {
        component: connectComponent(Home),
    },
    childRoutes: pageRouts,
};

export class LayoutComponent extends Component {

    componentWillMount() {
        const {actions} = this.props;

        browserHistory.listen(() => {
            actions.autoSetSideBarStatus();
            actions.autoSetHeaderMenuStatus();
            actions.autoSetPageHeaderStatus();
            actions.getMenus();
        });
    }

    // 这里可以注入通用props
    createElement = (RouteComponent, props) => {
        return (
            <RouteComponent {...props}/>
        );
    }

    render() {
        return (
            <Router
                routes={routes}
                history={browserHistory}
                createElement={this.createElement}
            />
        );
    }
}
