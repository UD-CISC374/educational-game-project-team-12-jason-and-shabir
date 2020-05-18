const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const package = require('../package.json');

module.exports = {
  entry: ['./src/scripts/game.ts'],
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.ttf']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, include: path.join(__dirname, '../src'), use: 'ts-loader' },
      { test: /\.css$/, include: [path.join(__dirname, '../src/css'), 
        path.join(__dirname, '../node_modules/codemirror/lib'),
        path.join(__dirname, '../node_modules/codemirror/theme'),
        path.join(__dirname, '../node_modules/codemirror/addon/hint')], 
        use: ['style-loader', 'css-loader'] },
      { test: /\.ttf$/, use: 'ttf-loader' }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          filename: '[name].bundle.js'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ gameName: package.game.name, template: 'src/index.html' }),
    new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets' },
      { from: 'config/pwa', to: '' },
      { from: 'src/assets/icons/favicon.ico', to: '' }
    ]),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'pwa/sw.js')
    })
  ]
};