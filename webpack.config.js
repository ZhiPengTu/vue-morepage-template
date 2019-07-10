
module.exports = env => {
    switch (env.NODE_ENV) {
        case 'prod':
        case 'production':
            webpackConfig = require('./config/webpack.prod.conf.js');
            break;
      
        case 'testing':
            webpackConfig = require('./configs/webpack.test.conf');
            break;
        case 'common':
            webpackConfig = require('./configs/webpack.common.conf');
            break;
        case 'release':
            webpackConfig = require('./configs/webpack.release.conf');
            break;
        case 'dev':
        case 'development':
        default:
            webpackConfig = require('./configs/webpack.dev.conf');
    }
    return webpackConfig;
}