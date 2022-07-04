const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV;

module.exports = {
  mode,

  devtool: 'source-map',

  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: 3000,
    watchFiles: {
      paths: ['./public/**/*'],
      options: {
        ignored: '/node_modules/',
        usePolling: true,
      },
    },
  },

  watchOptions: {
    poll: 1000,
    aggregateTimeout: 200,
    ignored: /node_modules/,
  },

  entry: {
    index: './src/js/index.ts',
    about: './src/js/about.js',
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'public'),
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      // JS
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // TS
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src/js'),
        ],
      },
      // STYLES
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: '../' },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      // IMAGES
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name][ext]',
        },
      },
      // SVG
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'svg/[name][ext]',
        },
      },
      // FONTS
      {
        test: /\.(woff(2)?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },

  plugins:
    [
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
    ],
};
