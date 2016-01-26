require('babel-polyfill');

var path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: client('index.js'),
    output: {
        path: 'dist',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-decorators-legacy']
                }
            },
            {test: /\.css$/, loader: ExtractTextPlugin.extract('css')},
            {test: /\.(woff|woff2|ttf|eot|svg)$/, loader: 'file?name=font/[name].[ext]'}
        ]
    },
    plugins: [
        new ExtractTextPlugin('app.css'),
        new HtmlWebpackPlugin({
            template: client('index.html'),
            inject: 'body'
        })
    ]
};

function client(fileName) {
    return path.join(__dirname, 'src', fileName);
}
