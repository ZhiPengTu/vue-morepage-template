const glob = require('glob');
const path= require('path');


// var APP_PATH = path.resolve(ROOT_PATH, 'app');
// console.log(APP_PATH)
exports.getMultiEntries=function(globPath){
    var entries={},
    basename,
    tmp,
    pathname;
    // console.log(globPath);
    
    // console.log(glob.sync(globPath))
    glob.sync(globPath).forEach(element => {
        
        console.log(element)

        entries[element] = element;

    });

    return entries;
}