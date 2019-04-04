const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        App: "./src/Apps/BugBashPro/scripts/App.tsx"
    },
    resolve: {
        alias: {
            BugBashPro: path.resolve(__dirname, "./scripts")
        }
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 0,
            maxInitialRequests: Infinity,
            cacheGroups: {
                default: false,
                vendors: false,
                sdk: {
                    test: /[\\/]node_modules[\\/](azure-devops-extension-sdk)[\\/]/,
                    name: "sdk",
                    chunks: "all"
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "react",
                    chunks: "all",
                    priority: 10
                },
                redux: {
                    test: /[\\/]node_modules[\\/](redux|react-redux|redux-saga|reselect|immer|redux-dynamic-modules|redux-dynamic-modules-saga)[\\/]/,
                    name: "redux",
                    chunks: "all",
                    priority: 8
                },
                commons: {
                    name: "commons",
                    chunks: "all",
                    minChunks: 3,
                    priority: 7
                }
            }
        }
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "3rdParty/es6-promise.min.js" },

            { from: "./src/Apps/BugBashPro/images", to: "images" },
            { from: "./src/Apps/BugBashPro/html", to: "html" },
            { from: "./src/Apps/BugBashPro/vss-extension.json", to: "vss-extension.json" },
            { from: "./src/Apps/BugBashPro/README.md", to: "README.md" }
        ])
    ]
};
