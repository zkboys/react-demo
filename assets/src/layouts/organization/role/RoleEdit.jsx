import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Modal, Tree} from 'antd';
import FAIcon from '../../../components/faicon/FAIcon';
import './style.less';
import ValidationRule from '../../../services/validation-rule';
import {findNodeByKey} from '../../../utils';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const systemMenuKey = 'system';

class RoleEdit extends Component {

    static defaultProps = {
        savingOrUpdatingRole: false,
        showRoleEditModal: false,
        editModalTitle: '',
        permissionTreeData: [],
        role: {
            name: '',
            description: '',
            permissions: [],
        },
        formItemLayout: {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        },
    };

    static propTypes = {
        showRoleEditModal: PropTypes.bool,
        savingOrUpdatingRole: PropTypes.bool,
        editModalTitle: PropTypes.string,
        permissionTreeData: PropTypes.array,
        role: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
            permissions: PropTypes.array,
        }),
    };

    handleModalCancel = () => {
        const {actions} = this.props;
        actions.hideRoleEditModal();
    }

    handleReset = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.props.form.resetFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            savingRole,
            form: {validateFieldsAndScroll},
            actions,
            role,
            permissionTreeData,
        } = this.props;

        if (savingRole) return;

        const fields = [
            'name',
            'description',
            'permissions',
        ];
        validateFieldsAndScroll(fields, (errors, values) => {
            if (errors) {
                return;
            }
            let id = role && role._id;
            if (id) {
                values._id = id;
                actions.updateRole(values, () => {
                    actions.hideRoleEditModal();
                    this.handleReset();
                });
                return;
            }
            let permissions = new Set();
            values.permissions.forEach(p => {
                permissions.add(p);
                findNodeByKey(permissionTreeData, p, node => {
                    if (node && node.parentKeys) {
                        node.parentKeys.forEach(k => permissions.add(k));
                    }
                });
            });
            values.permissions = Array.from(permissions);
            actions.addRole(values, () => {
                actions.hideRoleEditModal();
                this.handleReset();
            });
        });
    }
    onCheck = (info, e) => {
        const {form: {setFieldsValue}} = this.props;
        const checkedNodes = e.checkedNodes;
        let permissions = new Set();
        if (checkedNodes && checkedNodes.length) {
            checkedNodes.forEach(checkNode => {
                const key = checkNode.key;
                permissions.add(key);
            });
        }
        setFieldsValue({
            permissions: Array.from(permissions),
        });
    };
    renderTreeNode = data => data.map((item) => {
        let disable = {};
        if (item.key === systemMenuKey || (item.parentKeys && item.parentKeys.indexOf(systemMenuKey) > -1)) {
            disable.disableCheckbox = true;
        }
        if (item.children && item.children.length) {
            return (
                <TreeNode
                    {...disable}
                    key={item.key}
                    title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                >
                    {this.renderTreeNode(item.children)}
                </TreeNode>
            );
        }
        return (
            <TreeNode
                {...disable}
                key={item.key}
                title={<span><FAIcon type={item.icon}/> {item.text}</span>}
            />
        );
    });

    getTreeCheckedKeys = () => {
        let checkedKeys = [];
        const {role: {permissions}, permissionTreeData} = this.props;
        const loop = d => d.forEach((item) => {
            if (item.key === systemMenuKey || (item.parentKeys && item.parentKeys.indexOf(systemMenuKey) > -1)) {
                checkedKeys.push(item.key);
            }

            const functions = item.functions;
            if (functions && functions.length) {
                const funs = functions.filter(f => permissions.indexOf(f.key) > -1).map(f => f.key);
                checkedKeys = checkedKeys.concat(funs);
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(permissionTreeData);
        return checkedKeys;
    }

    render() {
        let {
            form: {getFieldDecorator, getFieldValue},
            permissionTreeData,
            formItemLayout,
            role,
            savingOrUpdatingRole,
            showRoleEditModal,
            editModalTitle,
        } = this.props;

        permissionTreeData = permissionTreeData.filter(g => {
            return g.key !== 'dev';
        });
        let ignoreValues = [];
        if (role._id) { // _id 存在，修改操作。
            ignoreValues.push(role.name);
        }

        const nameDecorator = getFieldDecorator('name', {
            initialValue: role.name,
            rules: [
                ValidationRule.required('角色名'),
                ValidationRule.checkRoleNameExist(ignoreValues),
            ],
        });

        const descriptionDecorator = getFieldDecorator('description', {initialValue: role.description});
        const permissionsDecorator = getFieldDecorator('permissions', {
            initialValue: this.getTreeCheckedKeys(),
        });

        let keys = getFieldValue('permissions');
        return (
            <Modal
                title={editModalTitle}
                visible={showRoleEditModal}
                footer=""
                onCancel={this.handleModalCancel}
            >
                <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>

                    <FormItem
                        {...formItemLayout}
                        label="角色名："
                        hasFeedback
                    >
                        {nameDecorator(
                            <Input placeholder="请输入角色名"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述："
                        hasFeedback
                    >
                        {descriptionDecorator(
                            <Input
                                type="textarea"
                                placeholder="描述"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="选择权限："
                        hasFeedback
                    >
                        {permissionsDecorator(
                            <Input type="hidden"/>
                        )}
                        <Tree
                            checkable
                            defaultExpandedKeys={keys}
                            checkedKeys={keys}
                            onCheck={this.onCheck}
                        >
                            {this.renderTreeNode(permissionTreeData)}
                        </Tree>
                    </FormItem>
                    <FormItem wrapperCol={{span: 12, offset: 7}}>
                        <Button type="ghost" style={{marginRight: 8}} htmlType="reset">重置</Button>
                        <Button type="primary" loading={savingOrUpdatingRole} htmlType="submit">确定</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export const LayoutComponent = Form.create()(RoleEdit);
export function mapStateToProps(state) {
    return {
        ...state.organizationRole,
    };
}
