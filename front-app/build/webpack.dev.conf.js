/* eslint-disable no-unused-vars */
const path = require('path')
const rootPath = path.resolve(__dirname, '..')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const portfinder = require('portfinder')
const packageConfig = require('../package.json')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const NodeNotifier = require('node-notifier')
const ip = require('ip')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webappJson = require(path.join(rootPath, 'src/config/webApp.json'))
const CopyPlugin = require('copy-webpack-plugin')

const spritesmithTemplateFunc = (data) => data.sprites.map(sprite => `.icon-${sprite.name} {display:inline-block; background-image:url(${data.sprites[0].image}); background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px; width:${sprite.width}px; height:${sprite.height}px; background-position:${sprite.offset_x}px ${sprite.offset_y}px}`).join('\n')

const devWebpackConfig = {
  mode: 'development',
  target: 'web',
  entry: [path.resolve(rootPath, 'src/main.js')],
  output: {
    path: path.resolve(rootPath, `webapp_${webappJson.h5packCode}`),
    filename: 'static/js/[name].bundle.js',
    publicPath: '/'
  },
  
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: ['node_modules', path.resolve(rootPath, 'src/assets/icons')],
    alias: {
      '@': rootPath,
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [path.resolve(rootPath, 'src')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter'),
      //     emitWarning: false
      //   }
      // },
      {
        test: /\.js$/,
        include: [path.resolve(rootPath, 'src')],
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          esModule: false,
          name: path.posix.join('static', 'img/[name]_[hash:16].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          esModule: false,
          name: path.posix.join('static', 'media/[name]_[hash:16].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          esModule: false,
          name: path.posix.join('static', 'fonts/[name]_[hash:16].[ext]')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // new webpack.EnvironmentPlugin({
    //   NODE_ENV: 'dev'
    // }),
    new CopyPlugin({
      patterns: [
        { from: path.join(rootPath, 'src/config/webApp.json'), to: '' },
        { from: path.join(rootPath, 'src/corejs/pageRouter.json'), to: '' },
        { from: path.join(rootPath, 'src/corejs/hmap.js'), to: '' }
      ]
    }),
    new StylelintPlugin({
      configFile: path.resolve(rootPath, '.stylelintrc.json'),
      cache: true,
      files: [
        '**/*.css',
        '**/*.scss',
        '**/*.html',
        '**/*.js',
        '**/*.vue'
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(rootPath, 'src/html.tmpl'),
      favicon: path.resolve(rootPath, 'src/logo.ico'),
      inject: true
    }),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(rootPath, 'src/assets/icons'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(rootPath, 'src/assets/images/sprite.png'),
        css: [[path.resolve(rootPath, 'src/assets/styles/sprite.css'), { format: 'function_based_template' }]]
      },
      customTemplates: {
        function_based_template: spritesmithTemplateFunc
      },
      apiOptions: { cssImageRef: path.resolve(rootPath, 'src/assets/images/sprite.png') }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin()
  ],
  performance: {
    hints: false
  },
  stats: 'none',
  devServer: {
    contentBase: path.resolve(rootPath, `webapp_${webappJson.h5packCode}/index.html`),
    clientLogLevel: 'warning',
    host: '0.0.0.0',
    hot: true,
    inline: true,
    compress: true,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    open: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    port: 7777,
    quiet: true,
    historyApiFallback: true,
    proxy: {
      '/webapi/hatom': {
        target: 'https://openweb.com',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    }
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = devWebpackConfig.devServer.port
  portfinder.getPortPromise().then((port) => {
    devWebpackConfig.devServer.port = port
    devWebpackConfig.plugins.push(new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: ${devWebpackConfig.devServer.https ? 'https' : 'http'}://${ip.address()}:${port}`]
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()
        NodeNotifier.notify({
          title: packageConfig.name,
          message: `${severity}: ${error.name}`,
          subtitle: filename || '',
          icon: path.resolve(rootPath, 'src/logo.ico')
        })
      }
    }))
    resolve(devWebpackConfig)
  }).catch((err) => reject(err))
})
