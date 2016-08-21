import React, {Component} from 'react';
import './style.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    componentWillMount() {
        const {actions} = this.props;
        actions.setPageHeaderStatus({
            hidden: true,
            title: '组织架构-自定义title',
        });
    }

    render() {
        return (
            <div className="organization-org">
                <div style={{height: 1000}}>我是组织建构管理页面</div>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.app,
    };
}
