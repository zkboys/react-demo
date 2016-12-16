import React, {Component, PropTypes} from 'react';
import {Form, Input, Switch, Icon, Select, Row, Col, TreeSelect, Radio, Button, Modal} from 'antd';
import './style.less';
import ValidationRule from '../../../services/validation-rule';

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class UserEdit extends Component {

    static defaultProps = {
        savingOrUpdatingUser: false,
        showUserEditModal: false,
        editModalTitle: '',
        user: {
            name: '',
            loginname: '',
            email: '',
            mobile: '',
            gender: '',
            position: '',
            role_id: '',
            org_key: '',
            is_locked: false,
        },
        organizations: [],
        roles: [],
    };

    static propTypes = {
        showUserEditModal: PropTypes.bool,
        savingOrUpdatingUser: PropTypes.bool,
        editModalTitle: PropTypes.string,
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            loginname: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            mobile: PropTypes.string.isRequired,
            gender: PropTypes.string.isRequired,
            position: PropTypes.string.isRequired,
            role_id: PropTypes.string.isRequired,
            org_key: PropTypes.string.isRequired,
            is_locked: PropTypes.bool.isRequired,
        }),
        organizations: PropTypes.array,
        roles: PropTypes.array,
    };

    handleModalCancel = () => {
        const {actions} = this.props;
        actions.hideUserEditModal();
    }

    handleReset = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {savingUser, form: {validateFieldsAndScroll}, actions, user} = this.props;

        if (savingUser) return;

        const fields = [
            'name',
            'loginname',
            'email',
            'mobile',
            'gender',
            'position',
            'org_key',
            'role_id',
            'is_locked',
        ];
        validateFieldsAndScroll(fields, (errors, values) => {
            if (errors) {
                return;
            }
            let id = user && user._id;
            if (id) {
                values._id = id;
                actions.updateUser(values, () => {
                    actions.hideUserEditModal();
                    this.handleReset();
                });
                return;
            }
            actions.addUser(values, () => {
                actions.hideUserEditModal();
                this.handleReset();
            });
        });
    }

    render() {
        const {form: {getFieldDecorator}, user, savingOrUpdatingUser, showUserEditModal, editModalTitle, organizationsTreeData, roles} = this.props;
        let ignoreValues = [];

        if (user._id) { // _id 存在，修改操作。
            ignoreValues.push(user.loginname);
        }

        const nameDecorator = getFieldDecorator('name', {initialValue: user.name});
        const loginNameDecorator = getFieldDecorator('loginname', {
            initialValue: user.loginname,
            rules: [
                ValidationRule.required('登录名'),
                ValidationRule.loginName(),
                ValidationRule.checkLoginNameExist(ignoreValues),
            ],
        });
        const emailDecorator = getFieldDecorator('email', {
            initialValue: user.email,
            rules: [
                ValidationRule.email(),
            ],
        });
        const mobileDecorator = getFieldDecorator('mobile', {
            initialValue: user.mobile,
            rules: [
                ValidationRule.mobile(),
            ],
        });
        const genderDecorator = getFieldDecorator('gender', {
            initialValue: user.gender,
            rules: [],
        });
        const positionDecorator = getFieldDecorator('position', {
            initialValue: user.position,
            rules: [],
        });
        const roleDecorator = getFieldDecorator('role_id', {
            initialValue: user.role_id,
            rules: [
                ValidationRule.required('角色'),
            ],
        });
        const orgDecorator = getFieldDecorator('org_key', {
            initialValue: user.org_key,
            rules: [],
        });
        const isLockedDecorator = getFieldDecorator('is_locked', {
            valuePropName: 'checked',
            initialValue: user.is_locked,
            rules: [],
        });
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        };
        return (
            <Modal
                title={editModalTitle}
                visible={showUserEditModal}
                footer=""
                onCancel={this.handleModalCancel}
            >
                <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                label="登录名："
                                hasFeedback
                            >
                                {loginNameDecorator(
                                    <Input placeholder="请输入登录名"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 6}}
                                wrapperCol={{span: 14}}
                                label="用户名："
                                hasFeedback
                            >
                                {nameDecorator(
                                    <Input placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 8}}
                                wrapperCol={{span: 16}}
                                label="邮箱："
                                hasFeedback
                            >
                                {emailDecorator(
                                    <Input placeholder="请输入邮箱"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                labelCol={{span: 6}}
                                wrapperCol={{span: 14}}
                                label="电话："
                                hasFeedback
                            >
                                {mobileDecorator(
                                    <Input placeholder="请输入电话"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        {...formItemLayout}
                        label="性别：">
                        {genderDecorator(
                            <RadioGroup>
                                <Radio value="male">男</Radio>
                                <Radio value="female">女</Radio>
                            </RadioGroup>
                        )}
                        <span><Icon type="info-circle-o"/> 暂不支持其它性别</span>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属部门：">
                        {orgDecorator(
                            <TreeSelect
                                dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                placeholder="请选择部门"
                                allowClear
                                treeDefaultExpandAll
                                treeData={organizationsTreeData}
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位：">
                        {positionDecorator(
                            <Input placeholder="请输入职位"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="角色：">
                        {roleDecorator(
                            <Select
                                showSearch
                                optionFilterProp="children"
                                notFoundContent="无法找到"
                                placeholder="请选择角色"
                            >
                                {roles.map(r => {
                                    return (
                                        <Option key={r._id} value={r._id}>{r.name}</Option>
                                    );
                                })}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="锁定：">
                        {isLockedDecorator(
                            <Switch
                                checkedChildren="是"
                                unCheckedChildren="否"
                            />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                        <Button type="primary" loading={savingOrUpdatingUser} htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export const LayoutComponent = Form.create()(UserEdit);
export function mapStateToProps(state) {
    return {
        ...state.organizationUser,
        ...state.organizationRole,
        ...state.organization,
    };
}
