var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const autoprefixer=require("autoprefixer");
const utils = require("./config/utils");
const entriesAndOutObj = utils.getMultiEntries(resolve('src/views/**/*.js'));
var webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// var htmls = utils.getcreateMultiHtml();
// console.log(htmls)
// console.log(testEntries)
function resolve(dir) {
    return path.join(path.resolve(__dirname), './', dir)
}
var plugins = [new VueLoaderPlugin(), new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "css/[name].css",
    chunkFilename: "[name].css"
})]
plugins.push(...entriesAndOutObj.output);
module.exports = {
    mode:"production",
    // entry: {
    //     "main": './src/main.js'
    // }, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    entry: entriesAndOutObj.entries, // 项目的入口文件，webpack会从main.js开始，把所有依赖的js都加载打包
    output: {
        path: path.resolve(__dirname, './dist'), // 项目的打包文件路径
        publicPath: '../dist/', // 通过devServer访问路径
        filename: "js/[name].js",
        globalObject: 'this',
        chunkFilename:"./js/[name].js"
    },
    
    plugins:plugins,
    optimization: {
        runtimeChunk:{
            name:"manifest"
        },
        splitChunks: {
            chunks:"async",
            minSize:500,
            minChunks:2,
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial"
                },

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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            // publicPath: '../'
                        }
                    },
                    // 'style-loader',
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
            '@': path.resolve(__dirname, './src'),
        }
    },
    devServer: {
        historyApiFallback: true, //historyApiFallback设置为true那么所有的路径都执行index.html。
        overlay: true // 将错误显示在html之上
    }
};