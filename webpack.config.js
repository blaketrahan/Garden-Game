var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin(
{
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ExtractTextPluginConfig = new ExtractTextPlugin({
    filename: 'style.css',
    allChunks: true,
    /* allow hot reloading on dev */
    disable: process.env.NODE_ENV !== 'production'
});

module.exports = {
    entry: [
        "./app/index.js"
    ],
    resolve: {
        extensions: ['.js','.jsx','.json'],
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                include: __dirname + '/app',
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                sourceMap: true,
                                importLoaders: 2,
                                localIdentName: '[name]__[local]__[hash:base64:5]'
                            }
                        },
                        'sass-loader'
                    ]
                })
            },
        ]

    },
    output: {
        filename: "index_bundle.js",
        path: __dirname + "/dist"
    },
    plugins: [
        HtmlWebpackPluginConfig,
        ExtractTextPluginConfig
    ],
    devServer: {
        port: 3000
    }
}