const path = require(`path`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)

const commonPublicPath = `/dist/` //'/gxa/resources/js-bundles/'

module.exports = {
  entry: {
    heatmapHighcharts: ['@babel/polyfill', 'whatwg-fetch', './src/Main.js'],
    experimentPicker: ['@babel/polyfill', 'whatwg-fetch', './html/ExperimentPicker.js'],
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: `dist`
    })
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath,
    devtoolNamespace: `webpack`
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: `vendors`,
          chunks: `all`
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules\//,
        use: `babel-loader`
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: `file-loader`,
            options: { query: { name: `[hash].[ext]`, hash: `sha512`, digest: `hex` } }
          },
          {
            loader: `image-webpack-loader`,
            options: {
              query: {
                bypassOnDebug: true,
                mozjpeg: { progressive: true },
                gifsicle: { interlaced: true },
                optipng: { optimizationLevel: 7 }
              }
            }
          }
        ]
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: `file-loader`,
            options: { query: { name: `[hash].[ext]`, hash: `sha512`, digest: `hex` } }
          }
        ]
      },
    ]
  },

  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath
  }
}
