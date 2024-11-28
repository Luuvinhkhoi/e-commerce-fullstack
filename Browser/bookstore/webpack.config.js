module.exports = {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "zlib": require.resolve("browserify-zlib"),
        "http": require.resolve("stream-http"),
        "fs": false, // or you can use a mock if necessary
        "net": false, // same for net if needed
      }
    }
};
  