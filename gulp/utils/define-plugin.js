import webpack from 'webpack';

// definePlugin takes raw strings and inserts them, so you can put strings of JS if you want.
const definePlugin = new webpack.DefinePlugin({
    __WEBPACK__: true, // say we're the webpack
    __DEV__: process.env.BUILD_DEV, // dev environment indication
});

export default definePlugin;
