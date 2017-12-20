var path = require("path")
var webpack = require("webpack")
var BundleTracker = require("webpack-bundle-tracker")

module.exports = {
    context: __dirname,
    entry: {
        index: path.resolve(__dirname, "assets", "index.tsx"),
        first: path.resolve(__dirname, "assets", "first.tsx"),
        debug: path.resolve(__dirname, "assets", "debug.tsx")
    },
    output: {
        filename: "bundle-[name]-[hash].js",
        path: path.resolve(__dirname, "assets", "bundles"),
    },

    devtool: "source-map",

    resolve: {
        modules: ["node_modules", "bower_components"],
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    plugins: [
        new BundleTracker({filename: "./webpack-stats.json"}),
    ],

    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ],
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
}