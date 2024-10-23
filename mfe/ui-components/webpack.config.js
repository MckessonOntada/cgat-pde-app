
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'mfe-ui-components',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/, // Font file types
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext]", // Ensure fonts are stored in the assets/fonts folder
        },
      },
      {
        test: /\.(css|sass|scss)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[name]--[local]--[hash:base64:10]",
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
};
