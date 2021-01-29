require("babel-polyfill")
module.exports = {
    mode: 'development',
    entry: {
        index: ['babel-polyfill', './src/js/index.ts']
    },
    output: {
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        plugins: ['@babel/plugin-proposal-class-properties', 'transform-regenerator']
                    }
                }
            }
        ]
    }
}