module.exports = {
    mode: 'production',
    entry: {
        index: './src/js/index.js'
    },
    output: {
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}