import React, {Component} from 'react';
import {Radio, Form, Switch} from 'antd';
import './style.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export class LayoutComponent extends Component {

    handleFixedPageHeaderChange = (checked) => {
        const {actions} = this.props;

        actions.setSettings({pageHeaderFixed: checked});

        // 页面头部背景添加动画效果，提示用户改变的部分
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fffdcb';
        }, 0);
        setTimeout(() => {
            document.querySelector('.page-header').style.backgroundColor = '#fff';
        }, 1300);
    }

    handlePageAnimationTypeChange = (e) => {
        const {actions} = this.props;
        const pageAnimationType = e.target.value;
        if (pageAnimationType === 'random') {
            actions.setSettings({randomPageAnimation: true});
        } else {
            actions.setSettings({pageAnimationType, randomPageAnimation: false});
        }
    }

    render() {
        let {
            usePageWitchAnimation,
            pageHeaderFixed,
            pageAnimationType,
            randomPageAnimation,
        } = this.props;

        if (randomPageAnimation) {
            pageAnimationType = 'random';
        }

        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 14},
        };

        return (
            <div className="system-setting">
                <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label="固定页面头部："
                    >
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            checked={pageHeaderFixed}
                            onChange={this.handleFixedPageHeaderChange}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="页面过场动画："
                    >
                        <Switch
                            checkedChildren="开"
                            unCheckedChildren="关"
                            checked={usePageWitchAnimation}
                            onChange={checked => this.props.actions.setSettings({usePageWitchAnimation: checked})}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="页面过场动画类型："
                    >
                        <RadioGroup onChange={this.handlePageAnimationTypeChange} value={pageAnimationType}>
                            <Radio key="none" value="none">无</Radio>
                            <Radio key="random" value="random">随机</Radio>
                            <Radio key="fade" value="fade">淡入淡出</Radio>
                            <Radio key="up" value="up">上侧出入场</Radio>
                            <Radio key="down" value="down">下侧出入场</Radio>
                            <Radio key="left" value="left">左侧出入场</Radio>
                            <Radio key="right" value="right">右侧出入场</Radio>
                        </RadioGroup>
                    </FormItem>

                </Form>
            </div>
        );
    }
}
export function mapStateToProps(state) {
    return {
        ...state.setting,
    };
}
