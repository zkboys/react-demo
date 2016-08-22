import React, {Component, PropTypes} from 'react';
import {Form, Input, Button, Table, Switch, Icon, Spin} from 'antd';
import './style.less';
import Operator from '../../../components/Operator';
import PaginationComponent from '../../../components/pagination/PaginationComponent';

const FormItem = Form.Item;

export class UserList extends Component {
    state = {
        pageSize: 10,
        currentPage: 1,
    };

    static defaultProps = {};

    static propTypes = {
        gettingUsers: PropTypes.bool,
        switchingLock: PropTypes.object,
        deleting: PropTypes.object,
        resetting: PropTypes.object,
        users: PropTypes.shape({
            results: PropTypes.array.isRequired,
            totalCount: PropTypes.number.isRequired,
        }),
    };

    columns = [
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
                        loading: this.state.editingId === id,
                        label: '编辑',
                        permission: 'user-update',
                        onClick: () => {
                            this.handleEdit(id);
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

    search = () => {
        const {actions, form: {getFieldsValue}} = this.props;
        const params = getFieldsValue();
        actions.getUsersByParams(params);
    }

    handleEdit = (id) => {
        alert(id);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.search();
    }

    handlePageChange = (currentPage, pageSize) => {
        if (pageSize) {
            this.setState({
                currentPage: 1,
                pageSize,
            });
        } else {
            this.setState({
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
        const {gettingUsers, form: {getFieldProps}, users: {results: users, totalCount}} = this.props;
        const pageSize = this.state.pageSize;
        const currentPage = this.state.currentPage;

        return (
            <div className="organization-user">
                <div className="query-item-bar">
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormItem label="登录名">
                            <Input placeholder="请输入登录名" {...getFieldProps('loginname')}/>
                        </FormItem>
                        <FormItem label="用户名">
                            <Input placeholder="请输入用户名" {...getFieldProps('name')}/>
                        </FormItem>
                        <FormItem label="电话">
                            <Input placeholder="请输入用户名" {...getFieldProps('mobile')}/>
                        </FormItem>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Form>
                </div>

                <div className="tool-bar">
                    <Button type="primary">添加</Button>
                </div>
                <Spin spinning={gettingUsers}>
                    <Table
                        size="middle"
                        rowKey={(record) => record._id}
                        columns={this.columns}
                        dataSource={users}
                        pagination={false}
                    />
                </Spin>
                <PaginationComponent
                    pageSize={pageSize}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onChange={this.handlePageChange}
                />
            </div>
        );
    }
}

export const LayoutComponent = Form.create()(UserList);
export function mapStateToProps(state) {
    return {
        ...state.organizationUser,
        ...state.organizationRole,
        ...state.organization,
    };
}
