var config = {
    debug: process.env.NODE_ENV === 'development',
    hostname: '127.0.0.1',
    port: process.env.PORT || 3000,
    // mongodb 配置
    db: 'mongodb://127.0.0.1/nodejs_backend',

    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_db: 0,
    redis_password: '',

    session_secret: 'node_js_backend', // 务必修改
};

module.exports = config;