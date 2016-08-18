import React, {Component} from 'react';
import './style.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    static contextTypes = {
        router: React.PropTypes.object,
    };

    componentWillMount() {
        const {actions} = this.props;
        actions.setPageHeaderStatus({
            hidden: true,
            title: '组织架构-自定义title',
        });
    }

    componentDidMount() {
        const {route} = this.props;
        const {router} = this.context; // If contextTypes is not defined, then context will be an empty object.

        router.setRouteLeaveHook(route, (/* nextLocation */) => {
            // 返回 false 会继续停留当前页面，
            // 否则，返回一个字符串，会显示给用户，让其自己决定
            return '您有未保存的内容，确认要离开？';
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
