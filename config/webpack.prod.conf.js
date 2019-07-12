var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const utils = require("./utils.js");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const entriesAndOutObj = utils.getMultiEntries(resolve('../src/views/**/*.js'));
// var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
console.log(CleanWebpackPlugin)
function resolve(dir) {
    return path.join(path.resolve(__dirname), './', dir)
}

var plugins = [
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "css/[name].[hash].css",
    chunkFilename: "./css/[name].[hash].css"
})];

plugins.push(...entriesAndOutObj.output);
module.exports = {
    mode: "production",
    entry: entriesAndOutObj.entries, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output: {
        path: path.resolve(__dirname, '../', './dist'), // 项目的打包文件路径
        // publicPath: './dist', // 通过devServer访问路径
        filename: "js/[name].[hash].js",
        globalObject: 'this',
        chunkFilename: "./js/[name].[hash].js"
    },
    devtool: 'source-map',
    plugins: plugins,
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        removeEmptyChunks: true,
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            // chunks: "async",
            chunks:"all",
            minSize: 100,
            minChunks: 2,
            name: true,
            maxAsyncRequests: 5,
            maxInitialRequests: 5,
            automaticNameDelimiter: "~",
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/
                },
                commons: {
                    name: "commons",
                    chunks: "initial"
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css)$/,
                    chunks: 'all',

                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader", 
                exclude: /node_modules/ 
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')("last 2 versions"),
                                require('postcss-px2rem')({ remUnit: 75 })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?j|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js', 
            '@': path.resolve(__dirname,'../', './src'),
        }
    },
    devServer: {
        historyApiFallback: false, 
        overlay: true 
    }
};
