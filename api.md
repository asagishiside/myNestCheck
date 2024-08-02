# API仕様書

## 概要
このアプリケーションは、NestJSを使用して構築されたサーバーが複数の外部APIにリクエストを送り、それぞれのレスポンスを集約・加工してクライアントにJSON形式で返すものです。

## エンドポイント一覧
- `GET /weather`

## エンドポイント詳細

### `GET /weather`

#### 概要
外部APIからデータを取得し、集約・加工してクライアントに返すエンドポイント。

#### リクエスト

- **HTTPメソッド**: GET
- **URL**: `/weather`
- **リクエストパラメータ**: なし

#### レスポンス

- **ステータスコード**: 200 OK
- **ボディ**: 集約されたJSONデータ
  - **Content-Type**: `application/json`

##### レスポンスボディ例

```json
{
  "aggregatedData": {
    "combinedId": 6,
    "combinedName": "Example 1 - API 2 - API 3",
    "combinedValue": "Data from 外部API",
    "weather": "晴れ",
    "temperature": "25"
  }
}
```

#### エラーレスポンス

- **ステータスコード**: 500 Internal Server Error
- **ボディ**: エラーメッセージ
  - **Content-Type**: `application/json`

##### エラーレスポンス例

```json
{
  "message": "An error occurred while processing the request."
}
```

#### 処理フロー

1. クライアントが `GET /weather` にリクエストを送信します。
2. NestJSサーバー内の `API Call Process` が外部API 1、外部API 2にリクエストを送信します。
3. 下記外部APIからレスポンスを受け取ります。
    1. Open Weather Map API
        - 日本の主要5都市の天気情報を取得
    2. yahoo or rakuten API
        - 日時の売れ筋商品データ
4. NestJSサーバー内でレスポンスを集約し、加工します。
    - 対象の日の天気と商品の売れ筋の相関を見れる 
5. 集約されたデータをクライアントにJSON形式で返します。
