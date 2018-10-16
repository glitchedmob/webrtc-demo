const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

console.log(process.env.NODE_ENV);

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './client/src/js/main.js',
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: '[name].[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({template: './client/src/index.html'}),
        new CleanWebpackPlugin('client/dist', {
            exclude: ['.gitkeep', 'index.html'],
            beforeEmit: true
        })
    ]
};