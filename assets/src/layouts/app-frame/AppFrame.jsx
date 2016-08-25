import 'antd/dist/antd.css';
import classNames from 'classnames';
import React, {Component} from 'react';
import {message} from 'antd';
import './style.less';
import SideBar from './SideBar';
import Header from './Header';
import PageHeader from './PageHeader';

export class LayoutComponent extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.toast.id !== nextProps.toast.id) {
            const {text, type} = nextProps.toast;

            if (type === 'error') {
                message.error(text);
            } else if (type === 'success') {
                message.success(text);
            } else {
                message.warning(text);
            }
        }
    }

    componentDidMount() {
        const {actions} = this.props;

        actions.getMenus();
        actions.getCurrentUser();
        actions.getStateFromStorage();
    }

    render() {
        const {
            isSidebarCollapsed,
            currentHeaderKey,
            sideBarHidden,
            headerMenus,
            user,
            sideBarMenus,
            openKeys,
            selectedKeys,
            children,
            pageHeader,
            pageHeaderFixed,
            pageStatus,
            pageAnimationType,
        } = this.props;

        const {
            logout,
            toggleSideBar,
        } = this.props.actions;
        const pageHeaderClassName = classNames({
            fixed: true,
            collapsed: isSidebarCollapsed,
            full: sideBarHidden,
            [pageStatus]: true,
            [pageAnimationType]: true,
        });
        const appContentClassName = classNames({
            'app-content': true,
            collapsed: isSidebarCollapsed,
            full: sideBarHidden,
            [pageStatus]: true,
            'page-header-fixed': pageHeaderFixed,
            'page-header-hidden': pageHeader.hidden,
            [pageAnimationType]: true,
        });

        return (
            <div>
                <Header
                    collapsed={isSidebarCollapsed}
                    exit={logout}
                    menus={headerMenus}
                    current={currentHeaderKey}
                    user={user}
                    toggleSideBar={toggleSideBar}
                />
                <SideBar
                    menus={sideBarMenus}
                    collapsed={isSidebarCollapsed}
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    hidden={sideBarHidden}
                />
                {
                    // 元素使用了transform 内部元素 display:fixed 将失效 (chrome, opera)
                    // 防止启用动画时 app-content 会添加transform属性, pageHeader 固定失效，这里需要将 PageHeader提出来
                    pageHeaderFixed ?
                        <PageHeader
                            className={pageHeaderClassName}
                            hidden={pageHeader.hidden}
                            title={pageHeader.title}
                            breadcrumb={pageHeader.breadcrumb}
                        />
                        :
                        null
                }

                <div className={appContentClassName}>
                    {
                        !pageHeaderFixed ?
                            <PageHeader
                                hidden={pageHeader.hidden}
                                title={pageHeader.title}
                                breadcrumb={pageHeader.breadcrumb}
                            />
                            :
                            null
                    }
                    {children}
                </div>
            </div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.setting,
        ...state.utils,
    };
}
