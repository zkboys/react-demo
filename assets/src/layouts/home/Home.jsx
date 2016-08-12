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
            <div>Home</div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
