import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class MenuFunctionFrom extends Component {

    static defaultProps = {
        fun: {
            key: '',
            name: '',
            description: '',
        },
        onSubmit() {
        },
    }

    static propTypes = {}

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
    functionExists = (rule, value, callback) => {
        const data = this.props.menusTreeData;
        let isFind = false;
        let loop = (d) => {
            for (let v of d) {
                if (v.key === value) {
                    isFind = true;
                    return;
                }
                if (v.functions && v.functions.length) {
                    for (let f of v.functions) {
                        if (f.key === value) {
                            isFind = true;
                            return;
                        }
                    }
                }
                if (v.children && v.children.length) {
                    loop(v.children);
                }
            }
        };
        loop(data);

        if (isFind) {
            callback([new Error('抱歉，该key已被占用。')]);
        } else {
            callback();
        }
    };

    render() {
        const {form: {getFieldDecorator}, fun} = this.props;

        const keyDecorator = getFieldDecorator('key', {
            initialValue: fun.key,
            rules: [
                {required: true, message: 'key 不能为空！'},
                {validator: this.functionExists},
            ],
        });

        const nameDecorator = getFieldDecorator('name', {
            initialValue: fun.name,
            rules: [
                {required: true, message: '名称 不能为空！'},
            ],
        });
        const descriptionDecorator = getFieldDecorator('description', {
            initialValue: fun.description,
            onChange: this.handleChange,
        });
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
            <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <FormItem
                    {...formItemLayout}
                    label="key："
                    hasFeedback
                >
                    {keyDecorator(
                        <Input placeholder="唯一不可重复。"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称："
                    hasFeedback
                >
                    {nameDecorator(
                        <Input placeholder="请输入组织名称"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="描述："
                    hasFeedback>
                    {descriptionDecorator(
                        <Input placeholder="请输入描述"/>
                    )}
                </FormItem>
                <FormItem wrapperCol={{span: 19, offset: 5}}>
                    <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                    <Button type="primary" htmlType="submit">确定</Button>
                </FormItem>
            </Form>
        );
    }
}

export default createForm()(MenuFunctionFrom);
