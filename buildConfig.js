module.exports = {
    webpackConfig: {
        debug: require('./webpack.config.js'),
        production: require('./webpack.config.prod.js'),
    },
    devServer: {
        // settings for webpack-dev-server
        proxy: {
            // put your custom proxy routes here, e.g.:
            // '/api/': 'http://localhost:8081'
        },
        headers: {
            // put your custom headers here, e.g.:
            // 'X-TEST': 1,
        },
    },
};
