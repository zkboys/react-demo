import React, {Component} from 'react';
import './demo.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        return (
            <div>我是demo</div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state,
    };
}
