const isDebug = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

const config = {
    debug: isDebug,
    hostname: '127.0.0.1',
    port: process.env.PORT || 3000,

    // mongodb 配置
    db: 'mongodb://127.0.0.1/org_dev',

    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,
    redis_password: '',

    session_secret: 'node_js_backend', // 务必修改

    auth_cookie_name: 'org_structure',
    admin_name: 'admin', // 超级管理员，拥有所有的权限
    session_time_out: isDebug ? 30 * 60 * 1000 : 30 * 60 * 1000, // session过期时间
};

module.exports = config;