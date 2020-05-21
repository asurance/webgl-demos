import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import ImageminWebpackPlugin from 'imagemin-webpack-plugin'
import webpackMerge from 'webpack-merge'
import baseConfig from './webpack.config.base'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin(),
        new OptimizeCssAssetsPlugin(),
        new ImageminWebpackPlugin({
            test: /\.(?:png|jpe?g|gif|svg)$/,
            pngquant: {
                quality: '100'
            }
        }),
    ]
} as Configuration

export default webpackMerge(baseConfig, config)