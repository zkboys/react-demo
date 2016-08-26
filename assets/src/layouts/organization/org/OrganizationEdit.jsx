import React, {Component} from 'react';
import {Form, Input} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class OrganizationEdit extends Component {

    static defaultProps = {}
    static propTypes = {}

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                return;
            }
            console.log(values);
        });
    };

    render() {
        const {getFieldProps} = this.props.form;

        const keyProps = getFieldProps('key', {
            rules: [
                {required: true, message: 'key 不能为空！'},
            ],
        });

        const textProps = getFieldProps('text', {
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
        });
        const descriptionProps = getFieldProps('description');
        const remarkProps = getFieldProps('remark');
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 10},
        };
        return (
            <Form horizontal>
                <FormItem
                    {...formItemLayout}
                    label="key："
                    hasFeedback
                    style={{display: 'none'}}
                >
                    <Input
                        {...keyProps}
                        onChange={(e) => {
                            keyProps.onChange(e);
                            this.handleSubmit(e);
                        }}
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
                        onChange={(e) => {
                            textProps.onChange(e);
                            this.handleSubmit(e);
                        }}
                        placeholder="请输入组织名称"
                    />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="描述："
                    hasFeedback>
                    <Input
                        {...descriptionProps}
                        onChange={(e) => {
                            descriptionProps.onChange(e);
                            this.handleSubmit(e);
                        }}
                        placeholder="请输入组织描述"
                    />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="备注："
                    hasFeedback>
                    <Input
                        {...remarkProps}
                        onChange={(e) => {
                            remarkProps.onChange(e);
                            this.handleSubmit(e);
                        }}
                        placeholder="请输入备注"
                    />
                </FormItem>
            </Form>
        );
    }
}

export default createForm()(OrganizationEdit);
