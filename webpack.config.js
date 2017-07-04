var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

process.traceDeprecation = true;

module.exports = {
    entry: {
        heatmapHighcharts: ['babel-polyfill', 'whatwg-fetch', './src/Main.js'],
        experimentPicker: ['babel-polyfill', 'whatwg-fetch', 'react-hot-loader/patch', './html/index.js'],
        dependencies: ['color', 'downloadjs', 'he', 'highcharts', 'highcharts-custom-events', 'lodash', 'object-hash',
            'rc-slider', 'react', 'react-bootstrap', 'react-dom', 'react-highcharts', 'react-refetch', 'urijs']
    },

    resolve: {
        alias: {
            "react": path.resolve('./node_modules/react'),
            "react-dom": path.resolve('./node_modules/react-dom')
        }
    },

    output: {
        library: '[name]',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/dist/'
    },

    plugins: [
        new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'dependencies',
            filename: 'vendorCommons.bundle.js',
            minChunks: Infinity     // Explicit definition-based split, see dependencies entry
        }),
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally, necessary along with devServer.hot: true (see below) for HMR to work as expected 🤔
        new webpack.NamedModulesPlugin()
        // prints more readable module names in the browser console on HMR updates
    ],

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules:false
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules:false
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: '[hash].[ext]',
                                hash: 'sha512',
                                digest: 'hex'
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                bypassOnDebug: true,
                                mozjpeg: {
                                    progressive: true,
                                },
                                gifsicle: {
                                    interlaced: true,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: '[hash].[ext]',
                                hash: 'sha512',
                                digest: 'hex'
                            }
                        }
                    }
                ]
            },
            // Don’t use .babelrc, we need a different config for JSX and JS files because babel-preset-react breaks
            // some syntax in heatmapAxisCategories, specifically Array.map(condition ? e => ... : e => ...)
            // https://discuss.babeljs.io/t/babel-preset-react-breaks-conditional-map-of-arrays-when-combined-with-latest-env-or-es2015
            {
                test: /\.js$/,
                // Place after node_modules packages owned by Expression Atlas to be transpiled, as they aren’t
                // distributed pre-bundled or with a dist kind of folder
                exclude: /node_modules\/(?!(expression-atlas|anatomogram|react-ebi-species))/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', ['env', {modules: false}]],
                            plugins: ['transform-object-rest-spread', 'react-hot-loader/babel']
                        }
                    }
                ]
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules\/(?!(expression-atlas|anatomogram|react-ebi-species))/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react', ['env', {modules: false}]],
                            plugins: ['react-hot-loader/babel']
                        }
                    }
                ]
            }
        ]
    },

    devServer: {
        hot: true,      // CLI --hot is equivalent to this option, but it also enables the HMR plugin (see above)
        hotOnly: true,  // Won’t inject modules if there’s a compilation error (without this a full page reload is
                        // done after a successful build and we lose state)
        port: 9000
    }
};
