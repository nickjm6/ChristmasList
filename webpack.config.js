module.exports = () => {
    return {
        entry: "./react/App.js",
        output: {
            path: __dirname + "/frontend/javascript",
            filename: "index.js"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader"
                    ]
                }
            ]
        }
    }
}