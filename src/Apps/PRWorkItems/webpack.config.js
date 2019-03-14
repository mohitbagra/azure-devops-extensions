const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        App: "./src/Apps/PRWorkItems/scripts/App.ts"
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./node_modules/es6-promise/dist/es6-promise.min.js", to: "3rdParty/es6-promise.min.js" },

            { from: "./src/Apps/PRWorkItems/images", to: "images" },
            { from: "./src/Apps/PRWorkItems/html", to: "html" },
            { from: "./src/Apps/PRWorkItems/vss-extension.json", to: "vss-extension.json" },
            { from: "./src/Apps/PRWorkItems/README.md", to: "README.md" }
        ])
    ]
};
