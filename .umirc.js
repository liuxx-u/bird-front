import { resolve } from 'path';

export default {
  // for query-string@6 https://github.com/sorrycc/blog/issues/68
  es5ImcompatibleVersions: true,
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//
          ]
        },
        dll: {
          exclude: [],
          include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"]
        }
      }
    ]
  ],
  theme: "./theme.config.js",
  proxy: {
    // "/api/v1/weather": {
    //   "target": "https://api.seniverse.com/",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
    // }
  },
  alias: {
    themes: resolve(__dirname, './src/themes'),
    components: resolve(__dirname,"./src/components"),
    utils: resolve(__dirname,"./src/utils"),
    config: resolve(__dirname,"./src/utils/config"),
    services: resolve(__dirname,"./src/services"),
    models: resolve(__dirname,"./src/models"),
    routes: resolve(__dirname,"./src/routes"),
  },
  urlLoaderExcludes: [
    /\.svg$/,
  ],
}
