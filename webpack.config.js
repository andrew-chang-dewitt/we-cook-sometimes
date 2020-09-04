const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  // getting host as an environment variable:
  // https://webpack.js.org/guides/environment-variables/
  const host = env.host
  const isProd = env.production

  return {
    mode: env.production ? 'production' : 'development',

    // enable sourcemaps for debugging
    devtool: 'source-map',

    devServer: {
      contentBase: './src/',
      compress: true,
      // public property required to allow to serve website on external
      // host: https://stackoverflow.com/a/43621275/4642869
      public: host,
    },

    resolve: {
      extensions: ['.ts', '.tsx'],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? '[name]-[contenthash].css' : '[name].css',
        chunkFilename: isProd ? '[id]-[contenthash].css' : '[id].css',
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
          test: /\.sass$/i,
          oneOf: [
            // match module.sass files fist
            {
              test: /\.module.\.sass$/i,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: !isProd,
                  },
                },
                {
                  loader: 'css-loader',
                  options: { modules: true },
                },
                {
                  loader: 'sass-loader',
                  options: {
                    // implementation: require('sass'),
                    sassOptions: {
                      fiber: require('fiber'),
                    },
                  },
                },
              ],
            },

            // then global sass files next
            {
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: !isProd,
                  },
                },
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    // implementation: require('sass'),
                    sassOptions: {
                      fiber: require('fiber'),
                    },
                  },
                },
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
