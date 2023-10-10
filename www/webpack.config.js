const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  entry: "./bootstrap.js",
  experiments: {
    asyncWebAssembly: true
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  mode: "development",
  plugins: [
    new MonacoWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './index.html' }
      ]
    })
  ],
};