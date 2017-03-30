import packageJson from '../../package.json';

const debug = process.env.NODE_ENV !== 'production';
export default {
    debug,
    apiPath: '/api',
    signInPath: process.env.NODE_ENV === 'production' ? '/signin' : '/signin.html',
    package: packageJson,
};
