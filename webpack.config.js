const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylelintWebpackPlugin = require("stylelint-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env) => {
  const isProduction = env.production || false;

  return {
    mode: isProduction ? "production" : "development",
    devtool: "eval-cheap-module-source-map",
    entry: path.resolve(__dirname, "./index"),
    output: {
      clean: true,
      filename: "[name].[contenthash:8].js",
      path: path.resolve(__dirname, "dist"),
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.(?:js|ts|mjs|cjs|jsx|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [require("autoprefixer")],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          use: "asset/resource",
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
      }),
      new StylelintWebpackPlugin(),
    ],
    devServer: {
      port: 9527,
      static: "./dist", // 设置静态资源文件夹
      open: false,
    },
    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [
        // 添加 css 压缩配置
        new CssMinimizerPlugin(),
      ],
      chunkIds: "deterministic",
      runtimeChunk: true,
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
