# 本リポジトリについて

## 概要

- 本リポジトリは French Open Science Monitor (<https://github.com/RCOSDP/bso-ui.git>) をフォークし作成された、日本語版のオープンアクセスモニターです

- 本ウェブアプリケーションは以下のURLから参照いただけます :
  - Japanese Open Science Monitor : <https://osm.nii.ac.jp/>

## 前提

- 本リポジトリは<https://github.com/RCOSDP/bso-ui.git>から git clone され、本 README.md に記載されている手順実施に必要なコマンドはインストールされていること
- 本リポジトリは最低限必要なディレクトリ/ファイル構成を整理したものであり、Dockerfile や default.conf.template、.env、各シェルスクリプトの記載などは必要に応じて追記・編集すること
- sudo権限のあるユーザーで実行すること
- 本 README.md の実行前に、日本のオープンアクセス指標データベースが構築され、以下の条件が満たされていること
   - dockerサービスが起動していること
   - Elasticsearchのコンテナが起動されていること

## 環境構築手順

### Elasticsearch用コンテナ起動

josm-indicatorsリポジトリのREADME.md 環境構築関連手順を参考に、Elasticsearch関連コンテナを起動

### Nginxで使用するSSL証明書の設定

ssl_certificate 用の osm.ir.rcos.nii.ac.jp.crt と ssl_certificate_key 用の osm.ir.rcos.nii.ac.jp.key の各証明書を以下に配置

```
/nginx/osm.ir.rcos.nii.ac.jp.crt
/nginx/osm.ir.rcos.nii.ac.jp.key
```

### ElasticsearchのAPIKEY設定

josm-indicatorsリポジトリのREADME.md 環境構築関連手順を参考に、以下のファイルのプレースホルダーにAPIKEYを設定

```
/nginx/templates/default.conf.template
/.env.josm
```

### ウェブアプリケーション用コンテナを起動

service.sh が配置されているディレクトリで以下のコマンドを実行し、bso-uiコンテナを起動

```bash
bash service.sh startbsoui
```

## 補足

### Elasticsearch用コンテナ停止

josm-indicatorsリポジトリのREADME.md 環境構築関連手順を参考に、Elasticsearch関連コンテナを停止

### ウェブアプリケーション用コンテナを停止

service.sh が配置されているディレクトリで以下のコマンドを実行し、bso-uiコンテナを停止

```bash
bash service.sh stopbsoui
```

## 開発環境構築関連手順

### .envファイル修正

.envファイルのREACT_APP_ES_API_URL_PUBLICATIONSを開発環境用のエンドポイントに変更

```bash
REACT_APP_ES_API_URL_PUBLICATIONS=開発環境Elasticsearchのエンドポイント
```

### ElasticsearchのAPIKEY設定

以下のファイルのプレースホルダーに開発環境用のElasticsearchのAPIKEYを設定

```
/nginx/templates/default.conf.template
/.env.josm
```

### ウェブアプリケーション開発用コンテナの起動

service.sh の Docker イメージのビルド（開発用）のコメントアウトを外し、本番用のイメージビルドをコメントアウト

```bash
# Docker イメージのビルド（開発用）
docker build --target development -t "$IMAGE_NAME" "$PROJECT_DIR"

# Docker イメージのビルド（本番用）
# docker build -t "$IMAGE_NAME" "$PROJECT_DIR"
```

その後、service.sh が配置されているリポジトリで以下のコマンドを実行し、コンテナを起動

```bash
bash service.sh startbsoui
```
