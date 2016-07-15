/* eslint no-console: 0 */
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import definePlugin from './utils/define-plugin.js';

// create optimizations array
const optimizations = [definePlugin];

// get build config
const buildConfig = require('../buildConfig');
// get webpack config
const wpConfig = buildConfig.webpackConfig.debug;

// export initilizer
export default (gulp) => {
    gulp.task('debug', function() {
        // append our define plugin
        wpConfig.plugins = wpConfig.plugins ? wpConfig.plugins.concat(optimizations) : optimizations;
        // get server config
        let proxy = {};
        if (buildConfig.devServer && buildConfig.devServer.proxy) {
            proxy = buildConfig.devServer.proxy;
        }
        let headers = {};
        if (buildConfig.devServer && buildConfig.devServer.headers) {
            headers = buildConfig.devServer.headers;
        }
        // run webpack
        const compiler = webpack(wpConfig);
        const server = new WebpackDevServer(compiler, {
            // webpack-dev-server options
            contentBase: wpConfig.context,

            hot: true,
            // Enable special support for Hot Module Replacement
            // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
            // Use "webpack/hot/dev-server" as additional module in your entry point
            // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

            // webpack-dev-middleware options
            quiet: false,
            noInfo: false,
            watchOptions: {
                aggregateTimeout: 300,
                poll: true
            },
            headers,
            stats: {
                chunks: false,
                colors: true,
            },
            // Set this as true if you want to access dev server from arbitrary url.
            // This is handy if you are using a html5 router.
            historyApiFallback: true,
            // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
            // Use "*" to proxy all paths to the specified server.
            // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
            // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
            proxy,
        });
        server.listen(8080, 'localhost', function() {
            console.log('Webpack-Dev-Server: started on port 8080');
        });
    });
};
