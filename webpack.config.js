const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const package = require('./package.json');

/** @type {import('webpack').Configuration} **/
module.exports = {
  target: 'node',
  // Include những file typescript, javascript trong src và node_modules
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.js'],
  },
  // Exclude node_modules, lấy ra những package dependencies
  externals: [
    webpackNodeExternals({
      modulesFromFile: true,
      // allowlist: Object.keys(package.dependencies),
    }),
  ],
  entry: { bundle: './src/index.ts' },
  module: {
    // Load file typescript react bằng ts-loader
    rules: [
      {
        test: /.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'json',
      openAnalyzer: false,
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      include: /\.js$/,
    }),
  ],
};
