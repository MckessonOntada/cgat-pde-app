const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'mfe-user-management',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(css|sass|scss)$/i,
        use: [
          "style-loader",
          "css-loader",
          // {
          //   loader: "",
          //   options: {
          //     modules: {
          //       auto: true,
          //       localIdentName: "[name]--[local]--[hash:base64:10]",
          //     },
          //   },
          // },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};