const glob = require('glob');
const path= require('path');
const HtmlWebpackPlugn = require("html-webpack-plugin");


// var APP_PATH = path.resolve(ROOT_PATH, 'app');
// console.log(APP_PATH)
exports.getMultiEntries=function(globPath){
    var entriesAndOutputObj={};
    var entries={},
    output=[],
    basename,
    tmp,
    pathname;
    // console.log(globPath);
    
    // console.log(glob.sync(globPath))
    glob.sync(globPath).forEach((element,index) => {
        basename=path.basename(element,path.extname(element))

        // console.log(element.split('/'))
        // console.log(element.split('/').indexOf("src"))
        tmp=(element.split('/')).splice(element.split('/').indexOf("src")+1);
        // console.log((element.split('/')).splice(element.split('/').indexOf("src")+1));
        // pathname=(tmp.splice(0,tmp.length-1)).join("/");
        // console.log(pathname)
        entries[tmp[1]] = element;


        var conf={
            filename:`${tmp[1]}.html`,
            template: './index.html',
            title:tmp[1],
            chunks: [tmp[1], 'manifest',"styles", 'vendor',"commons"],
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: false,
                minifyURLs: true,
            }
        };
        output.push(new HtmlWebpackPlugn(conf));
    });
    entriesAndOutputObj.entries = entries;
    console.log(Object.keys(entriesAndOutputObj.entries))
    entriesAndOutputObj.output=output;
    return entriesAndOutputObj;
};