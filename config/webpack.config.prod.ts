import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import webpackMerge from 'webpack-merge'
import baseConfig from './webpack.config.base'
import type { Configuration } from 'webpack'

const config = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new OptimizeCssAssetsPlugin()
    ]
} as Configuration

export default webpackMerge(baseConfig, config)