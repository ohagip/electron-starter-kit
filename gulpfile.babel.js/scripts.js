import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';
import config from '../config';
import webpackConfig from '../webpack.config';

const $ = gulpLoadPlugins();

function runWebpackMain() {
  const s = gulp
    .src(config.paths.script.srcMain)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe(webpackStream(webpackConfig[0], webpack))
    .pipe(gulp.dest(config.paths.script.distMain));
  return s;
}

function runWebpackRenderer() {
  const s = gulp
    .src(config.paths.script.src)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe(named(file =>
      // entryをsrcを元に作成
      file.relative.replace(/.[^.]+$/, '')))
    .pipe(webpackStream(webpackConfig[1], webpack))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
}

// headタグで読み込みscripts
function runLibsHead(callback) {
  const libs = config.paths.script.libsHead;
  if (Array.isArray(libs) === false || libs.length === 0) {
    callback();
    return;
  }
  const s = gulp
    .src(config.paths.script.libsHead)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.concat('lib-head.js'))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
}

// bodyタグ末尾で読み込みscripts
function runLibsBody(callback) {
  const libs = config.paths.script.libs;
  if (Array.isArray(libs) === false || libs.length === 0) {
    callback();
    return;
  }
  const s = gulp
    .src(config.paths.script.libs)
    .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest(config.paths.script.dist));
  return s;
}

export const scriptMain = gulp.series(runWebpackMain);
export const scriptRenderer = gulp.series(runWebpackRenderer);
export const scriptLibs = gulp.series(runLibsHead, runLibsBody);