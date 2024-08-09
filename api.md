# API仕様書

## 概要
このアプリケーションは、NestJSを使用して構築されたサーバーが複数の外部APIにリクエストを送り、それぞれのレスポンスを集約・加工してクライアントにJSON形式で返すものです。

## エンドポイント一覧
- `GET /stores`
- `GET /stores/result`

## エンドポイント詳細

### `GET /stores`

#### 概要
外部APIから売れ筋商品のランキングデータを取得し、クライアントに返すエンドポイント

#### リクエスト

- **HTTPメソッド**: GET
- **URL**: `/stores`
- **リクエストパラメータ**: なし

#### レスポンス

- **ステータスコード**: 200 OK
- **ボディ**: ランキングデータの配列
  - **Content-Type**: `application/json`

##### レスポンスボディ例

```json
[
  {
    "rank": 1,
    "name": "Item 1"
  },
  {
    "rank": 2,
    "name": "Item 2"
  }
]
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

### `GET /stores/result`

#### 概要
外部APIから5つの都市の天気データと売れ筋商品のランキングデータを取得し、集約・加工してクライアントに返すエンドポイント

#### リクエスト

- **HTTPメソッド**: GET
- **URL**: `/stores/result`
- **リクエストパラメータ**: なし

#### レスポンス

- **ステータスコード**: 200 OK
- **ボディ**: 天気データとランキングデータを集約したオブジェクト
  - **Content-Type**: `application/json`

##### レスポンスボディ例

```json
{
  "weathers":{
    "CityName":{
      "main":"Clouds",
      "description":"few clouds",
      "temp":34.19,
      "maxTemp":36.44,
      "minTemp":32.59},
  },
  "ranking": [

  ]
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

1. クライアントが `GET /stores/result` にリクエストを送信します。
2. NestJSサーバー内の `API Call Process` が外部API 1、外部API 2にリクエストを送信します。
3. 下記外部APIからレスポンスを受け取ります。
    1. Open Weather Map API
        - 日本の主要5都市の天気情報を取得
    2. yahoo or rakuten API
        - 日時の売れ筋商品データ
4. NestJSサーバー内でレスポンスを集約し、加工します。
    - 当日の天気と商品の売れ筋の相関を見れる 
5. 集約されたデータをクライアントにJSON形式で返します。
