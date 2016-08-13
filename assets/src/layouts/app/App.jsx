import 'antd/dist/antd.css';
import React, {Component} from 'react';
import './style.less';
import NavBar from './SideBar';
import Header from './Header';

class Index extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    componentDidMount() {
        const {actions} = this.props;
        actions.getMenus();
        actions.getUser();
        actions.getStateFromStorage();
    }

    render() {
        const isSidebarCollapsed = this.props.isSidebarCollapsed;
        const collapsedClass = isSidebarCollapsed ? 'collapsed' : '';
        const sideBarHidden = this.props.sideBarHidden;
        const contentClass = sideBarHidden ? 'full' : '';
        return (
            <div>
                <Header
                    collapsed={isSidebarCollapsed}
                    exit={this.props.actions.logout}
                    menus={this.props.headerMenus}
                    user={this.props.user}
                    toggleSideBar={this.props.actions.toggleSideBar}
                />
                <NavBar
                    menus={this.props.sideBarMenus}
                    collapsed={isSidebarCollapsed}
                    openKeys={this.props.openKeys}
                    selectedKeys={this.props.selectedKeys}
                    hidden={sideBarHidden}
                />
                <div className={`app-content ${collapsedClass} ${contentClass}`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
export const LayoutComponent = Index;

export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.setting,
    };
}
