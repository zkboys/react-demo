import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import pageRouts from './all-routes';
import * as AppFrame from './layouts/app-frame/AppFrame';
import * as Home from './layouts/home/Home';
import connectComponent from './utils/connectComponent.js';
import * as Utils from './utils';


export class LayoutComponent extends Component {
    constructor(props) {
        super(props);

        const {actions} = this.props;

        // 所有未截获请求，渲染Error404组件
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

        // 没找到统一的enter 和 leave回调，这里只能为每个route都添加
        pageRouts.forEach(r => {
            const oriOnEnter = r.onEnter;
            const oriOnLeave = r.onLeave;

            r.onEnter = (nextState, replace, callback) => {
                this.onEnter(nextState, replace, callback, oriOnEnter);
            };
            r.onLeave = (prevState) => {
                this.onLeave(prevState, oriOnLeave);
            };
        });

        this.routes = {
            path: '/',
            component: connectComponent(AppFrame),
            indexRoute: {
                component: connectComponent(Home),
                onEnter: this.onEnter,
                onLeave: this.onLeave,
            },
            childRoutes: pageRouts,
        };

        browserHistory.listen(() => {
            const {usePageWitchAnimation} = this.props;

            actions.autoSetSideBarStatus();
            actions.autoSetHeaderMenuStatus();
            actions.getMenus();

            if (!usePageWitchAnimation) {
                actions.autoSetPageHeaderStatus();
            }
        });
    }

    onLeave = (prevState, oriOnLeave) => {
        const {usePageWitchAnimation, actions, randomPageAnimation} = this.props;

        if (usePageWitchAnimation) {
            if (randomPageAnimation) {
                const pageAnimationTypes = ['up', 'down', 'left', 'right', 'fade'];
                const random = Utils.getRandomNum(0, 4);
                const pageAnimationType = pageAnimationTypes[random];
                actions.setSettings({pageAnimationType});
            }

            actions.setPageStatus('leaving');
        }

        if (oriOnLeave) {
            oriOnLeave(prevState);
        }
    }

    onEnter = (nextState, replace, callback, oriOnEnter) => {
        const {usePageWitchAnimation, actions} = this.props;
        const switchDuring = 150;

        const scrollDom = document.documentElement || document.body;

        if (usePageWitchAnimation) {
            setTimeout(() => {
                actions.autoSetPageHeaderStatus();

                setTimeout(() => {
                    actions.setPageStatus('entered');
                }, switchDuring);

                if (oriOnEnter) {
                    oriOnEnter(nextState, replace, callback);
                } else {
                    scrollDom.scrollTop = 0;
                    callback();
                }
            }, switchDuring);
            return;
        }

        if (oriOnEnter) {
            oriOnEnter(nextState, replace, callback);
        } else {
            scrollDom.scrollTop = 0;
            callback();
        }
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
                routes={this.routes}
                history={browserHistory}
                createElement={this.createElement}
            />
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.setting,
    };
}
