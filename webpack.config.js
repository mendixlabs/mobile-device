const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const widgetConfig = {
    entry: {
        MobileDevice: "./src/MobileDevice/widget/MobileDevice.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/MobileDevice/widget/MobileDevice.js",
        libraryTarget: "amd"
    },
    resolve: {
        extensions: [ ".ts" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" }
        ]
    },
    devtool: "source-map",
    externals: [ "react", "react-dom", /^mxui\/|^mendix\/|^dojo\/|^dijit\// ],
    plugins: [
        new CleanWebpackPlugin("dist/tmp"),
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" },
        ], { copyUnmodified: true }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    entry: "./src/MobileDevice/widget/MobileDevice.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/MobileDevice/widget/MobileDevice.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts" ]
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
        ]
    },
    devtool: "inline-source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

module.exports = [ widgetConfig, previewConfig ];
