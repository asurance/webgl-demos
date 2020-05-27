import { resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
    entry: {
        index: resolve(__dirname, '../src/index.ts')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                },
                exclude: /[\\/]node_modules[\\/]/,
            },
            {
                test: /\.(?:glsl|vert|frag)$/,
                loader: 'webpack-glsl-minify',
                options: {
                    output: 'source'
                }
            },
            {
                test: /\.(?:png|jpe?g|gif|svg|bin)$/,
                loader: 'file-loader',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(
            { template: resolve(__dirname, '../src/index.html') }
        ),
        new ExtractTextPlugin('index.css')
    ],
    resolve: {
        extensions: ['.ts', '.js', '.glsl', '.vert', '.frag']
    },
    output: {
        filename: '[hash].js',
        path: resolve(__dirname, '../public')
    }
} as Configuration

export default config