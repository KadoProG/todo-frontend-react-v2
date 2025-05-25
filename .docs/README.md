# フロントエンドの環境構築

## 最初にやること

<!-- Gitがインストールされており、git clone が実施できている前提 -->

### パッケージのインストール

最初以外にも、`package.json`, `package-lock.json` が変更されたら以下を実行する。

```shell
npm ci
```

### 環境変数ファイルのコピー

1回のみ実行。適宜環境変数の内容を変更する。

```shell
cp .env.example .env
```

### 起動

http://localhost:5173 で Webサーバ が起動する。

```shell
npm run dev
```

## よく使用されるコマンド

### ビルド ＆ preview

本番環境に近い形でプレビューができる

```shell
npm run build
npm run preview
```

### APIドキュメント反映

バックエンド（Laravelで `dedoc/scramble` ライブラリが入っている前提）が起動している状態で、以下を実行することで、`api.json` を取得し、それをもとに型定義ファイルが定義される。

```shell
npm run schema
```

`apiClient` という関数が用意されているため、以下のように API を fetch することで、型安全を維持して開発ができる。

```ts
const res = await apiClient.PUT('/v1/tasks/{task}', {
  params: { path: { task: id } },
  body: {
    title: data.title,
    description: data.description,
  },
});
```

### mock

バックエンドが起動していなくても、API ドキュメントを参照して API を mock することができる。使用する際は、環境変数を `http://localhost:18080/api` のように、mock サーバと同じポート番号にするようにしてください。

```shell
npm run mock
```

### tsc

ビルドまではいかなくとも、コンパイルチェック的な事が可能なコマンドである。事前に確認をすることで、致命的なエラーを防ぐことができる。

```shell
npx tsc -b
```

### eslint

TypeScriptの型エラーや、非推奨の書き方をしていた場合に、破線等でエラーを表示してくれるツール

```shell
npm run lint
```

## 推奨 VSCode 拡張機能

### [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

- コードのインデント、不要な空白削除、シングルクォーテーション等の最適化を、Save時に瞬時に行ってくれる機能を持つ
- VSCodeの設定で下記を変更する
  - Format on Save → `True`
  - Default Formatter → `Prettier - Code formatter`

### [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- TypeScript の型エラーや、非推奨の書き方をしていた場合に、波線等でエラー表示してくれるツール
