import React, {Component} from 'react';
import './style.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        return (
            <div className="organization-user">
                <div style={{height: 1000}}>我是人员管理页面</div>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.app,
    };
}
