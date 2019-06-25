import webpack from 'webpack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import config from './config';

const webpackCommonConfig = {
  stats: {
    // warningを表示させない
    // write-file-atomicモジュールでwarningがでる（Module not found: Error: Can't resolve 'worker_threads'）
    // ビルドするたびにでると精神衛生上よくないので
    // nodeのバージョン11以降もしくはnode --experimental-worker オプションでwarningはでなくなる
    // https://github.com/nodejs/help/issues/1498
    warnings: false,
  },
  mode: 'none',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules|libs/, use: 'babel-loader' },
      { test: /\.json$/, exclude: /node_modules/, use: 'json-loader' },
      { test: /\.(glsl|vs|fs|vert|frag)$/, exclude: /node_modules/, use: ['glslify-import-loader', 'raw-loader', 'glslify-loader'] },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_CONFIG: JSON.stringify(config.constants),
      APP_ENV: JSON.stringify(config.env),
    }),
  ],
};

if (config.settings.script.sourcemap === true) {
  webpackCommonConfig.devtool = 'source-map';
}

if (config.settings.script.Uglify === true) {
  webpackCommonConfig.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {
      compress: {},
    },
  }));
}

const webpackMainConfig = Object.assign({
  target: 'electron-main',
  entry: `${config.paths.script.srcMain}`,
  output: {
    filename: `[name].js`,
    sourceMapFilename: '[file].map',
  },
}, webpackCommonConfig);

const webpackRendererConfig = Object.assign({
  target: 'electron-renderer',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /node_modules|src\/scripts\/modules|src\/scripts\/components|_config.js/,
          name: 'common',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
}, webpackCommonConfig);

export default [webpackMainConfig, webpackRendererConfig];
