const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => {
  const isProd = env ? env.production : false

  return {
    mode: isProd ? 'production' : 'development',

    // enable sourcemaps for debugging
    devtool: 'source-map',

    devServer: {
      contentBase: './src/',
      compress: true,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.sass', '.css'],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: isProd ? '[id].[contenthash].css' : '[id].css',
      }),
      new HtmlWebpackPlugin({
        title: 'We Cook Sometimes - Recipes',
        template: './src/index.html',
        filename: 'index.html',
      }),
    ],

    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [{ loader: 'ts-loader' }],
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
              exclude: /node_modules/,
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
                'sass-loader',
              ],
            },

            // then global sass files next
            {
              exclude: /node_modules/,
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
                'sass-loader',
              ],
            },
          ],
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
