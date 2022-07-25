const path = require("path");

module.exports = {
  entry: "./build/index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.js",
  },
};
