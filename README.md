Electron Starter Kit
====================

- node.js >= 10.16.0
- npm >= 6.9.0

## Setup
```
brew install wine (mac環境でwin appビルドの必要)
npm install
npm run dev
npm start
```

## Scripts
- `start` 開発開始（監視）
- `dev` ビルド（開発）
- `stag` ビルド（ステージング）
- `prod` ビルド（本番）

## Style design
[FLOCSS](https://github.com/hiloki/flocss)をベースに設計しています。  
Block、Element、Modifierはそれぞれ`_`、`-`で接続します。
```
Block_Element
Block_Element-Modifier
```
独自ルールとして各ページでのみ使用するstyleについては  
プレフィックスをつけず各ページclassのセレクタを用います。
```
.page-id {
  .title {}
}
```

## JavaScript design
ES2016をベースとします。  
ライブラリはWebpackに含めず`libs.js`にまとめます。  
まとめるライブラリは`config.js`の`paths.script.libs`で設定します。  

## Static file
`.htaccess`など静的ファイルは`/src/static/`以下へ保存します。  
`/src/static/`以下はディレクトリごと`/dist/`へコピーされます。