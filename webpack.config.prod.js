var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'app.min.js',
    },
    resolve: {
        root: path.resolve(__dirname),
        packageMains: ['style', 'main'],
        extensions: ['', '.js', '.jsx'],
        modulesDirectories: ['node_modules'],
    },
    node: {
        fs: 'empty',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less'),
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass'),
            },
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style', 'css!stylus'),
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
            },
            {
                test: /\.woff\d?(\?.+)?$/,
                loader: 'url?limit=1000&minetype=application/font-woff',
            },
            {
                test: /\.ttf(\?.+)?$/,
                loader: 'url?limit=1000&minetype=application/octet-stream',
            },
            {
                test: /\.eot(\?.+)?$/,
                loader: 'url?limit=1000',
            },
            {
                test: /\.svg(\?.+)?$/,
                loader: 'url?limit=1000&minetype=image/svg+xml',
            },
            {
                test: /\.png$/,
                loader: 'url?limit=1000&mimetype=image/png',
            },
            {
                test: /\.gif$/,
                loader: 'url?limit=1000&mimetype=image/gif'
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin('style.css', {allChunks: true}),
    ],
};
