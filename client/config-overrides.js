const webpack = require('webpack');

module.exports = function override(config) {
    config.resolve = {
        ...config.resolve,
        fallback: {
            ...config.resolve?.fallback,
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "assert": require.resolve("assert/"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "os": require.resolve("os-browserify/browser"),
            "url": require.resolve("url/"),
            "path": require.resolve("path-browserify"),
            "zlib": require.resolve("browserify-zlib"),
            "process": require.resolve("process/browser"),
            "buffer": require.resolve("buffer/"),
            "fs": false,
            "net": false,
            "tls": false,
            "child_process": false
        }
    };

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: require.resolve("process/browser"),
            Buffer: ["buffer", "Buffer"]
        })
    ];

    return config;
};
