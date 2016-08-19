import React, {Component} from 'react';
import {Checkbox} from 'antd';
import './style.less';

export class LayoutComponent extends Component {
    handlePageWitchAnimationChange = (e) => {
        const {actions} = this.props;
        const usePageWitchAnimation = e.target.checked;

        actions.setSeting({usePageWitchAnimation});
    }

    handleFixedPageHeaderChange = (e) => {
        const {actions} = this.props;
        const pageHeaderFixed = e.target.checked;

        actions.setSeting({pageHeaderFixed});

        // 页面头部背景添加动画效果，提示用户改变的部分
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fffdcb';
        }, 0);
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fff';
        }, 1300);
    }

    render() {
        const {usePageWitchAnimation, pageHeaderFixed} = this.props;
        return (
            <div className="system-setting">
                <label>
                    <Checkbox
                        checked={usePageWitchAnimation}
                        onChange={this.handlePageWitchAnimationChange}
                    />
                    <span className="check-box-label">启用页面过场动画</span>
                </label>

                <label>
                    <Checkbox
                        checked={pageHeaderFixed}
                        onChange={this.handleFixedPageHeaderChange}
                    />
                    <span className="check-box-label">页面头部固定</span>
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
