import 'antd/dist/antd.css';
import React, {Component} from 'react';
import './style.less';
import NavBar from './SideBar';
import Header from './Header';
import PageHeader from '../../components/page-header/PageHeader';

export class LayoutComponent extends Component {
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
                    pageHeaderFixed ?
                        <PageHeader
                            className={`fixed ${collapsedClass} ${fullClass} ${pageStatus}`}
                            hidden={pageHeader.hidden}
                            title={pageHeader.title}
                            breadcrumb={pageHeader.breadcrumb}
                        />
                        :
                        null
                }

                <div className={`app-content ${collapsedClass} ${fullClass} ${pageStatus} ${pageHeaderFixedClass} ${pageHeaderHiddenClass}`}>
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
    };
}
