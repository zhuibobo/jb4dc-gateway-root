const path = require('path');
/*const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin } = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')*/
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {VueLoaderPlugin} = require('vue-loader/dist/index')
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

config = {
    // JavaScript 执行入口文件1
    devtool: 'source-map',
    entry: {
        /*"editTableSelectDefaultValue": './EditTable/Renderers/EditTable_SelectDefaultValue.js',*/
        "UIDesignMain": './src/Design/UIDesignMain.js',
        "WebListRuntimeMain": './src/Runtime/WebListRuntime/WebListRuntimeMain.js',
        "WebFormRuntimeMain": './src/Runtime/WebFormRuntime/WebFormRuntimeForVueMain.js'
    },
    context: path.resolve(__dirname, ""),
    output: {
        // 把所有依赖的模块合并输出到一个 bundle.js 文件
        //filename: '[name].[hash].js',
        filename: '[name].js',
        // 输出文件都放到 dist 目录下
        //path: path.resolve(__dirname, './dist'),
        path: path.resolve(__dirname, '../resources/static/JB4DCBuilder/HTML/UIDesign'),
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
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            }, {
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
        ]
    },
    plugins: [
        new CleanWebpackPlugin(
            {
                cleanAfterEveryBuildPatterns: ['**/*.js', '**/*.css', '!**/Images/**', '!**/bpmn-font/**', '!**/diagram-js.css'],
            }
        ),
        new HtmlWebpackPlugin({
            title: 'DesignMain',
            template: path.resolve(__dirname, './src/DesignMainTemplate.html'), // template file
            filename: 'UIDesignMain.html', // output file
            chunks: ['UIDesignMain']
        }),
        new HtmlWebpackPlugin({
            title: 'RuntimeWebList',
            template: path.resolve(__dirname, './src/RuntimeWebListMainTemplate.html'), // template file
            filename: 'UIRuntimeWebListMain.html', // output file
            chunks: ['WebListRuntimeMain']
        }),
        new HtmlWebpackPlugin({
            title: 'RuntimeWebForm',
            template: path.resolve(__dirname, './src/RuntimeWebFormMainTemplate.html'), // template file
            filename: 'UIRuntimeWebFormMain.html', // output file
            chunks: ['WebFormRuntimeMain']
        }),
        // 添加 VueLoaderPlugin 插件
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            //filename: "[name].[hash].css",
            //chunkFilename: "[id].[hash].css"
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/Externals", to: "Externals"},
                {from: "./src/Less/Images", to: "Images"}
            ],
        }),
        new MonacoWebpackPlugin(),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: true,
        })
        //new webpack.HotModuleReplacementPlugin(),
    ],
    externals: {
        // 后面是原本使用的全局变量名，前面的是引入的包名（就是import xx from 'echart'），然后我们实际写代码时候，用的是xx这个变量名。
        "jquery": 'jQuery',
        "jquery-ui": 'jQuery-UI'
    },
    devServer: {
        historyApiFallback: true,
        static: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8881,
        open: ['/UIDesignMain.html?op=update&uiDesignType=webListDesign&moduleId=b6641464-e55f-4d1c-afea-400769f6f6a3&recordId=8318f6ec-3c94-4e6f-b561-76c881f35899&timestamp=1647655263616'],
        //open: ['/UIDesignMain.html?uiDesignType=webFormDesign']
        //open: ['/UIRuntimeWebListMain.html']
        //open: ['/UIRuntimeWebFormMain.html?formId=4823f225-cfd2-4fea-b6ef-1e716549bdca&buttonId=737c1573-8ff7-456b-9435-78e2693fdefa-form_button_738049072&listFormButtonElemId=form_button_738049072&recordId=&operationType=add&windowWidth=1124&windowHeight=768&menuRightUrlPara=&timestamp=1650781106947']
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
    },
};


module.exports = [
    config
]