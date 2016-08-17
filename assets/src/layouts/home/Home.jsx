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
        });
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
