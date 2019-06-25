import path from 'path';
import gulp from 'gulp';
import del from 'del';
import config from '../config';

import clean from './clean';
import copy from './copy';
import views from './views';
import { scriptMain, scriptRenderer, scriptLibs } from './scripts';
import styles from './styles';
import images from './images';

import electronConnect from 'electron-connect';
import electronPackager from 'electron-packager';

const defaultTasks = [];
const buildTasks = [];
const electronServer = electronConnect.server.create({ path: config.paths.distApp });

function reloadElectron(callback) {
  electronServer.reload();
  callback();
}

function restartElectron(callback) {
  electronServer.restart();
  callback();
}

function watch(callback) {
  config.isWatch = true;

  const imagesWatcher = gulp.watch(
    config.paths.image.watch,
    gulp.series(images, reloadElectron),
  );
  const staticWatcher = gulp.watch(
    config.paths.static.watch,
    gulp.series(copy, reloadElectron),
  );

  electronServer.start();

  gulp.watch(
    config.paths.view.watch,
    gulp.series(views, reloadElectron),
  );
  gulp.watch(
    config.paths.style.watch,
    gulp.series(styles, reloadElectron),
  );
  gulp.watch(
    config.paths.script.watchMain,
    gulp.series(scriptMain, restartElectron),
  );
  gulp.watch(
    config.paths.script.watch,
    gulp.series(scriptRenderer, reloadElectron),
  );

  imagesWatcher.on('unlink', (filePath) => {
    const filePathFromSrc = path.relative(config.paths.image.dir, filePath);
    const destFilePath = path.resolve(config.paths.image.dist, filePathFromSrc);
    del.sync(destFilePath);
  });
  staticWatcher.on('unlink', (filePath) => {
    const filePathFromSrc = path.relative(config.paths.static.dir, filePath);
    const destFilePath = path.resolve(config.paths.static.dist, filePathFromSrc);
    del.sync(destFilePath);
  });

  callback();
}

function packageMac(callback) {
  electronPackager({
    dir: './app',
    out: './package',
    platform: 'darwin',
    arch: 'x64',
    overwrite: true,
  });
  callback();
}

function packageWin(callback) {
  electronPackager({
    dir: './app',
    out: './package',
    platform: 'win32',
    arch: 'x64',
    overwrite: true,
  });
  callback();
}

defaultTasks.push(watch);

buildTasks.push(clean);
buildTasks.push(gulp.parallel(
  copy,
  views,
  scriptMain,
  scriptRenderer,
  scriptLibs,
  styles,
  images,
));
if (config.env !== 'dev') {
  buildTasks.push(packageMac);
  buildTasks.push(packageWin);
}

exports.default = gulp.series.apply(this, defaultTasks);
exports.build = gulp.series.apply(this, buildTasks);