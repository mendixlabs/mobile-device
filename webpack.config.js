const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const widgetConfig = {
    entry: {
        DeviceIdWidget: "./src/DeviceIdWidget/widget/DeviceIdWidget.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/DeviceIdWidget/widget/DeviceIdWidget.js",
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js" ],
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
        externals: [
        "react",
        "react-dom",
        "mxui/widget/_WidgetBase",
        "dojo/_base/declare",
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/dom-class",
        "dojo/dom-style"
    ],
    plugins: [
        new CleanWebpackPlugin("dist/tmp"),
        new CopyWebpackPlugin([
            { from: "src/**/*.xml" },
        ], { copyUnmodified: true }),
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};

const previewConfig = {
    entry: "./src/DeviceIdWidget/widget/DeviceIdWidget.webmodeler.ts",
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: "src/DeviceIdWidget/widget/DeviceIdWidget.webmodeler.js",
        libraryTarget: "commonjs"
    },
    resolve: {
        extensions: [ ".ts", ".js" ]
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
