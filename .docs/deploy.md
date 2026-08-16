# AWS へのデプロイ

S3 + CloudFront 構成。インフラは `terraform/`、デプロイは GitHub Actions の `Deploy` ワークフローが担当する。

## 構成

```
ブラウザ --https--> CloudFront --+--> S3        静的ファイル
                                 +--http--> ALB (laravel-todo-app-v2)  /api/*
```

API を同じ CloudFront の `/api/*` に相乗りさせている。理由は 2 つ。

- バックエンドの ALB は証明書を持たず HTTP のみのため、HTTPS のページから直接叩くと混在コンテンツになる
- 同一オリジンになるので CORS のプリフライトが発生しない

このため `VITE_BACKEND_URL` には `/api` という相対パスを設定する。

## 初回セットアップ

### 1. tfstate 用の S3 バケット

`laravel-todo-app-v2/terraform/bootstrap-backend.sh` で作成したバケットを共有し、
`key` だけを分ける（`backend.hcl.example` 参照）。まだ作っていない場合は先にそちらを実行する。

### 2. Terraform を適用する

```bash
cd terraform
cp backend.hcl.example backend.hcl            # バケット名を書き換える
cp terraform.tfvars.example terraform.tfvars
terraform init -backend-config=backend.hcl
terraform apply
```

`api_origin_domain` にはバックエンド側の ALB ドメインを設定する。
バックエンドが未構築なら空のまま apply し、後から設定して再度 apply すればよい
（空の間は `/api/*` の転送が作られない）。

```bash
# laravel-todo-app-v2 側で取得する
cd ../../laravel-todo-app-v2/terraform
terraform output -raw alb_dns_name   # http:// を除いたホスト名を使う
```

GitHub OIDC プロバイダは AWS アカウントに 1 つしか作れない。
`laravel-todo-app-v2` 側で作る前提のため、`create_github_oidc_provider` は `false` のままにする。
こちらを先に構築する場合は、こちらを `true`、Laravel 側を `false` にする。

### 3. GitHub のシークレットを設定する

| シークレット名 | 値 |
| --- | --- |
| `AWS_ROLE_ARN` | `terraform output github_deploy_role_arn` |
| `AWS_S3_BUCKET` | `terraform output s3_bucket` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `terraform output cloudfront_distribution_id` |
| `VITE_BACKEND_URL` | `/api` |

### 4. バックエンド側の設定を更新する

`terraform output cloudfront_url` の値を `laravel-todo-app-v2/terraform/terraform.tfvars` の
`frontend_url` に設定し、そちらで `terraform apply` を実行する。

## デプロイ

`main` への push、または Actions からの手動実行で `Deploy` が動く。

1. `npm ci` と `npm run build`
2. `dist` の中身を S3 へ sync（`index.html` を除く）
3. `index.html` を後から個別にアップロード
4. CloudFront の `/index.html` を invalidate

ハッシュ付きアセットを先に上げてから `index.html` を差し替えるのは、
新しい HTML が参照するアセットが存在しない瞬間を作らないため。

## キャッシュ設計

| 対象 | Cache-Control | CloudFront |
| --- | --- | --- |
| `assets/*` | `max-age=31536000, immutable` | CachingOptimized |
| `index.html` | `no-cache` | CachingDisabled |
| `/api/*` | — | CachingDisabled |

invalidation が `/index.html` だけで済むのは、アセットがファイル名にハッシュを含むため。

## SPA のルーティング

CloudFront Function（`terraform/cloudfront.tf` の `spa_rewrite`）が viewer-request で
拡張子を持たないパスを `/index.html` に書き換えている。

`custom_error_response` で 404 を index.html に寄せる方法を使っていないのは、
その設定がディストリビューション全体に効き、`/api/*` が返す 404 まで
HTML に化けてしまうため。

## 停止と削除

こちらのスタックは S3 と CloudFront のみで、常時課金されるリソースは無い。
アクセス量に応じた従量課金だけなので、個人の学習用途なら月数十円程度に収まる。
放置しても大きな負担にはならない。

削除する場合は次のとおり。

```bash
cd terraform
terraform destroy
```

S3 バケットにオブジェクトが残っていると削除に失敗する。先に空にする。

```bash
aws s3 rm "s3://$(terraform output -raw s3_bucket)" --recursive
```

バージョニングを有効にしているため、これでも「非現行バージョン」が残って
失敗することがある。その場合はコンソールから空にするのが早い。

CloudFront は削除に 15 分ほどかかる（全エッジロケーションからの撤去を待つため）。
destroy が長時間止まって見えても、失敗ではないので待つ。

バックエンドだけ削除してこちらを残す場合は、`api_origin_domain` を空にして
apply し直す。存在しない ALB を指したままだと `/api/*` が 502 を返す。
