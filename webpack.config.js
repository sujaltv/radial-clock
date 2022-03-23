const path = require('path');

const UglifyJS = require('uglify-js');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const RemoveFilesPlugin = require('remove-files-webpack-plugin');

const merger = new MergeIntoSingleFilePlugin({
  files: {
    'radial-clock.min.js': ['src/**.js'],
    'radial-clock.min.css': ['src/**.css']
  },
  transform: {
    'radial-clock.min.js': code => UglifyJS.minify(code, {
      output: {
        max_line_len: 80
      }
    }).code
  }
});

const cleaner = new RemoveFilesPlugin({
  after: {
    root: 'dist',
    include: ['radial-clock.js'],
  }
});

const webpackConfigurations = {
  mode: 'production',
  entry: './src/radial-clock.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'radial-clock.js'
  },
  plugins: [merger, cleaner],
  devServer: {
    static: {
      directory: path.join(__dirname, '.')
    },
    compress: true,
    port: 9000
  }
};

module.exports = webpackConfigurations;
