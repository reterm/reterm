var path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: './index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ]
  },
  progress: true,
  resolve: {
    extensions: ['', '.json', '.js'],
  },
  resolveLoader: {
    modulesDirectories: [
      path.resolve(__dirname, './node_modules'),
    ]
  },
};
