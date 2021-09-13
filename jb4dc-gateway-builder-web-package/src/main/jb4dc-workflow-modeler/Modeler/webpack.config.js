const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack');

config = {
    // JavaScript 执行入口文件1
    entry: {
        /*"editTableSelectDefaultValue": './EditTable/Renderers/EditTable_SelectDefaultValue.js',*/
        "ModelerDesign": './ModelerDesign.js',
        "ModelerView":"./ModelerView"
    },
    context: path.resolve(__dirname, ""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        //filename: '[name].[hash].js',
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, '../../resources/static/JB4DCBuilder/HTML/WorkFlow/Modeler'),
        //path: path.resolve(__dirname, './dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                            publicPath: ""
                        }
                    }, {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    }, {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    }]
            },
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it use publicPath in webpackOptions.output
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                loader: "file-loader",
                options: {
                    outputPath: 'Images',
                    name: '[name].[ext]'
                }
            },
            {
                test: /\CustTdRenderer\.js$/,
                use: [ 'script-loader' ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin (
            {
                cleanAfterEveryBuildPatterns: ['**/*.js','**/*.css','!**/Images/**','!**/bpmn-font/**','!**/diagram-js.css'],
            }
        ),
        new CopyWebpackPlugin([
            { from: '**/bpmn-font/*/*.*',context: 'Less', to: ''},
            { from: '**/diagram-js.css',context: 'Less', to: ''}
        ]),
        new HtmlWebpackPlugin({
            filename: "ModelerDesign.html",
            template: './Template.html',
            chunks:['ModelerDesign']
        }),
        new HtmlWebpackPlugin({
            filename: "ModelerView.html",
            template: './ModelerView.html',
            chunks:['ModelerView']
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            //filename: "[name].[hash].css",
            //chunkFilename: "[id].[hash].css"
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new VueLoaderPlugin()/*,
        new webpack.ProvidePlugin({
            EditTable_SelectDefaultValue1: ['./EditTable/Renderers/EditTable_SelectDefaultValue.js']
        })*/
    ],
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery',
        "bpmn-js": "BpmnJS",
        "Vue": "Vue"
    }
};

workFlowModelerClientConfig = Object.assign({}, config, {
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        //filename: '[name].[hash].js',
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        path: path.resolve(__dirname, '../../../../../jb4dc-gateway-builder-client-web-package/src/main/resources/static/JB4DCBuilderClient/Js/WorkFlowModelerClient'),
        //path: path.resolve(__dirname, './dist'),
    }
});

module.exports=[
    config,workFlowModelerClientConfig
]