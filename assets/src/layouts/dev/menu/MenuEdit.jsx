import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import {findNodeByKey} from '../../../utils';

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

    nodeExists = (rule, value, callback) => {
        if (!value) {
            callback();
        } else {
            const data = [...this.props.menusTreeData];
            let isFind = false;
            findNodeByKey(data, value, () => {
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
        let {form: {getFieldDecorator}, menu, showButtons, formItemLayout} = this.props;

        const keyDecorator = getFieldDecorator('key', {
            initialValue: menu.key,
            rules: [
                {required: true, message: 'key 不能为空！'},
                {validator: this.nodeExists},
            ],
            onChange: this.handleChange,
        });

        const textDecorator = getFieldDecorator('text', {
            initialValue: menu.text,
            rules: [
                {required: true, min: 2, message: '标题至少为 2 个字符'},
            ],
            onChange: this.handleChange,
        });
        const pathDecorator = getFieldDecorator('path', {
            initialValue: menu.path,
            onChange: this.handleChange,
        });
        const iconDecorator = getFieldDecorator('icon', {
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
                    {keyDecorator(
                        <Input placeholder="唯一不可重复。"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称："
                    hasFeedback
                >
                    {textDecorator(
                        <Input placeholder="请输入组织名称"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="路径："
                    hasFeedback>
                    {pathDecorator(
                        <Input placeholder="请输入url"/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="图标："
                    hasFeedback>
                    {iconDecorator(
                        <Input placeholder="请输入图标"/>
                    )}
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
