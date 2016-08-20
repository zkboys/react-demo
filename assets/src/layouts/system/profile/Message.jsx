import React, {Component} from 'react';
import {Form, Input, Radio, Icon, Button} from 'antd';
import ValidationRule from '../../../services/validation-rule';
import './style.less';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export class Message extends Component {
    static defaultProps = {
        loading: false,
    };

    static propTypes = {
        loading: React.PropTypes.bool,
        user: React.PropTypes.shape({
            _id: React.PropTypes.string,
            name: React.PropTypes.string,
            email: React.PropTypes.string,
            mobile: React.PropTypes.string,
            gender: React.PropTypes.string,
        }),
        form: React.PropTypes.object,
        actions: React.PropTypes.object,
    };

    handleReset = (e) => {
        e.preventDefault();
        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        const {loading, form, actions} = this.props;
        if (loading) {
            return;
        }
        e.preventDefault();
        form.validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }

            actions.saveUserMessage(values, () => {
                actions.updateCurrentUser(values);
            });
        });
    }

    render() {
        const {user, loading, form: {getFieldProps}} = this.props;
        const idProps = getFieldProps('_id', {initialValue: user._id});
        const nameProps = getFieldProps('name', {initialValue: user.name});
        const emailProps = getFieldProps('email', {
            initialValue: user.email,
            rules: [
                ValidationRule.email(),
            ],
        });
        const mobileProps = getFieldProps('mobile', {
            initialValue: user.mobile,
            rules: [
                ValidationRule.mobile(),
            ],
        });
        const genderProps = getFieldProps('gender', {
            initialValue: user.gender,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 12},
        };

        return (
            <div className="organization-org">
                <Form horizontal>
                    <FormItem
                        {...formItemLayout}
                        label="用户id："
                        style={{display: 'none'}}
                        hasFeedback
                    >
                        <Input
                            {...idProps}
                            placeholder="请输入登录名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户名："
                        hasFeedback
                    >
                        <Input
                            {...nameProps}
                            placeholder="请输入用户名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="邮箱："
                        hasFeedback
                    >
                        <Input
                            {...emailProps}
                            placeholder="请输入邮箱"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="电话："
                        hasFeedback
                    >
                        <Input
                            {...mobileProps}
                            placeholder="请输入电话"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别：">
                        <RadioGroup {...genderProps}>
                            <Radio value="male">男</Radio>
                            <Radio value="female">女</Radio>
                        </RadioGroup>
                        <span><Icon type="info-circle-o"/> 暂不支持其它性别</span>
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="ghost" style={{marginRight: 8}} onClick={this.handleReset}>重置</Button>
                        <Button type="primary" loading={loading} onClick={this.handleSubmit}>确定</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export const LayoutComponent = createForm()(Message);
export function mapStateToProps(state) {
    return {
        ...state.app,
        ...state.profileMessage,
    };
}
