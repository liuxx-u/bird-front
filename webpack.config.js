var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    debug: true,
    context: path.resolve(__dirname),
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './src/index.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'app.min.js',
    },
    resolve: {
        root: path.resolve(__dirname),
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules'],
    },
    node: {
        fs: 'empty',
    },
    /*eslint: {
        configFile: path.join(__dirname, '.eslintrc'),
    },*/
    module: {
        preLoaders: [
            /*{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint'
            },*/
        ],
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.less$/,
                loaders: ['style', 'css', 'less'],
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },
            {
                test: /\.styl$/,
                loaders: ['style', 'css', 'stylus'],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel'],
            },
            {
                test: /\.woff\d?(\?.+)?$/,
                loader: 'url?limit=10000&minetype=application/font-woff',
            },
            {
                test: /\.ttf(\?.+)?$/,
                loader: 'url?limit=10000&minetype=application/octet-stream',
            },
            {
                test: /\.eot(\?.+)?$/,
                loader: 'url?limit=10000',
            },
            {
                test: /\.svg(\?.+)?$/,
                loader: 'url?limit=10000&minetype=image/svg+xml',
            },
            {
                test: /\.png$/,
                loader: 'url?limit=10000&mimetype=image/png',

            },
            {
                test: /\.jpg$/,
                loader: 'url?limit=10000&mimetype=image/jpg',
            },
            {
                test: /\.gif$/,
                loader: 'url?limit=10000&mimetype=image/gif'
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
};
