const packageName = require('./package.json').name;
const path = require("path");
const DeadCodePlugin = require('./DefinedWebpackPlugins/DeadCodePlugin.js/index.js');
const { UnusedFilesWebpackPlugin } = require('webpack-unused-plugin');
const {FileListPlugin} = require("./FileListPlugin.js")
const FileSizePlugin = require('./FileSizePlugin');
module.exports = {
  webpack: {
    configure: (webpackConfig, {paths}) => {
      webpackConfig.output = {
        library: `${packageName}-[name]`,
        libraryTarget: 'umd',
        chunkLoadingGlobal: `webpackJsonp_${packageName}`,
        globalObject: "window",
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].js",
      }
      // webpackConfig.plugins.push(new UnusedFilesWebpackPlugin())
      return webpackConfig;
    },
    // plugins: [
    //   new UnusedFilesWebpackPlugin()
    // ]
    plugins: [
      new DeadCodePlugin({
        patterns: ["src/**/*.*"], // 需要检测的范围
        exclude: ["node_modules/**/*"], // 排除检测的范围
      },),
      new FileListPlugin({
        outputFile: 'my-assets.md',
      }),
      new FileSizePlugin(),
    ]
  },


  devServer: {
    https: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: false,
    hot: true, // hmr
    liveReload: false,
  },
};
