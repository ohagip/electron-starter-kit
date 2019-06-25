/**
 *  index
 */
import { ipcRenderer } from 'electron';

// メインプロセスからメッセージを受信
ipcRenderer.on('ping', (event, message) => {
  console.log(message);
});

// メインプロセスへメッセージを送信
ipcRenderer.send('ping', 'whoooooooh!');