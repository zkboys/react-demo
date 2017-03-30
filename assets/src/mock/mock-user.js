import {Users, LoginUsers} from './mockdata/user.js';
import menus from './mockdata/menus';

export default function (mock) {
    // mock success request
    mock.onGet('/success').reply(200, {
        msg: 'success',
    });

    // mock error request
    mock.onGet('/error').reply(500, {
        msg: 'failure',
    });
    // 登录
    mock.onPost('/api/signin').reply(config => {
        let {
            pass,
            name,
        } = JSON.parse(config.data);
        return new Promise((resolve, reject) => {
            const user = LoginUsers.filter(u => u.loginname === name && u.pass === pass);
            if (user && user.length) {
                console.log(user);
                resolve([200,
                    {
                        refer: '/',
                        user: user[0],
                        menus,
                    },
                ]);
            } else {
                reject(new Error('用户名或密码错误'));
            }
        });
    });
    // 获取用户列表（分页）
    mock.onGet('/api/organization/users').reply(config => {
        let {
            currentPage = 1,
            pageSize = 20,
            // loginname,
            // mobile,
            // name,
        } = JSON.parse(config.data);
        let mockUsers = Users.filter(() => {
            // TODO 过滤数据
            return true;
        });
        let totalCount = mockUsers.length;
        mockUsers = mockUsers.filter((u, index) => index < pageSize * currentPage && index >= pageSize * (currentPage - 1));
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([200, {
                    totalCount,
                    results: mockUsers,
                }]);
            }, 1000);
        });
    });
}
