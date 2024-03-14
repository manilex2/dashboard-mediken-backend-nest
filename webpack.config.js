/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/main.ts', // Punto de entrada de tu aplicación
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js', // Nombre del archivo de salida
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resuelve las extensiones de TypeScript y JavaScript
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules|\.spec\.ts$/,
      },
      {
        test: /\.js$/, // Usa babel-loader para archivos .js
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: 'commonjs' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/templates/index.hbs', // tu archivo Handlebars principal
      filename: 'index.html', // el nombre del archivo HTML resultante
      inject: true,
    }),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          // ADD THIS
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets/socket-module',
          'class-validator',
          'class-transformer',
          'nock',
          'aws-sdk',
          'mock-aws-s3',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      },
    }),
  ],
  target: 'node13.10', // Especifica que el código se ejecutará en el entorno de Node.js
  node: {
    // Especifica la versión de Node.js para el entorno de compilación
    __dirname: false,
    __filename: false,
  },
  externals: ['pg-hstore'],
};
