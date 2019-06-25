import { app, BrowserWindow, ipcMain } from 'electron';
import config from './config';

// GCにより自動で閉じられる可能性があるのでグローバルに参照を保持
let mainWindow = null;

function createWindow () {
  // ウィンドウのboundsを取得（前回閉じたときの状態を復元）
  const windowBounds = config.get('windowBounds');

  // ブラウザウィンドウ作成
  mainWindow = new BrowserWindow({
    // options: https://electronjs.org/docs/api/browser-window
    x: windowBounds.x,
    y: windowBounds.y,
    width: windowBounds.width,
    height: windowBounds.height,
    // alwaysOnTop: true, // ウィンドウを常に他のウィンドウの上に表示する
    webPreferences: {
      nodeIntegration: true // nodeの機能を利用？
    }
  });

  // ファイル読み込み
  mainWindow.loadFile('./renderer/index.html');

  // デバックツール表示
  mainWindow.webContents.openDevTools();

  // ウィンドウを閉じるとき
  mainWindow.once('close', () => {
    // ウィンドウのboundsを保存
    config.set('windowBounds', mainWindow.getBounds());
  });

  // ウィンドウが閉じられたとき
  mainWindow.once('closed', () => {
    // ウィンドウが不要な場合は参照を削除
    mainWindow = null;
  });

  // レンダープロセスに非同期でメッセージを送信
  // onloadのタイミング https://electronjs.org/docs/api/web-contents#class-webcontents
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('ping', 'whoooooooh!');
  });
}

// electronの初期化が完了しブラウザウィンドウを作成する準備ができたとき
app.on('ready', createWindow);

// すべてのウィンドウが閉じられたとき
app.on('window-all-closed', () => {
  // macOSは明示的に`Cmd + Q`するまでは終了しない
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アクティブになったたとき（macOSはdockでアイコンをクリックされとき）
app.on('activate', () => {
  // macOSはウィンドウを開く
  if (mainWindow === null) {
    createWindow();
  }
});

// アプリ終了前
// app.on('before-quit', () => {
//   console.log('before-quit');
// });

// レンダープロセスからメッセージを受信
ipcMain.on('ping', (event, message) => {
  console.log(message);
});