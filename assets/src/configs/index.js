import packageJson from '../../package.json';

export default {
    apiPath: '/api',
    signInPath: process.env.NODE_ENV === 'production' ? '/signin' : '/signin.html',
    package: packageJson,
};
