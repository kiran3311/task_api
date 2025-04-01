const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    resolve: {
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "assert": false,
            "url": false,
            "stream": false,
            "crypto": false,
            "buffer": false,
            "querystring": require.resolve("querystring-es3") ,
            "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
        }
    },
  
    entry: {
        app: './server.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
        }),

    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};