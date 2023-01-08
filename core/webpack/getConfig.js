const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getConfig = ({ entry, html }) => {
    return (env) => {
        const isProd = env['NODE_ENV'] === 'prod';

        return {
            mode: isProd ? 'production' : 'development',

            entry: {
                ...entry,
            },
            output: {
                filename: '[name].[hash].bundle.js',
                path: path.resolve(process.cwd(), 'dist'),
                assetModuleFilename: 'assets/[hash][ext][query]',
                clean: true,
                publicPath: '/',
                // sourceMapFilename: '[name].[hash].map[query]', потом разберусь
            },

            devtool: isProd ? undefined : 'inline-source-map',

            plugins: [
                new MiniCssExtractPlugin({
                    filename: '[name].[hash].css',
                    chunkFilename: '[id].css',
                }),
                new HtmlWebpackPlugin({
                    filename: 'index.html',
                    template: path.relative(process.cwd(), html.path),
                    favicon: html.favicon,
                }),
            ],

            resolve: {
                extensions: ['.js', '.ts', '.tsx'],
            },

            module: {
                rules: [
                    {
                        test: /\.ts/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                targets: {
                                                    chrome: '58',
                                                    ie: '11',
                                                },
                                            },
                                        ],

                                        ['@babel/preset-typescript'],
                                    ],
                                },
                            },
                        ],
                        exclude: '/node_modules/',
                    },
                    {
                        test: /\.tsx/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: {
                                    presets: [
                                        [
                                            '@babel/preset-env',
                                            {
                                                targets: {
                                                    chrome: '58',
                                                    ie: '11',
                                                },
                                            },
                                        ],
                                        ['@babel/preset-react'],
                                        [
                                            '@babel/preset-typescript',
                                            {
                                                isTSX: true,
                                                allExtensions: true,
                                            },
                                        ],
                                    ],
                                },
                            },
                        ],
                        exclude: '/node_modules/',
                    },
                    {
                        test: /\.module\.s(a|c)ss$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: {
                                        localIdentName: '[folder]__[local]--[hash]',
                                        exportLocalsConvention: 'camelCaseOnly',
                                    },
                                },
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ],
                    },
                    {
                        test: /\.module\.css$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: {
                                        localIdentName: '[folder]__[local]--[hash]',
                                        exportLocalsConvention: 'camelCaseOnly',
                                    },
                                },
                            },
                        ],
                    },
                    {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader'],
                        exclude: /\.module\.css$/,
                    },
                    {
                        test: /\.(png|svg|jpg|jpeg|gif)$/i,
                        type: 'asset/resource',
                    },
                    {
                        test: /\.(woff|woff2|eot|ttf|otf)$/i,
                        type: 'asset/resource',
                    },
                ],
            },
        };
    };
};

module.exports = {
    getConfig,
};
