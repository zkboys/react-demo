export default [
    {
        path: '/organization/users',
        asyncComponent: './user/UserList',
    },
    {
        path: '/organization/organizations',
        asyncComponent: './org/Organization',
    },
    {
        path: '/organization/roles',
        asyncComponent: './role/RoleList',
    },
];
