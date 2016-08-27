import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class OrganizationEdit extends Component {

    static defaultProps = {
        organization: {
            key: '',
            text: '',
            remark: '',
        },
        showButtons: false,
        onSubmit() {
        },
        onChange() {
        },
        onReset() {
        },
        formItemLayout: {
            labelCol: {span: 4},
            wrapperCol: {span: 10},
        },
    }

    static propTypes = {}

    componentWillReceiveProps(nextProps) {
        // 为了使撤销，tree和from能够同步
        const currentOrg = this.props.organization;
        const nextOrg = nextProps.organization;
        const {setFieldsValue} = this.props.form;
        const valueKeys = ['key', 'text', 'description', 'remark'];
        valueKeys.forEach(vk => {
            if (currentOrg[vk] !== nextOrg[vk]) {
                setFieldsValue({
                    [vk]: nextOrg[vk],
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {onSubmit, form: {validateFields}} = this.props;
        validateFields((errors, values) => {
            if (errors) {
                return;
            }
            if (onSubmit) {
                onSubmit(values);
            }
            this.handleReset();
        });
    };

    handleReset = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.props.form.resetFields();
    }
    handleChange = () => {
        const {onChange, form: {validateFields}} = this.props;
        if (onChange) {
            setTimeout(() => {
                validateFields((errors, values) => {
                    if (errors) {
                        return;
                    }
                    if (onChange) {
                        onChange(values);
                    }
                });
            }, 0);
        }
    }

    render() {
        let {form: {getFieldProps}, organization, showButtons, formItemLayout} = this.props;

        const keyProps = getFieldProps('key', {
            initialValue: organization.key,
            rules: [
                {required: true, message: 'key 不能为空！'},
            ],
            onChange: this.handleChange,
        });

        const textProps = getFieldProps('text', {
            initialValue: organization.text,
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
            onChange: this.handleChange,
        });
        const descriptionProps = getFieldProps('description', {
            initialValue: organization.description,
            onChange: this.handleChange,
        });
        const remarkProps = getFieldProps('remark', {
            initialValue: organization.remark,
            onChange: this.handleChange,
        });
        return (
            <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <FormItem
                    {...formItemLayout}
                    label="key："
                    hasFeedback
                    style={{display: 'none'}}
                >
                    <Input
                        {...keyProps}
                        placeholder="唯一不可重复。"
                    />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称："
                    hasFeedback
                >
                    <Input
                        {...textProps}
                        placeholder="请输入组织名称"
                    />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="描述："
                    hasFeedback>
                    <Input
                        {...descriptionProps}
                        placeholder="请输入组织描述"
                    />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="备注："
                    hasFeedback>
                    <Input
                        {...remarkProps}
                        placeholder="请输入备注"
                    />
                </FormItem>
                {
                    showButtons ?
                        <FormItem wrapperCol={{offset: formItemLayout.labelCol.span}}>
                            <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                            <Button type="primary" htmlType="submit">确定</Button>
                        </FormItem>
                        :
                        null
                }

            </Form>
        );
    }
}

export default createForm()(OrganizationEdit);
