var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

process.traceDeprecation = true;

module.exports = {
    entry: {
        heatmapHighcharts: ['babel-polyfill', 'whatwg-fetch', './src/Main.js'],
        experimentPicker: ['babel-polyfill', 'whatwg-fetch', './html/ExperimentPicker.js'],
        dependencies: ['color', 'downloadjs', 'he', 'highcharts', 'highcharts-custom-events', 'lodash', 'object-hash',
            'rc-slider', 'react', 'react-bootstrap', 'react-dom', 'react-highcharts', 'react-refetch', 'urijs']
    },

    output: {
        library: '[name]',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/html/'
    },

    plugins: [
        new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'dependencies',
            filename: 'vendorCommons.bundle.js',
            minChunks: Infinity     // Explicit definition-based split, see dependencies entry
        })
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
                                    progressive: true
                                },
                                gifsicle: {
                                    interlaced: true
                                },
                                optipng: {
                                    optimizationLevel: 7
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
            {
                test: /\.js$/,
                // Place after node_modules packages owned by Expression Atlas to be transpiled, as they aren’t
                // distributed pre-bundled or with a dist kind of folder
                exclude: /node_modules\//,
                use: 'babel-loader'
            }
        ]
    },

    devServer: {
        port: 9000
    }
};
