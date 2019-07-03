// module.exports = {
//     mode: 'development',
//     entry: './src/main.js',
//     output: {
//         path: __dirname + '/dist',
//         filename: 'bundle.js'
//     },
//     module: {
//         loaders: [{
//             test: /\.css$/,
//             loader: 'style!css'
//         }]
//     },
//     optimization: {
//         namedModules: true,
//         namedChunks: true,
//         nodeEnv: 'development',
//         flagIncludedChunks: false,
//         occurrenceOrder: false,
//         sideEffects: false,
//         usedExports: false,
//         concatenateModules: false,
//         splitChunks: {
//             hidePathInfo: false,
//             minSize: 10000,
//             maxAsyncRequests: Infinity,
//             maxInitialRequests: Infinity,
//         },
//     },
//     plugins: [
//         new webpack.NamedModulesPlugin(),
//         new webpack.NamedChunksPlugin(),
//         new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
//     ]
// }