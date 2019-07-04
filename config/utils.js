const glob = require('glob');
const path= require('path');

var ROOT_PATH = path.resolve(__dirname);
console.log(ROOT_PATH)
var APP_PATH = path.resolve(ROOT_PATH, 'app');
console.log(APP_PATH)
exports.getMultiEntries=function(globPath){
    var entries={},
    basename,
    tmp,
    pathname;
    console.log(globPath);
    
    console.log(glob.sync(globPath))
    glob.sync(globPath).forEach(element => {
        
        console.log(element)



    });


}