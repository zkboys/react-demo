var config = require('./config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
    // eval-source-map is faster for development
    devtool: '#eval-source-map',
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?sourceMap&-restructuring!' + 'postcss-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!' + 'postcss-loader!' + 'less?{"sourceMap":true,"modifyVars":{}}')
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css', {
            disable: false,
            allChunks: true // 不设置成true，webpack异步方式加载的组件 样式无法引入 坑！！！
        }),
        new webpack.NoErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            chunks: ['app'],
            favicon: 'favicon.png',
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            csrf: '<%= csrf %>'
        }),
        new HtmlWebpackPlugin({
            chunks: ['signIn'],
            favicon: 'favicon.png',
            filename: 'signin.html',
            template: 'signin.html',
            inject: true,
            csrf: '<%= csrf %>'
        })
    ]
})
