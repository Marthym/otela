'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const marked = require("marked");
const fs = require('fs');

const directory = path.resolve(__dirname);

module.exports =  {
  entry: {
    'otel-analytics': 'src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'otelAnalytics',
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(directory),
      'node_modules',
    ],
    extensions: ['.ts', '.js', '.jsx', '.json'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            unused: true,
            dead_code: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/index.html',
      title: 'OTEL Analytics',
      bodyHTML: marked.parse(fs.readFileSync(path.join(__dirname, 'assets/index.md'), 'utf-8')),
    })
  ]
};
