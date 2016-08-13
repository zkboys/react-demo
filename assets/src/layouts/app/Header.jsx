import React, {Component} from 'react';
import {Menu, Popconfirm} from 'antd';
import {Link} from 'react-router';
import FAIcon from '../../components/faicon/FAIcon';
import UserAvatar from '../../components/UserAvatar';


class Header extends Component {
    static defaultProps = {
        menus: [],
        collapsed: false,
        user: {
            name: '未登录',
        },
        toggleSideBar() {
        },
        exit() {
        },
    }

    static propsType = {
        menus: React.PropTypes.array,
        collapsed: React.PropTypes.bool,
        user: React.PropTypes.object,
        toggleSideBar: React.PropTypes.func,
        exit: React.PropTypes.func,
    }

    handleExit = () => {
        this.props.exit();
    }
    renderMenus = () => {
        return this.props.menus.map((menu) => {
            return (
                <Menu.Item key={menu.key}>
                    <Link to={menu.path}>
                        <FAIcon type={menu.icon}/><span>{menu.text}</span>
                    </Link>
                </Menu.Item>
            );
        });
    }

    render() {
        const {collapsed, toggleSideBar, user, current} = this.props;
        const handleExit = this.handleExit;
        const logoClass = collapsed ? 'collapsed' : '';
        const logo = collapsed ? 'super' : '人员管理系统';
        return (
            <div className="app-header">
                <div className={`logo ${logoClass}`}>
                    <Link to="/">
                        {logo}
                    </Link>
                </div>
                <a className="app-sidebar-toggle" onClick={toggleSideBar}><FAIcon type="fa-bars"/></a>
                <div className="navigation">
                    <Menu
                        selectedKeys={[current]}
                        mode="horizontal"
                    >
                        {this.renderMenus()}
                    </Menu>
                </div>
                <ul className="menu">
                    <li>
                        <Link to="/system/profile/message">
                            <UserAvatar className="user-avatar" user={user}/>
                            <span>{user.name}</span>
                        </Link>
                    </li>
                    <li>
                        <Popconfirm placement="bottomRight" title="您确定要退出系统吗？" onConfirm={handleExit}>
                            <a>
                                <FAIcon type="fa-sign-out"/>
                                <span>退出系统</span>
                            </a>
                        </Popconfirm>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;

