import React, {Component} from 'react';
import {Checkbox} from 'antd';
import './style.less';

export class LayoutComponent extends Component {
    handlePageWitchAnimationChange = (e) => {
        const {actions} = this.props;
        const usePageWitchAnimation = e.target.checked;
        actions.setSeting({usePageWitchAnimation});
    }

    render() {
        const {usePageWitchAnimation} = this.props;
        return (
            <div className="system-setting">
                <label>
                    <Checkbox
                        defaultChecked={usePageWitchAnimation}
                        onChange={this.handlePageWitchAnimationChange}
                    />
                    <span className="check-box-label">启用页面过场动画</span>
                </label>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.setting,
    };
}
