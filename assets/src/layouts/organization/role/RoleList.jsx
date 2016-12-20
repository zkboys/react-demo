import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Table} from 'antd';
import './style.less';
import Operator from '../../../components/Operator';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import connectComponent from '../../../utils/connectComponent';
import * as RoleEdit from './RoleEdit';
import QueryBar from '../../../components/QueryBar';

const FormItem = Form.Item;
const RoleEditModal = connectComponent(RoleEdit);

export class RoleList extends Component {
    static defaultProps = {
        currentPage: 1,
        pageSize: 10,
        gettingRoles: false,
        deleting: {},
        rolesByParams: {
            results: [],
            totalCount: 0,
        },
    };

    static propTypes = {
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        gettingRoles: PropTypes.bool,
        deleting: PropTypes.object,
        rolesByParams: PropTypes.shape({
            results: PropTypes.array.isRequired,
            totalCount: PropTypes.number.isRequired,
        }),
    };

    columns = [
        {
            title: '#',
            render: (text, record, index) => (index + 1) + ((this.props.currentPage - 1) * this.props.pageSize),
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                if (record.loginname === 'admin') { // 硬编码，管理员不可操作
                    return '';
                }

                const id = record._id;
                const items = [
                    {
                        loading: this.props.editingId === id,
                        label: '编辑',
                        permission: 'role-update',
                        onClick: () => {
                            this.handleEdit(record);
                        },
                    },
                    {
                        loading: this.props.deleting[id],
                        label: '删除',
                        permission: 'role-delete',
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                        },
                        onClick: () => this.props.actions.deleteRole({id}),
                    },
                ];

                return (<Operator items={items}/>);
            },
        },
    ];

    search = (args) => {
        const {actions, form: {getFieldsValue}, currentPage, pageSize} = this.props;
        let params = {
            ...getFieldsValue(),
            currentPage,
            pageSize,
            ...args,
        };
        actions.getRolesByParams(params);
    }

    handleAdd = () => {
        const {actions, permissionTreeData} = this.props;
        actions.showRoleEditModal({
            editModalTitle: '添加角色',
            permissionTreeData,
        });
    }

    handleEdit = (role) => {
        const {actions, permissionTreeData} = this.props;
        actions.showRoleEditModal({
            editModalTitle: '修改角色',
            permissionTreeData,
            role,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.search({
            currentPage: 1,
        });
    }

    handlePageChange = (currentPage, pageSize) => {
        if (pageSize) {
            this.search({
                currentPage: 1,
                pageSize,
            });
        } else {
            this.search({
                currentPage,
            });
        }
    }

    componentDidMount() {
        const {actions} = this.props;
        this.search();
        actions.getPermissionTreeData();
    }

    render() {
        const {gettingRoles, form: {getFieldDecorator}, rolesByParams: {results: roles, totalCount}, currentPage, pageSize, user} = this.props;
        const showAddBtn = user && user.permissions && user.permissions.indexOf('role-add') > -1;
        return (
            <div className="organization-role">
                <QueryBar>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormItem label="角色名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入角色名"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </FormItem>
                    </Form>
                </QueryBar>
                <div className="tool-bar">
                    {
                        showAddBtn ?
                            <Button type="primary" onClick={this.handleAdd}>添加</Button>
                            : null
                    }
                </div>
                <Table
                    loading={gettingRoles}
                    size="middle"
                    rowKey={(record) => record._id}
                    columns={this.columns}
                    dataSource={roles}
                    pagination={false}
                />
                <PaginationComponent
                    pageSize={pageSize}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onChange={this.handlePageChange}
                />
                <RoleEditModal/>
            </div>
        );
    }
}

export const LayoutComponent = Form.create()(RoleList);
export function mapStateToProps(state) {
    return {
        ...state.organizationRole,
        ...state.app,
    };
}
