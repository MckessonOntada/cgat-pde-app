const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  ignoreWarnings: [
    (warning) => {
      const msg = warning.message;
      return msg.includes('Sass');
    }
  ],
  devServer: {
    allowedHosts: 'all',
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    webSocketServer: false,
    hot: true
  },
  devtool: 'inline-source-map'
});
