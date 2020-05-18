import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import webpackMerge from 'webpack-merge'
import baseConfig from './webpack.config.base'
import type { Configuration } from 'webpack'

const config = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 10086,
        quiet: true,
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin()
    ]
} as Configuration

export default webpackMerge(baseConfig, config)