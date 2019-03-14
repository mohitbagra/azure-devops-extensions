const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        App: "./src/Apps/ExamplesApp/scripts/App.tsx"
    },
    optimization: {
        splitChunks: {
            minSize: 0,
            maxInitialRequests: 5,
            cacheGroups: {
                default: false,
                vendors: false,
                ui: {
                    test: /[\\/]node_modules[\\/](azure-devops-ui|office-ui-fabric-react)[\\/]/,
                    name: "ui",
                    chunks: "all"
                },
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                    name: "react",
                    chunks: "all",
                    priority: -10
                },
                redux: {
                    test: /[\\/]node_modules[\\/](redux|react-redux|reselect|immer|redux-dynamic-modules)[\\/]/,
                    name: "redux",
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "3rdParty/es6-promise.min.js" },

            { from: "./src/Apps/ExamplesApp/images", to: "images" },
            { from: "./src/Apps/ExamplesApp/html", to: "html" },
            { from: "./src/Apps/ExamplesApp/vss-extension.json", to: "vss-extension.json" },
            { from: "./src/Apps/ExamplesApp/README.md", to: "README.md" }
        ])
    ]
};
