var path = require('path')
var webpack = require('webpack')
var config = require('./config')
var utils = require('./utils')
var projectRoot = path.resolve(__dirname, '../')

var babelPlugins = ['add-module-exports', 'typecheck', 'transform-runtime', ["import", [{ "libraryName": "antd", "style": "css" }]]];
if (process.env.NODE_ENV === 'testing') {
    babelPlugins.unshift('__coverage__');
}

var babelQuery = {
    cacheDirectory: true,
    presets: ['es2015', 'react', 'stage-0'],
    plugins: babelPlugins,
    comments: false
};

module.exports = {
    cache: true,
    entry: {
        app: './src/App.jsx',
        signIn: './src/layouts/sign-in/sign-in.js'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            'src': path.resolve(__dirname, '../src'),
            'assets': path.resolve(__dirname, '../src/assets'),
            'components': path.resolve(__dirname, '../src/components')
        }
    },
    resolveLoader: {
        fallback: [path.join(__dirname, '../node_modules')]
    },
    module: {
        preLoaders: [
            {
                test: /\.js(x)*$^[routes.js]/,
                loader: 'eslint',
                include: projectRoot,
                exclude: /node_modules/
            },
            {
                test: /routes\.js$/,
                loader: path.join(__dirname, './routes-loader') + '!eslint',
                include: projectRoot,
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js(x)*$/,
                loader: 'babel',
                include: projectRoot,
                exclude: /node_modules/,
                query: babelQuery
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    eslint: {
        formatter: require('eslint-friendly-formatter')
    },
    // // TODO 文件大小有改变，但是速度并没有提升
    /*plugins: [
     new webpack.DllReferencePlugin({
     context: __dirname,
     manifest: require('./dll/manifest.json'),
     }),
     ],*/
}
