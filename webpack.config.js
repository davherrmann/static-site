const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: '[name].[chunkHash].js',
    path: './dist',
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
