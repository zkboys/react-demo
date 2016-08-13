import React, {Component} from 'react';
import {Menu} from 'antd';
import {Link} from 'react-router';
import {getScrollBarWidth} from '../../utils/index';
import FAIcon from '../../components/faicon/FAIcon';

const SubMenu = Menu.SubMenu;

class NavBar extends Component {
    state = {
        current: '1',
        openKeys: [],
    };

    static defaultProps = {
        menus: [],
        collapsed: false,
        openKeys: [],
        selectedKeys: '',
        hidden: false,
    }
    static propsType = {
        menus: React.PropTypes.array,
        collapsed: React.PropTypes.boolean,
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
            openKeys: e.keyPath.slice(1),
        });
    }

    onToggle = (info) => {
        this.setState({
            openKeys: info.open ? info.keyPath : info.keyPath.slice(1),
        });
    }

    getMenuJsx = (node) => {
        const min = this.props.collapsed; // TODO 设置中获取
        const key = node.key;
        const path = node.path;
        const icon = node.icon;
        const text = node.text;
        if (node.children) {
            return (
                <SubMenu key={key} title={<span><FAIcon type={icon}/><span>{text}</span></span>}>
                    {node.children.map(this.getMenuJsx)}
                </SubMenu>
            );
        }
        let item = (
            <Link to={path} activeClassName="active">
                <FAIcon
                    type={icon}
                />
                <span>{text}</span>
            </Link>
        );
        if (min && node.parentKeys.length === 1) { // FIXME 这个判断有些不好。
            item = (
                <Link to={path} activeClassName="active">
                    <FAIcon
                        type={icon}
                    />
                    <span>{text}</span>
                </Link>
            );
        }
        return (
            <Menu.Item key={key}>
                {item}
            </Menu.Item>
        );
    }

    renderMenus = () => {
        return this.props.menus.map(this.getMenuJsx);
    }

    render() {
        // TODO 展开收起计算大小
        const collapsed = this.props.collapsed;
        const width = collapsed ? 60 : 200;
        const innerWidth = collapsed ? 60 : width + getScrollBarWidth();
        let collapsedClass = collapsed ? 'collapsed' : '';
        const sidebarMode = collapsed ? 'vertical' : 'inline';
        const openKeys = this.props.openKeys;
        const selectedKeys = this.props.selectedKeys;
        const hidden = this.props.hidden;
        if (hidden) {
            collapsedClass += ' hidden';
        }
        return (
            <div className={`app-sidebar ${collapsedClass}`} style={{width}}>
                <div className={`app-sidebar-inner ${collapsedClass}`} style={{width: innerWidth}}>
                    {/* 不同模式的菜单要区分开写，否则互相干扰 */}
                    <Menu
                        style={{display: sidebarMode === 'inline' && !hidden ? 'block' : 'none'}}
                        openKeys={openKeys}
                        selectedKeys={[selectedKeys]}
                        onOpen={this.onToggle}
                        onClose={this.onToggle}
                        mode={sidebarMode}
                    >
                        {this.renderMenus()}
                    </Menu>
                    <Menu
                        style={{display: sidebarMode === 'vertical' && !hidden ? 'block' : 'none'}}
                        selectedKeys={[selectedKeys]}
                        mode={sidebarMode}
                    >
                        {this.renderMenus()}
                    </Menu>


                </div>
            </div>
        );
    }
}

export default NavBar;
