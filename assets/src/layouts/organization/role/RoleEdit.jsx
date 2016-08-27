import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Modal, Tree} from 'antd';
import FAIcon from '../../../components/faicon/FAIcon';
import './style.less';
import ValidationRule from '../../../services/validation-rule';

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const systemMenuKey = 'system';

class RoleEdit extends Component {

    static defaultProps = {
        savingOrUpdatingRole: false,
        showEditModal: false,
        editModalTitle: '',
        menusTreeData: [],
        role: {
            name: '',
            description: '',
        },
        formItemLayout: {
            labelCol: {span: 4},
            wrapperCol: {span: 18},
        },
    };

    static propTypes = {
        showEditModal: PropTypes.bool,
        savingOrUpdatingRole: PropTypes.bool,
        editModalTitle: PropTypes.string,
        menusTreeData: PropTypes.array,
        role: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string,
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
        const {savingRole, form: {validateFieldsAndScroll}, actions, role} = this.props;

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
            actions.addRole(values, () => {
                actions.hideRoleEditModal();
                this.handleReset();
            });
        });
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
    onCheck = (info, e) => {
        const {menusTreeData, form: {setFieldsValue}} = this.props;
        const checkedNodes = e.checkedNodes;
        let permissions = new Set();
        if (checkedNodes && checkedNodes.length) {
            checkedNodes.forEach(checkNode => {
                const key = checkNode.key;
                this.findNodeByKey(menusTreeData, key, (node) => {
                    const keys = [...(node.parentKeys || [])];
                    keys.push(key);
                    keys.forEach(k => {
                        if (k !== undefined) {
                            permissions.add(k);
                        }
                    });
                });
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
        if (item.functions && item.functions.length) {
            return (
                <TreeNode
                    {...disable}
                    key={item.key}
                    title={<span><FAIcon type={item.icon}/> {item.text}</span>}
                >
                    {item.functions.map(v => {
                        v.parentKeys = [...item.parentKeys];
                        v.parentKeys.push(item.key);
                        return (
                            <TreeNode
                                key={v.key}
                                title={<span>{v.name}</span>}
                            />
                        );
                    })}
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

    render() {
        let {form: {getFieldProps}, menusTreeData, formItemLayout, role, savingOrUpdatingRole, showEditModal, editModalTitle} = this.props;
        menusTreeData = menusTreeData.filter(g => {
            return g.key !== 'dev';
        });
        let defaultCheckedKeys = [];
        const loop = d => d.forEach((item) => {
            let disable = {};
            if (item.key === systemMenuKey || (item.parentKeys && item.parentKeys.indexOf(systemMenuKey) > -1)) {
                disable.disableCheckbox = true;
                defaultCheckedKeys.push(item.key);
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
            if (item.functions && item.functions.length) {
                item.functions.forEach(v => {
                    v.parentKeys = [...item.parentKeys];
                    v.parentKeys.push(item.key);
                    if (v.parentKeys.indexOf(systemMenuKey) > -1) {
                        defaultCheckedKeys.push(item.key);
                    }
                });
            }
        });
        loop(menusTreeData);

        let ignoreValues = [];
        if (role._id) { // _id 存在，修改操作。
            ignoreValues.push(role.name);
        }

        const nameProps = getFieldProps('name', {
            initialValue: role.name,
            rules: [
                ValidationRule.required('角色名'),
                ValidationRule.checkRoleNameExist(ignoreValues),
            ],
        });
        const descriptionProps = getFieldProps('description', {initialValue: role.description});
        getFieldProps('permissions', {
            initialValue: defaultCheckedKeys.concat(role.permissions),
        });
        let keys = role.permissions || [];
        keys = keys.filter(v => {
            let node = null;
            this.findNodeByKey(menusTreeData, v, (n) => {
                node = n;
            });
            return node && !((node.children && node.children.length) || (node.functions && node.functions.length));
        });
        keys = keys.concat(defaultCheckedKeys);
        return (
            <Modal
                title={editModalTitle}
                visible={showEditModal}
                footer=""
                onCancel={this.handleModalCancel}
            >
                <Form horizontal onSubmit={this.handleSubmit} onReset={this.handleReset}>

                    <FormItem
                        {...formItemLayout}
                        label="角色名："
                        hasFeedback
                    >
                        <Input
                            {...nameProps}
                            placeholder="请输入角色名"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="描述："
                        hasFeedback
                    >
                        <Input
                            type="textarea"
                            {...descriptionProps}
                            placeholder="描述"
                        />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="选择权限："
                        hasFeedback
                    >
                        <Tree
                            checkable
                            defaultExpandedKeys={keys}
                            defaultCheckedKeys={keys}
                            onCheck={this.onCheck}
                        >
                            {this.renderTreeNode(menusTreeData)}
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
