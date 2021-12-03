const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageJSON = require('./package.json');
const manifestJSON = require('./manifest.json');

manifestJSON.name = packageJSON.shortdescription;
manifestJSON.description = packageJSON.description;
manifestJSON.version = packageJSON.version;
manifestJSON.author = packageJSON.author;

fs.writeFileSync('./ext/manifest.json', JSON.stringify(manifestJSON, undefined, 2));

module.exports = {
  mode: 'none',
  entry: {
    "background": __dirname + '/src/background.ts',
    "config": __dirname + '/src/config.ts',
    "vivocha-extension": __dirname + '/src/vivocha-extension.ts'
  },
  output: {
    path: __dirname + '/ext',
    filename: '[name].js'
  },
  devtool: "source-map",
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/config.html',
      filename: './config.html',
      inject: false,
      title: packageJSON.shortdescription
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        exclude: /node_modules/,
        enforce: "pre"
      }
    ]
  }
};