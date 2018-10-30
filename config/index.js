'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/zqi_vercenter': {
        //target:'http://appstore.sunmath.cn',//正式环境
        target: 'http://test.openplatform.weilian.cn', //测试环境
        // target: 'http://172.19.4.216:8080', //本地环境
        // target: 'http://192.168.1.128:8080', //张文笔记本环境
        changeOrigin:true,
        pathRewrite:{
            // '^/zqi_vercenter': '/zqi_vercenter'
        }
      },
      '/zqi_appstore': {
        //target:'http://appstore.sunmath.cn',//正式环境
        target: 'http://test.openplatform.weilian.cn', //测试环境
        // target: 'http://172.19.4.216:8080', //本地环境
        changeOrigin:true,
        pathRewrite:{
            '^/zqi_appstore': '/zqi_appstore'
        }
      },
      '/iot-frame': {
        // target: 'http://172.19.4.216:5555',//本地环境
        // target: 'http://172.16.35.95:5555',//测试环境
        // target: 'http://172.19.4.151:8888', //姜清秀本地环境
        // target: 'http://172.19.4.175:5555', //张梦蝶本地环境
        target: 'http://172.19.4.195:5555', //张文笔记本环境
        changeOrigin:true,
        pathRewrite:{
            '^/iot-frame': '/iot-frame'
        }
      },
      '/UAMS': {
        target: 'http://vr12.weilian.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/UAMS': '/UAMS'
        }
      },
      //用户中心代理地址
      '/account_auth_admin': {
        target: 'http://vr12.weilian.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/account_auth_admin': '/account_auth_admin'
        }
      },
      '/algorithm': {
        target: 'http://172.19.4.223:888',
        changeOrigin: true,
        pathRewrite: {
          '^/algorithm': '/algorithm'
        }
      },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8091, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
