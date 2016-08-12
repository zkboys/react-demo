import React, {Component} from 'react';
import {Link} from 'react-router';

class Index extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        return (
            <div>
                <Link to="/" activeClassName="active" onlyActiveOnIndex>
                    Home |
                </Link>
                <Link to="/demo" activeClassName="active" onlyActiveOnIndex>
                    demo |
                </Link>
                <Link to="/demo2" activeClassName="active" onlyActiveOnIndex>
                    demo2
                </Link>
                {this.props.children}
            </div>
        );
    }
}
export const LayoutComponent = Index;

export function mapStateToProps(state) {
    return {
        ...state,
    };
}
