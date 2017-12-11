const pkg = require('./package.json'),
  path = require('path'),
  {
        DefinePlugin,
    ProvidePlugin,
    optimize: { UglifyJsPlugin },
    LoaderOptionsPlugin
    } = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MinifyPlugin = require('babel-minify-webpack-plugin')

module.exports = {
  entry: {
    login: ['./src/app/common.js', './src/app/login.js'],
    wxwall: ['./src/app/common.js', './src/app/wxwall.js'],
    check: ['./src/app/common.js', './src/app/check.js'],
    lottery: ['./src/app/common.js', './src/app/lottery/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash:8].js'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.(less|css)$/,
      loader: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: pkg.theme
          }
        }]
      })
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['env', 'react', 'stage-2']
      }
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader',
        options: {
          interpolate: 'require'
        }
      }],
    }, {
      test: /\.(png|jpg|ico|eot|svg|ttf|woff|woff2)$/,
      use: [{
        loader: 'url-loader',
        query: {
          name: '[name].[hash:8].[ext]',
          limit: 1000,
          publicPath: '.',
          outputPath: './assets/',
        }
      }]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    host: '0.0.0.0',
    hot: true,
    inline: true
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new LoaderOptionsPlugin(),
    new UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true,
        collapse_vars: true,
        reduce_vars: true,
      }
    }),
    new MinifyPlugin(),
    new ExtractTextPlugin({
      filename: 'css/[name].[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['login'],
      filename: 'index.html',
      template: './src/views/login.html'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['wxwall'],
      filename: 'wxwall/index.html',
      template: './src/views/wxwall.html'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['check'],
      filename: 'check/index.html',
      template: './src/views/check.html'
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      chunks: ['lottery'],
      filename: 'lottery/index.html',
      template: './src/views/lottery.html'
    })
  ]
}
