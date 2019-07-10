
module.exports = env => {
    switch (env.NODE_ENV) {
        case 'prod':
        case 'production':
            webpackConfig = require('./config/webpack.prod.conf.js');
            break;

        case 'testing':
            webpackConfig = require('./config/webpack.test.conf.js');
            break;
        case 'common':
            webpackConfig = require('./config/webpack.common.conf.js');
            break;
        case 'release':
            webpackConfig = require('./config/webpack.release.conf.js');
            break;
        case 'dev':
            webpackConfig = require('./config/webpack.dev.conf.js');
            break;
        case 'development':
        default:
            webpackConfig = require('./config/webpack.dev.conf.js');
    }
    return webpackConfig;
}