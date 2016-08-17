import React, {Component} from 'react';
import {Button} from 'antd';
import {Link} from 'react-router';
import error404 from './404.png';
import './style.less';

export class LayoutComponent extends Component {
    componentWillMount() {
        const {actions} = this.props;
        actions.setPageHeaderStatus({
            hidden: true,
        });
    }

    render() {
        return (
            <div className="error-404">
                <img src={error404} alt="404图片"/>
                <p className="error-text">您访问的页面不存在...</p>
                <Button
                    type="primary"
                    className="error-btn"
                    onClick={this.props.history.goBack}
                >
                    返回上一级
                </Button>
                <Button
                    type="primary"
                    className="error-btn error-btn-right"
                >
                    <Link to="/">返回首页</Link>
                </Button>
            </div>
        );
    }
}

export function mapStateToProps() {
    return {};
}
