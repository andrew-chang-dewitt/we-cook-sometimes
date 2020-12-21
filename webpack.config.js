const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
  const isProd = env ? env.production : false

  console.log('Building in ' + isProd ? 'PRODUCTION' : 'DEV')

  return {
    mode: isProd ? 'production' : 'development',

    entry: path.resolve(__dirname, 'src/index.tsx'),

    devtool: 'source-map',

    devServer: isProd
      ? {}
      : {
          contentBase: path.resolve(__dirname, 'src/'),
          hot: true,
          public: 'devtest.andrew-chang-dewitt.dev',
          historyApiFallback: {
            index: '/index.html',
          },
          port: process.env.PORT || 8000,
        },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.sass', '.css'],
    },

    output: {
      filename: isProd ? '[hash].min.js' : '[name].[hash].bundle.js',
      chunkFilename: isProd ? '[hash].min.js' : '[name].[hash].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProd ? '[id].[contenthash].css' : '[id].css',
      }),
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new HtmlWebpackPlugin({
        title: 'We Cook Sometimes - Recipes',
        template: isProd
          ? path.resolve(__dirname, 'src/index.prod.html')
          : path.resolve(__dirname, 'src/index.html'),
        filename: 'index.html',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: './src/static/icons.svg',
            to: 'static',
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: ['ts-loader'],
        },

        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },

        // sass support, from https://adamrackis.dev/css-modules/
        // with minor changes
        {
          test: /\.s?[a|c]ss$/i,
          oneOf: [
            // match module.sass files fist
            {
              test: /\.module\.s?[a|c]ss$/i,
              // exclude: /node_modules/,
              sideEffects: true,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: !isProd,
                    esModule: true,
                  },
                },
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: '[path][name]__[local]--[hash:base64:5]',
                      exportOnlyLocals: false,
                    },
                  },
                },
                // fix sass issues w/ url() per
                // https://github.com/KyleAMathews/typefaces/issues/199#issuecomment-686484472
                'resolve-url-loader',
                'sass-loader',
              ],
            },

            // then global style files next
            {
              // don't exclude node_modules if loading fonts using
              // typeface-* npm packages
              // exclude: /node_modules/,
              sideEffects: true,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: !isProd,
                    esModule: true,
                  },
                },
                'css-loader',
                'resolve-url-loader',
                'sass-loader',
              ],
            },
          ],
        },

        // load font files
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },

    // Don't import paths matching these externally included resources
    // avoids bundling and allows caching by browsers between builds
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  }
}
