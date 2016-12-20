import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Table, Switch, Icon} from 'antd';
import './style.less';
import Operator from '../../../components/Operator';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import connectComponent from '../../../utils/connectComponent';
import * as UserEdit from './UserEdit';
import QueryBar from '../../../components/QueryBar';

const FormItem = Form.Item;
const UserEditModal = connectComponent(UserEdit);

export class UserList extends Component {
    static defaultProps = {
        currentPage: 1,
        pageSize: 10,
        gettingUsers: false,
        switchingLock: {},
        deleting: {},
        resetting: {},
        users: {
            results: [],
            totalCount: 0,
        },
        organizations: [],
        roles: [],
    };

    static propTypes = {
        currentPage: PropTypes.number,
        pageSize: PropTypes.number,
        gettingUsers: PropTypes.bool,
        switchingLock: PropTypes.object,
        deleting: PropTypes.object,
        resetting: PropTypes.object,
        users: PropTypes.shape({
            results: PropTypes.array.isRequired,
            totalCount: PropTypes.number.isRequired,
        }),
        organizations: PropTypes.array,
        roles: PropTypes.array,
    };

    columns = [
        {
            title: '#',
            render: (text, record, index) => (index + 1) + ((this.props.currentPage - 1) * this.props.pageSize),
        },
        {
            title: '登录名',
            dataIndex: 'loginname',
            key: 'loginname',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => {
                const genders = {
                    male: '男',
                    female: '女',
                };

                return genders[text] || '未填写';
            },
        },
        {
            title: '电话',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '所属部门',
            dataIndex: 'org_key',
            key: 'org_key',
            render: (text) => {
                const org = this.props.organizations.find(v => v.key === text);
                return (org && org.name) || '未指定';
            },
        },
        {
            title: '职位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '角色',
            dataIndex: 'role_id',
            key: 'role',
            render: (text) => {
                const role = this.props.roles.find(v => v._id === text);
                return (role && role.name) || '未指定';
            },
        },
        {
            title: '是否锁定',
            dataIndex: 'is_locked',
            key: 'is_locked',
            render: (text, record) => {
                if (record.loginname === 'admin') return '';
                const id = record._id;
                const loading = this.props.switchingLock[id];
                const loadingChildren = <Icon type="loading"/>;
                let checkedChildren = '是';
                let unCheckedChildren = '否';

                if (loading) {
                    checkedChildren = loadingChildren;
                    unCheckedChildren = loadingChildren;
                }

                return (
                    <Switch
                        unCheckedChildren={unCheckedChildren}
                        checkedChildren={checkedChildren}
                        checked={record.is_locked}
                        onChange={(checked) => {
                            if (loading) return;
                            this.props.actions.toggleUserLock({id, isLocked: !checked});
                        }}
                    />
                );
            },
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
                        permission: 'user-update',
                        onClick: () => {
                            this.handleEdit(record);
                        },
                    },
                    {
                        loading: this.props.deleting[id],
                        label: '删除',
                        permission: 'user-delete',
                        confirm: {
                            title: `您确定要删除“${record.name}”？`,
                        },
                        onClick: () => this.props.actions.deleteUser({id}),
                    },
                    {
                        loading: this.props.resetting[id],
                        label: '重置密码',
                        permission: 'user-reset-pass',
                        confirm: {
                            title: `您确定要重置“${record.name}”的密码吗？`,
                        },
                        onClick: () => this.props.actions.resetUserPass({id}),
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
        actions.getUsersByParams(params);
    }

    handleAdd = () => {
        const {actions} = this.props;
        actions.showUserEditModal({
            editModalTitle: '添加人员',
        });
    }

    handleEdit = (user) => {
        const {actions} = this.props;
        actions.showUserEditModal({
            editModalTitle: '修改人员',
            user,
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

    componentWillMount() {
        const {actions} = this.props;
        actions.getAllOrganizations();
        actions.getAllRoles();
    }

    componentDidMount() {
        this.search();
    }

    render() {
        const {gettingUsers, form: {getFieldDecorator}, users: {results: users, totalCount}, currentPage, pageSize, currentUser} = this.props;
        const showAddBtn = currentUser && currentUser.permissions && currentUser.permissions.indexOf('user-add') > -1;
        return (
            <div className="organization-user">
                <QueryBar>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormItem label="登录名">
                            {getFieldDecorator('loginname')(
                                <Input placeholder="请输入登录名"/>
                            )}
                        </FormItem>
                        <FormItem label="用户名">
                            {getFieldDecorator('name')(
                                <Input placeholder="请输入用户名"/>
                            )}
                        </FormItem>
                        <FormItem label="电话">
                            {getFieldDecorator('mobile')(
                                <Input placeholder="请输入用户名"/>
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
                    loading={gettingUsers}
                    size="middle"
                    rowKey={(record) => record._id}
                    columns={this.columns}
                    dataSource={users}
                    pagination={false}
                />
                <PaginationComponent
                    pageSize={pageSize}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onChange={this.handlePageChange}
                />
                <UserEditModal/>
            </div>
        );
    }
}

export const LayoutComponent = Form.create()(UserList);
export function mapStateToProps(state) {
    return {
        ...state.organizationRole,
        ...state.organization,
        ...state.app,
        ...state.organizationUser,
        currentUser: state.app.user,
    };
}
