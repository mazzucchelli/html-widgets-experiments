const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    main: `${path.resolve(__dirname, "example/js")}/index.ts`,
  },
  // devtool: "inline-source-map",
  // stats: "minimal",
  // watch: false,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              modules: false,
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      RH: path.resolve(__dirname, "example/js/components"),
    },
  },
  devServer: {
    compress: true,
    hot: true,
    port: 3000,
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "build"),
    filename: `[name].js`,
    chunkFilename: `[chunkhash:6].chunk.js`,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlWebPackPlugin({
      template: "./example/index.html",
      filename: "./index.html",
    }),
  ],
};
