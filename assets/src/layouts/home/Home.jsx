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
        // 由于 Router会自动设置一次header，这里将自定义设置推迟到下一个时钟周期
        setTimeout(() => {
            actions.setPageHeaderStatus({
                hidden: true,
            });
        }, 0);
    }

    render() {
        return (
            <div>首页内容有待于填充</div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
