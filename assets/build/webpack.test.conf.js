var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'css'
            },
            {
                test: /\.less$/,
                loader: 'css!less'
            },
        ]
    }
})
