import React, {Component} from 'react';
import {Breadcrumb} from 'antd';
import {Link} from 'react-router';
import './style.less';
import FAIcon from '../faicon/FAIcon';

class PageHeader extends Component {
    static defaultProps = {
        title: '',
        breadcrumb: [],
    }
    static propsType = {
        title: React.PropTypes.string,
        breadcrumb: React.PropTypes.array,
    }

    renderBreadcrumb = () => {
        const {breadcrumb} = this.props;
        if (breadcrumb && breadcrumb.length) {
            const home = (
                <Breadcrumb.Item key="home">
                    <Link to="/">
                        <span>
                            <FAIcon className="breadcrumb-icon" type="fa-home"/>
                            <span className="breadcrumb-text">首页</span>
                        </span>
                    </Link>
                </Breadcrumb.Item>
            );

            let breadcrumbJsx = breadcrumb.map((bread, index) => {
                let itemContent = (
                    <span>
                        <FAIcon className="breadcrumb-icon" type={bread.icon}/>
                        <span className="breadcrumb-text">{bread.text}</span>
                    </span>
                );
                if (bread.path) {
                    itemContent = (
                        <Link to={bread.path}>
                            {itemContent}
                        </Link>
                    );
                }
                return (
                    <Breadcrumb.Item key={index}>
                        {itemContent}
                    </Breadcrumb.Item>
                );
            });

            breadcrumbJsx.unshift(home);

            return breadcrumbJsx;
        }
        return '';
    }

    render() {
        const {title} = this.props;
        return (
            <div className="page-header">
                <h2 className="header-title">{title}</h2>
                <Breadcrumb>
                    {this.renderBreadcrumb()}
                </Breadcrumb>
            </div>
        );
    }
}
export default PageHeader;
