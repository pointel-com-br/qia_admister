const path = require("path");

module.exports = {
  entry: "./build/index.js",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.js",
  },
};
