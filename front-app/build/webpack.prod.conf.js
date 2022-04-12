/* eslint-disable no-unused-vars */
const path = require('path')
const rootPath = path.resolve(__dirname, '..')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webappJson = require(path.join(rootPath, 'src/config/webApp.json'))
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const os = require('os')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const spritesmithTemplateFunc = (data) => data.sprites.map(sprite => `.icon-${sprite.name} {display:inline-block; background-image:url(${data.sprites[0].image}); background-size: ${data.spritesheet.width}px ${data.spritesheet.height}px; width:${sprite.width}px; height:${sprite.height}px; background-position:${sprite.offset_x}px ${sprite.offset_y}px}`).join('\n')

module.exports = {
  mode: 'production',
  entry: [path.resolve(rootPath, 'src/main.js')],
  output: {
    filename: 'static/js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(rootPath, `webapp_${webappJson.h5packCode}/webapp_${webappJson.h5packCode}`),
    publicPath: ''
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.scss'],
    modules: ['node_modules', path.resolve(rootPath, 'src/assets/icons')],
    alias: {
      '@': rootPath,
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  devtool: false,
  module: {
    rules: [
      // {
      //   test: /\.(js|vue)$/,
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
        use: [{
          loader: miniCssExtractPlugin.loader,
          options: {
            publicPath: '../../'
          }
        }, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: [{
          loader: miniCssExtractPlugin.loader,
          options: {
            publicPath: '../../'
          }
        }, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.styl$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader']
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
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: os.cpus().length - 1
      }),
      new TerserPlugin({
        parallel: os.cpus().length - 1
      })
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new webpack.EnvironmentPlugin({
    //   NODE_ENV: 'prod'
    // }),
    new CopyPlugin({
      patterns: [
        { from: path.join(rootPath, 'src/config/webApp.json'), to: '' },
        { from: path.join(rootPath, 'src/corejs/pageRouter.json'), to: '' },
        { from: path.join(rootPath, 'src/corejs/hmap.js'), to: '' },
        { from: path.join(rootPath, 'output/alarm-default.png'), to: '' },
        { from: path.join(rootPath, 'output/alarm-select.png'), to: '' },
        { from: path.join(rootPath, 'output/alarm-unselect.png'), to: '' },
        { from: path.join(rootPath, 'output/dealAlarm-default.png'), to: '' },
        { from: path.join(rootPath, 'output/dealAlarm-select.png'), to: '' },
        { from: path.join(rootPath, 'output/dealAlarm-unselect.png'), to: '' },
        { from: path.join(rootPath, 'output/message-default.png'), to: '' },
        { from: path.join(rootPath, 'output/message-select.png'), to: '' },
        { from: path.join(rootPath, 'output/message-unselect.png'), to: '' },
        { from: path.join(rootPath, 'output/myself-default.png'), to: '' },
        { from: path.join(rootPath, 'output/myself-select.png'), to: '' },
        { from: path.join(rootPath, 'output/myself-unselect.png'), to: '' }
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
    new CleanWebpackPlugin(),
    // eslint-disable-next-line new-cap
    new miniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash:32].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(rootPath, 'src/html.tmpl'),
      favicon: path.resolve(rootPath, 'src/logo.ico')
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
    new VueLoaderPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          archive: [
            {
              source: path.resolve(rootPath, `webapp_${webappJson.h5packCode}`),
              destination: path.resolve(rootPath, `webapp_${webappJson.h5packCode}.zip`)
            }
          ],
          delete: [path.resolve(rootPath, `webapp_${webappJson.h5packCode}`)]
        }
      }
    })
  ],
  performance: {
    hints: false
  },
  stats: {
    timings: true
  }
}
