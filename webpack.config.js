const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  // getting host as an environment variable:
  // https://webpack.js.org/guides/environment-variables/
  const host = env.host

  const sassLoader = {
    loader: 'sass-loader',
    options: {
      implementation: require('dart-sass'),
      sassOptions: {
        fiber: require('fiber'),
      },
    },
  }

  return {
    mode: 'development',

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
        filename: '[name]-[contenthash].css',
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
          test: /\.s[ac]ss$/i,
          oneOf: [
            // match module.sass/scss files fist
            {
              test: /\.module.\.s[ac]ss$/i,
              use: [
                MiniCssExtractPlugin,
                {
                  loader: 'css-loader',
                  options: { modules: true, exportOnlyLocals: false },
                },
                sassLoader,
              ],
            },

            // then global sass/scss files next
            {
              test: /\.module.\.s[ac]ss$/i,
              use: [MiniCssExtractPlugin.loader, 'css-loader', sassLoader],
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
