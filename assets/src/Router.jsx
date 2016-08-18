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
            const {usePageWitchAnimation} = this.props.setting;

            actions.autoSetSideBarStatus();
            actions.autoSetHeaderMenuStatus();
            actions.getMenus();

            if (!usePageWitchAnimation) {
                actions.autoSetPageHeaderStatus();
            }
        });

        // 没找到统一的enter 和 leave回调，这里只能为每个route都添加
        pageRouts.forEach(r => {
            const oriOnEnter = r.onEnter;
            const oriOnLeave = r.onLeave;
            r.onEnter = (nextState, replace, callback) => {
                const {usePageWitchAnimation} = this.props.setting;
                const witchDuring = 150;
                if (usePageWitchAnimation) {
                    setTimeout(() => {
                        actions.autoSetPageHeaderStatus();
                        actions.setPageStatus('entered');

                        if (oriOnEnter) {
                            oriOnEnter(nextState, replace, callback);
                        } else {
                            callback();
                        }
                    }, witchDuring);
                } else {
                    callback();
                }
            };
            r.onLeave = (prevState) => {
                const {usePageWitchAnimation} = this.props.setting;
                if (usePageWitchAnimation) {
                    actions.setPageStatus('leaving');
                }
                if (oriOnLeave) {
                    oriOnLeave(prevState);
                }
            };
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
