const path = require('path');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
require('dotenv').config();
const deps = require('./package.json').dependencies;

const APP_PUBLIC_PATH = process.env.REACT_APP_PUBLIC_PATH;

module.exports = {
  entry: {
    remote: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        },
        resolve: {
          extensions: ['.js', '.jsx']
        }
      },
      {
        test: /\.(css|sass|scss)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[name]--[local]--[hash:base64:10]'
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|jpg|gif)$/i,
        use: ['file-loader']
      },
      {
        test: /\.(svg|png)$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack', 'file-loader']
      }
    ]
  },
  name: 'cgatPdeContainer',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: APP_PUBLIC_PATH
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/templates/index.html',
      favicon: './public/favicon.png'
    }),
    new ModuleFederationPlugin({
      name: 'cgatPdeContainer',
      filename: 'remoteEntry.js',
      remotes: {
        cgatPdeContainer: `cgatPdeContainer@${APP_PUBLIC_PATH}remoteEntry.js`
      },
      exposes: {
        './store': './src/store/contextStore'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom']
        },
        '@emotion/react': {
          singleton: true,
          requiredVersion: false
        },
        'react-router-dom': {
          requiredVersion: deps['react-router-dom'],
          singleton: true
        },
        '@mckesson/mcp-component-library': {
          requiredVersion: deps['@mckesson/mcp-component-library'],
          singleton: true
        }
      }
    }),
    new webpack.ProvidePlugin({ process: 'process/browser.js' }),
    new webpack.DefinePlugin({
      __CURRENT_ENV__: JSON.stringify(process.env.REACT_APP_ENVIRONMENT),
      __MAIN_BASE_URL__: JSON.stringify(process.env.REACT_APP_PUBLIC_PATH),
      __USERMANAGEMENT_SERVICE_BASE_URL__: JSON.stringify(
        process.env.REACT_APP_USERMANAGEMENT_SERVICE_BASE_URL
      ),
      __DATA_ABSTRACTION_SERVICE_BASE_URL__: JSON.stringify(
        process.env.REACT_APP_DATA_ABSTRACTION_SERVICE_BASE_URL
      ),
      __INACTIVITY_TIMEOUT__: process.env.REACT_APP_INACTIVITY_TIMEOUT,
      __SERVICE_NOW_URL__: JSON.stringify(process.env.REACT_APP_SERVICE_NOW_URL),
      __SERVICE_NOW_IT_SUPPORT_URL__: JSON.stringify(
        process.env.REACT_APP_SERVICE_NOW_IT_SUPPORT_URL
      ),
      __IKM_BASE_URL__: JSON.stringify(process.env.REACT_APP_IKM_BASE_URL),
      __STUDY_MANAGEMENT_SERVICE_BASE_URL__: JSON.stringify(
        process.env.REACT_APP_STUDY_MANAGEMENT_SERVICE_BASE_URL
      ),
      __CONTENT_SERVICE_BASE_URL__: JSON.stringify(process.env.REACT_APP_CONTENT_SERVICE_BASE_URL),
      __IPV_VIEWER_URL__: JSON.stringify(process.env.IPV_VIEWER_URL)
    }),
    new Dotenv()
    // Uncomment to run the Bundle Analyzer
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src/')
    }
  }
};
