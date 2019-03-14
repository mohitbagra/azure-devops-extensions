const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const { existsSync } = require("fs");
const appName = require("./configs/App");

if (!appName) {
    throw "no app name provided";
}

console.log(`Selected app: ${appName}`);

let appConfig;
const appPath = path.resolve(__dirname, `src/Apps/${appName}`);
if (existsSync(appPath)) {
    console.log(`App "${appName}" found.`);
    const configPath = path.resolve(__dirname, `src/Apps/${appName}/webpack.config.js`);
    if (existsSync(configPath)) {
        appConfig = require(configPath);
    } else {
        throw `No config found for App "${appName}".`;
    }
} else {
    throw `App "${appName}" not found.`;
}

module.exports = (env, argv) => {
    const plugins =
        argv.mode === "production"
            ? [
                  new webpack.DefinePlugin({
                      "process.env.NODE_ENV": JSON.stringify("production")
                  })
              ]
            : [];

    const defaultConfig = {
        target: "web",
        output: {
            publicPath: argv.mode === "production" ? "../" : "/",
            filename: "scripts/[name].js",
            chunkFilename: "scripts/[name].chunk.js"
        },
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
            moduleExtensions: ["-loader"],
            alias: {
                OfficeFabric: path.resolve(__dirname, "node_modules/office-ui-fabric-react/lib"),
                Common: path.resolve(__dirname, "src/Common")
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader"
                },
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                includePaths: [path.join(__dirname, "src/Common")]
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.woff$/,
                    use: [
                        {
                            loader: "base64-inline-loader"
                        }
                    ]
                }
            ]
        },
        plugins: plugins
    };

    return merge(defaultConfig, appConfig);
};
