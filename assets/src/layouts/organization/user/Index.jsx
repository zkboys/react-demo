import React, {Component} from 'react';

export class LayoutComponent extends Component {
    state = {};

    static defaultProps = {
        loading: false,
    };

    static propTypes = {};

    render() {
        return (
            <div>
                <p>{this.props.test}</p>
                <button onClick={this.props.actions.testDemo}>测试action</button>
                <button onClick={this.props.actions.getMenus}>获取菜单</button>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.demo,
        ...state.menu,
    };
}
