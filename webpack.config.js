const path = require('path');

const UglifyJS = require('uglify-js');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
const RemoveFilesPlugin = require('remove-files-webpack-plugin');

// Merge JavaScript into one file. #TODO: Do the same for stylesheets.
const merger = new MergeIntoSingleFilePlugin({
  files: {
    'radial-clock.min.js': ['src/**.js']
  },
  transform: {
    'radial-clock.min.js': code => UglifyJS.minify(code, {
      output: {
        max_line_len: 80
      }
    }).code
  }
});

// Delete unused and empty files.
const cleaner = new RemoveFilesPlugin({
  after: {
    root: 'dist',
    include: ['radial-clock.js'],
  }
});

// Webpack build configurations.
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
