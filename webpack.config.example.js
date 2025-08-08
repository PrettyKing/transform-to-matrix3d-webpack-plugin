// webpack.config.example.js - Example configuration
const path = require('path');
const TransformToMatrix3DPlugin = require('./index');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    }),
    
    // Transform to Matrix3D Plugin
    new TransformToMatrix3DPlugin({
      enabled: true,
      keepOriginal: false,
      test: /\.css$/
    })
  ]
};