var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const utils = require("./utils.js");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const entriesAndOutObj = utils.getMultiEntries(resolve('../src/views/**/*.js'));
var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const config = require('./config');



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
    chunkFilename: "../css/[name].[hash].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false,
    //         drop_debugger: true,
    //         drop_console: true
    //     },
    //     sourceMap: true
    // })
];

plugins.push(...entriesAndOutObj.output);
module.exports = {
    mode: "development",
    // devtool: 'inline-source-map',
    entry: entriesAndOutObj.entries, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output: {
        path: path.resolve(__dirname, '../', './dist'), // 项目的打包文件路径
        publicPath: 'dist', // 通过devServer访问路径
        filename: "js/[name].[hash].js",
        globalObject: 'this',
        chunkFilename: "../js/[name].[hash].js"
    },
    devServer: {
        historyApiFallback: false,
        // stats: 'errors-only',
         //设置基本目录结构,用于找到程序打包地址
        // contentBase: path.join(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: config.dev.host,
        //在所有响应中添加首部内容
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        // public:"",
        open: true,
        //服务端压缩是否开启
        //compress:true,
        //绕过主机检查
        disableHostCheck: true,
        //网络广播服务器
        // openPage: encodeURI(openPage),
        openPage: encodeURI("dist/test.html"),
        //bonjour: true,
        //此选项允许浏览器使用您的本地IP打开
        useLocalIp: false,
        //配置服务端口号
        port: 8081,
        //是否开启热重载
        hot: true
    },
    plugins: plugins,
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        removeEmptyChunks: false,
        minimizer: [
            new UglifyJsPlugin({
               
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            // new TerserPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true, // Must be set to true if using source-maps in production
            //     terserOptions: {
            //         // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
            //     }
            // }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: "async",
            // chunks:"all",
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
                test: /\.js$/, //用正则匹配文件，用require或者import引入的都会匹配到
                loader: "babel-loader", //加载器名，就是上一步安装的loader
                exclude: /node_modules/ //排除node_modules目录，我们不加载node模块中的js哦~
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: './'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')("last 2 versions"),//浏览器器兼容 自动加前缀
                                require('postcss-px2rem')({ remUnit: 75 })
                            ]
                        }
                    }
                ]

                //依次使用以上loader加载css文件，postcss-loader可以暂时不加，后面再深入修改webpack配置的时候再说用处
                //
                //也可以写成这样 loader："style-loader!css-loader!postcss-loader"
            },
            {
                test: /\.(png|jpe?j|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[ext]?[hash]'
                }
                //图片文件大小小于limit的数值，就会被改写成base64直接填入url里面，
                //不然会输出到dist/img目录下，[name]原文件名，[ext]原后缀，[hash]在url上加上一点哈希值避免缓存。
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]?[hash]'
                }
                //和上面一致
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
                //这一个loader当然是vue项目必须的加载器啦，不加其他规则的话，
                //简单的这样引入就可以了，vue-loader会把vue单文件直接转成js。
            },
        ]
    },
    resolve: {
        //引入路径是不用写对应的后缀名
        extensions: ['.js', '.vue', '.json'],
        //缩写扩展
        alias: {
            //正在使用的是vue的运行时版本，而此版本中的编译器时不可用的，我们需要把它切换成运行时 + 编译的版本
            'vue$': 'vue/dist/vue.esm.js',// 'vue/dist/vue.common.js' for webpack 1
            //用@直接指引到src目录下，如：'./src/main'可以写成、'@/main'
            '@': path.resolve(__dirname,'../', './src'),
        }
    }
   
};
