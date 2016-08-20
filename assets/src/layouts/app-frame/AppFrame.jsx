import 'antd/dist/antd.css';
import React, {Component} from 'react';
import {message} from 'antd';
import './style.less';
import NavBar from './SideBar';
import Header from './Header';
import PageHeader from '../../components/page-header/PageHeader';

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

        const collapsedClass = isSidebarCollapsed ? 'collapsed' : '';
        const fullClass = sideBarHidden ? 'full' : '';
        const pageHeaderFixedClass = pageHeaderFixed ? 'page-header-fixed' : '';
        const pageHeaderHiddenClass = pageHeader.hidden ? 'page-header-hidden' : '';

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
                <NavBar
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
                            className={`fixed ${collapsedClass} ${fullClass} ${pageStatus} ${pageAnimationType}`}
                            hidden={pageHeader.hidden}
                            title={pageHeader.title}
                            breadcrumb={pageHeader.breadcrumb}
                        />
                        :
                        null
                }

                <div className={`app-content ${collapsedClass} ${fullClass} ${pageStatus} ${pageHeaderFixedClass} ${pageHeaderHiddenClass} ${pageAnimationType}`}>
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
