import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class MenuEdit extends Component {

    static defaultProps = {
        menusTreeData: [],
        menu: {
            key: '',
            text: '',
            icon: '',
            path: '',
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
            wrapperCol: {span: 12},
        },
    }

    static propTypes = {}

    componentWillReceiveProps(nextProps) {
        // 为了使撤销，tree和from能够同步
        const currentMenu = this.props.menu;
        const nextMenu = nextProps.menu;
        const {setFieldsValue} = this.props.form;
        const valueKeys = ['key', 'text', 'path', 'icon'];
        valueKeys.forEach(vk => {
            if (currentMenu[vk] !== nextMenu[vk]) {
                setFieldsValue({
                    [vk]: nextMenu[vk],
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
    findNodeByKey = (data, key, callback) => {
        data.forEach((item, index, arr) => {
            if (item.key === key) {
                return callback(item, index, arr);
            }
            if (item.children) {
                return this.findNodeByKey(item.children, key, callback);
            }
        });
    };
    nodeExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            const data = [...this.props.menusTreeData];
            let isFind = false;
            this.findNodeByKey(data, value, () => {
                isFind = true;
            });
            if (isFind && value !== this.props.menu.key) {
                callback([new Error('抱歉，该key已被占用。')]);
            } else {
                callback();
            }
        }
    };

    render() {
        let {form: {getFieldProps}, menu, showButtons, formItemLayout} = this.props;

        const keyProps = getFieldProps('key', {
            initialValue: menu.key,
            rules: [
                {required: true, message: 'key 不能为空！'},
                {validator: this.nodeExists},
            ],
            onChange: this.handleChange,
        });

        const textProps = getFieldProps('text', {
            initialValue: menu.text,
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
            onChange: this.handleChange,
        });
        const pathProps = getFieldProps('path', {
            initialValue: menu.path,
            onChange: this.handleChange,
        });
        const iconProps = getFieldProps('icon', {
            initialValue: menu.icon,
            onChange: this.handleChange,
        });
        return (
            <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <FormItem
                    {...formItemLayout}
                    label="key："
                    hasFeedback
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
                    label="路径："
                    hasFeedback>
                    <Input
                        {...pathProps}
                        placeholder="请输入url"
                    />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="图标："
                    hasFeedback>
                    <Input
                        {...iconProps}
                        placeholder="请输入图标"
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

export default createForm()(MenuEdit);
