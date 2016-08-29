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
        showEditModal: false,
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
        showEditModal: PropTypes.bool,
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
    onCheck = (info, e) => {
        const {permissionTreeData, form: {setFieldsValue}} = this.props;
        const checkedNodes = e.checkedNodes;
        let permissions = new Set();
        if (checkedNodes && checkedNodes.length) {
            checkedNodes.forEach(checkNode => {
                const key = checkNode.key;
                permissions.add(key);
                // 添加父级key
                const node = findNodeByKey(permissionTreeData, key);
                if (node) {
                    const keys = [...(node.parentKeys || [])];
                    keys.forEach(k => {
                        if (k !== undefined) {
                            permissions.add(k);
                        }
                    });
                }
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

    getDefaultCheckedKeys = () => {
        const {permissionTreeData} = this.props;
        let defaultCheckedKeys = [];
        const loop = d => d.forEach((item) => {
            if (item.key === systemMenuKey || (item.parentKeys && item.parentKeys.indexOf(systemMenuKey) > -1)) {
                defaultCheckedKeys.push(item.key);
            }
            if (item.children && item.children.length) {
                loop(item.children);
            }
        });
        loop(permissionTreeData);

        return defaultCheckedKeys;
    }

    render() {
        let {form: {getFieldProps, getFieldValue}, permissionTreeData, formItemLayout, role, savingOrUpdatingRole, showEditModal, editModalTitle} = this.props;
        permissionTreeData = permissionTreeData.filter(g => {
            return g.key !== 'dev';
        });

        let defaultCheckedKeys = this.getDefaultCheckedKeys();

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
        const permissionsProps = getFieldProps('permissions', {
            initialValue: [...defaultCheckedKeys, ...role.permissions],
        });

        let keys = getFieldValue('permissions');
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
                        <Input
                            type="hidden"
                            {...permissionsProps}
                        />
                        <Tree
                            checkable
                            defaultExpandedKeys={keys}
                            defaultCheckedKeys={keys}
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
