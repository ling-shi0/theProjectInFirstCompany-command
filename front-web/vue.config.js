/*
 * @Description:
 * @Version: 2.0
 * @Autor: caokeke
 * @Date: 2021-02-21 10:55:50
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-06 20:02:06
 */
const env = process.env.NODE_ENV;
const isDev = env === 'development';
const page = isDev ? 'index.html' : './templates/index.ftl';
const IsMockMode = process.env.VUE_APP_MOCK === 'true';
const projectThemeEntry = './src/style/project.scss';
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ip = require('ip');
const main = {
  indexPath: page,
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      //   let meta = {
      //     // _csrf: {
      //     //   name: '_csrf',
      //     //   content: '{{ ctx.session.csrfToken }}'
      //     // },
      //     lang: {
      //       name: 'lang',
      //       language: '{{ helper.lang() }}'
      //     },
      //     skin: {
      //       name: 'skin',
      //       skin: '{{ helper.skin() }}'
      //     }
      //   };
      //   if (isDev) {
      //     meta = '';
      //   }
      //   args[0].meta = meta;
      //   return args;
      const metaContent = {
        _csrf_header: 'X-CSRF-TOKEN',
        _csrf: '${(_csrf.token)!}'
      };
      if (isDev) {
        args[0].meta = {
          _csrf_header: 'X-CSRF-TOKEN',
          _csrf: '91d2dee0-2670-49ee-b6a0-c6513113f299'
        };
      } else {
        args[0].meta = metaContent;
      }
      // args[0].baseHead = metaContent;
      return args;
    });
  },
  publicPath: `/${process.env.VUE_APP_CONTEXT}`,
  assetsDir: process.env.VUE_APP_ASSETS,
  outputDir: process.env.VUE_APP_OUTPUT,
  lintOnSave: false,
  runtimeCompiler: true,
  // 默认babel-loader会忽略node_modules中的文件，需要转化的在此处填写
  transpileDependencies: [/@hui-pro/, /hui/, 'client-container'],
  // 用于开发环境下与后端联调
  devServer: {
    // https: true,
    host: '0.0.0.0',
    proxy: IsMockMode
      ? null
      : {
        [`${process.env.VUE_APP_API_PREFIX}/*`]: {
          target: `http://10.15.80.24:17020`,
          // target: `http://10.33.43.58`,
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '/'
          }
        }
      },
    before: IsMockMode ? require('./mock/index.js') : () => { },
    progress: false
  },
  configureWebpack: {
    entry: isDev ? [projectThemeEntry, './src/main'] : './src/main',

    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
      }),
      new CopyWebpackPlugin([
        {
          from: 'node_modules/client-container/bin/ClientContainer.wasm',
          to: path.resolve(
            __dirname,
            process.env.VUE_APP_OUTPUT + '/static/js/ClientContainer.wasm'
          ),
          force: true
        }
      ])
    ]
  },
  //vue.config.js
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/style/common.scss";`
      }
    }
  }
};

module.exports = main;
