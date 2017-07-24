# Angular + Watsonでプレゼンスライドを奇妙な冒険にしよう！

## 1. Angularでオリジナルのプレゼンスライドを作ろう
こんにちは。

`angular-cli` を利用した[公式チュートリアル](https://angular.io/tutorial)を元にしプレゼン用のスライドを作成してみましょう。


この記事ではAngularを使って声に反応しエフェクトを表示するスライドを作成します。
IBM BluemixのSpeech To Text

## 2. 利用技術の紹介
今回のアプリケーションでは以下の技術を利用します。

- web/フロント: Angular Cli
- 認証サーバー: typescript + node.js
- 音声認識: Watson Speech to Text 

### 2.2 Watson Speech to Text
Watson Speech to Textは文法や日本語に標準対応した音声の文字書き起こしサービスです。音をそのまま書き起こすのではなく文法や辞書を加味し書き起こすため正確な書き起こしが実現できます。

詳しくはこちらの[公式ページ](https://www.ibm.com/watson/jp-ja/developercloud/speech-to-text.html)を参照して下さい

## 3 Watson Speech to Textを試す
### 3.1 Watson Speech to Textを利用する準備
アプリケーションに組み込む前に、音声の文字起こしのテストをしてみます。公式ドキュメントでは `明瞭な話し方の録音された音声`を要求しているため、今回のテストではアナウンサーの音声ファイル(利用フリーの)を用意しました。

まずサービス用の認証情報を作成します。 [Blumixコンソール](https://console.bluemix.net)の左上メニューよりWatsonサービスを選択します。

![Screen_Shot_2017-07-24_at_11_59_00.png](https://qiita-image-store.s3.amazonaws.com/0/21849/11febf51-35eb-ad8c-6821-f1a56d6aa2c3.png "Screen_Shot_2017-07-24_at_11_59_00.png")


Watsonサービスの作成を押下後のリストよりSpeech To Textを選択します。

ここで適当な名前をつけます。

サービス資格情報から先ほど作成した資格情報のアクション[資格情報の表示]を選択し `username`と `password`を残しておきます。


![Screen_Shot_2017-07-24_at_11_53_18.png](https://qiita-image-store.s3.amazonaws.com/0/21849/321e9163-d7f5-86a3-db27-709471fb95b6.png "Screen_Shot_2017-07-24_at_11_53_18.png")



これで準備完了です。

### 3.2 Watson Speech to Textの精度の確認

[APIドキュメント](https://www.ibm.com/watson/developercloud/speech-to-text/api/v1/?curl#get_model)を参照し試してみましょう。

今回利用する音声ファイルはwav形式のためheaderには `Content-Type: audio/wav`を指定します。
また、日本語の音声ファイルのため `ja-JP_BroadbandModel`を指定します。
実行するコマンドは以下のようになります。

```
$ curl -X POST -u <service_username>:<service_password> \
--header "Content-Type: audio/wav" \
--data-binary @"<filepath>/sample.wav" \
"https://stream.watsonplatform.net/speech-to-text/api/v1/models/ja-JP_BroadbandModel/recognize"
```

認証情報などのあとに以下のようなjsonレスポンスが表示されます。クリアな音声ファイルが用意できた場合、このように形態素解析済みの文言が高精度に取得できます。

```json
{
   "results": [
      {                                                                                                                                                                                                                                                "alternatives": [
            {
               "confidence": 0.832,
               "transcript": "さあ 作業 の 途中 で ございます が ここ で メール 着信 の お知らせ です "
            }
         ],
         "final": true                                                                                                                                                                                                                              }
   ],
   "result_index": 0
```


## 4 実装

それでは実際にスライドを作成してみましょう。

### 4.1 Angularでスライドを作成する

### 4.2 Watson Speech to Textを利用する
#### token取得
http://qiita.com/ovrmrw/items/a0b29d6959333c5a746c

[公式サンプル](https://github.com/watson-developer-cloud/speech-to-text-nodejs)よりtoken取得部分を利用しましょう。
`app.js`で `/api/token`というエンドポイントを提供しています。README通りに`.env`に3項で取得した`username``password`を設定すれば完了です。

ブラウザからアクセスすると以下のようにtokenが取得出来ることが確認できます。

![Screen_Shot_2017-07-24_at_19_26_32.png](https://qiita-image-store.s3.amazonaws.com/0/21849/0400757b-fde0-9671-e246-363f8776308d.png "Screen_Shot_2017-07-24_at_19_26_32.png")


### ブラウザからWatson Speech to Textを利用する




## 概要
Angular + Watsonでプレゼンスライドを奇妙な冒険にしよう！

* ターゲット
  * Angularを試してみたいエンジニア
* 使う技術
  * Angular
  * Speech to Text
  * Node.js

## アウトライン

1	導入
1.1	Angularを導入するための一歩目としてプレゼンスライドを作る
1.2	発表中は言葉を発するためそれを活かした差別化をする→Speech to Text
1.3	完成イメージを見せる
2	~~構成や使う技術の紹介~~
2.1	Angularの紹介
2.2	~~Speech to Textの紹介~~
3	~~Speech to Textのお試し(Curl)~~
3.1	~~アカウント作成の流れ ※ 第一弾のため、公式の紹介程度~~
3.2	~~精度を紹介するためにフリー音声+Curlで試す~~
4	実際に作る
4.1	Angularの公式チュートリアルからプレゼンスライドを作るための手順を示す
4.2	watson-developer-cloud/speech-to-text-nodejs を抜粋しAngularから音声をSpeech to Textへと送る手順を示す
4.3	受け取ったテキストデータより特定の画像で効果をつける
5	完成
5.1	結果をスクリーンショットで表示
6	終わりに
6.1	LTや勉強会で他の人に差をつけよう
6.2	その他日本語対応されれば出来ることなど未来を紹介


