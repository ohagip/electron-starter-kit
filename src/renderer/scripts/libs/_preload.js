// ここを更新した場合はnpm run devで再ビルドが必要

// electronの場合jQueryオブジェクトがwindowにないため
// https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
window.$ = window.jQuery = require('jquery');