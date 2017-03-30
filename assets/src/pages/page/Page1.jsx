import React, {Component} from 'react';
import './style.less';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    componentWillMount() {
    }

    render() {
        return (
            <div className="demo-page">我是Page1</div>
        );
    }
}

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
