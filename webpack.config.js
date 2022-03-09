const path = require("path");

module.exports = {
    module:{
        rules:[
            {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader'],
            }
        ]
    },
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    watch:true
}