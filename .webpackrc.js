import { resolve } from 'path';

export default {
  theme: "./theme.config.js",
  // 接口代理示例
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
  ignoreMomentLocale: true,
}
