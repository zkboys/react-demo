import React, {Component} from 'react';
import './home.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

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
