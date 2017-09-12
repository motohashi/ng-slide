今話題の技術や最新技術への挑戦を応援する【IBM×teratailのコラボ企画】第二弾です。3回に渡って話題の技術とWatson APIをかけ合わせた開発サンプルをご紹介していきます。記事を読み進めながら、ぜひみなさんも手を動かして作ってみてください。
　第二弾は、今人気を博しているAngularを使用したオリジナルプレゼンテーションを作成するためのサンプルをご紹介いたします。

## 1. Angularでオリジナルのプレゼンスライドを作ろう
こんにちは。勉強会などで登壇しているときのスライドがありきたりで個性が埋没し,自分が八百屋の店先に山のように並んだ大根の一本であるかのような気持ちになったことはありませんか。私はUSBが一発で入らない確率と同じぐらいあります。

この記事ではいま試してみたい技術であるJavaScriptのWebアプリケーションフレームワーク[Angular]を使ったプレゼンテーションで利用するスライドを作成します。
プレゼンテーションのスライドはパワーポイントやkeynoteで作成されることが多いですが,最近はWeb上のGUIで作成されるものやHTML+JavaScriptで作成するものなど様々なものが存在します。
パワーポイントやkeynoteと違いブラウザ上で実行されるため発表用の端末に左右されず, `github.io`などのWebサーバーに公開すればどこからでもアクセスできるため重宝されています。
しかし,そういったブラウザ上で実行される多くのスライドサービスは既存のアプリケーションと違いリッチなアニメーションをつけることを不得手としています。
なので今回はプレゼンテーションをする際にほぼ必ず発生する発表者の「声」に反応しスライド上にエフェクトを表示してみようと思います。
今回利用するIBM BluemixのSpeech To Textでシンプルになりがちなスライドにエフェクトを付けてあなたも唯一無二スタイルを実現しましょう。


## 2. 利用技術の紹介
今回のアプリケーションでは以下の技術を利用します。

- Web/フロント: Angular Cli
- 認証サーバー: typescript + node.js
- 音声認識: Watson Speech to Text

IBM Watsonアカウントへの登録を事前に行ってください。また,今回のサンプルアプリケーションは以下の開発環境で作成しました。

### 2.1 構成

構成の実装は二段階に分かれます。Watson Speech To Textをユーザーが使用出来るようにするために、ExpressにAPIを用意して、WatsonのAPIトークンを発行できるようにします。第二弾階では、ユーザーんもブラウザからそのAPIトークンを使って、Watsonにアクセス出来るようにします。



### 2.2 Watson Speech to Text
Watson Speech to Textは文法や日本語に標準対応した音声の文字書き起こしサービスです。音をそのまま書き起こすのではなく文法や辞書を加味し書き起こすため正確な書き起こしが実現できます。

詳しくはこちらの[公式ページ](https://www.ibm.com/watson/jp-ja/developercloud/speech-to-text.html)を参照して下さい

## 3 Watson Speech to Textを試す

### 3.1 Watson Speech to Textを利用する準備
アプリケーションに組み込む前に,音声の文字起こしのテストをしてみます。「音声　フリー素材 wav」などで検索すれば,利用フリーの音声ファイルがみつかると思うので,用意してください。公式ドキュメントでは `明瞭な話し方の録音された音声` を要求しているため,本記事ではアナウンサーの音声ファイルでテストしました。


まずサービス用の認証情報を作成します。 [Bluemixコンソール](https://console.bluemix.net)の左上メニューよりWatsonサービスを選択します。

![Screen_Shot_2017-07-24_at_11_59_00.png](https://qiita-image-store.s3.amazonaws.com/0/21849/11febf51-35eb-ad8c-6821-f1a56d6aa2c3.png "Screen_Shot_2017-07-24_at_11_59_00.png")


Watsonサービスの作成を押下後のリストよりSpeech To Textを選択します。

ここでアプリ名は`sample-stt-application`など判別できる名前をつけてください。

サービス資格情報から先ほど作成した資格情報のアクション[資格情報の表示]を選択すると以下のような画面が表示されます。


![Screen_Shot_2017-07-24_at_11_53_18.png](https://qiita-image-store.s3.amazonaws.com/0/21849/321e9163-d7f5-86a3-db27-709471fb95b6.png "Screen_Shot_2017-07-24_at_11_53_18.png")


このjsonデータは後ほどcredentail.jsonというファイルに書き写します。これで準備完了です。


### 4.1 Angularプロジェクトの概要

#### Angularプロジェクトを作成する

Angularのプロジェクトはangular-cliを使用することで簡単に作成することができます。本サンプルコードは以下の動作環境を用いて作成しています。

  |ツール|バージョン|備考|
  |--|--|--|
  |Mac OS|Siera||
  |node|v7.8.0||
  |npm|v4.2.0||
  |angular-cli|v1.2.0|サンプルコードをcloneした場合はインストール不要|

その他使用しているライブラリの情報はpackage.jsonに記載しています。また,[angular-cli](https://github.com/angular/angular-cli)を使用しています。新規のプロジェクトから作成を始める場合は,所定のバージョンのangular-cliを`npm install -g @angular/cli`でグローバルインストールし,ターミナルなどのコンソールで以下のコマンドを入力します。

```shell
ng new ${project} または、 ローカルディレクトリのnode_modulesのangular-cliを使用する場合は、$(npm bin)/ng new ${project}
```

上の${project}に任意のプロジェクト名を入れるとプロジェクト名のディレクトリが作成され,配下にプロジェクトのひな型が作成されます。ng new projectで作成したプロジェクトのファイル階層は以下のようになります。（yarnを使用している場合や、バージョンの違いによって多少異なる可能性があります。）

```
project
├── .angular-cli.json
├── .editorconfig
├── .git
├── .gitignore
├── README.md
├── e2e
├── karma.conf.js
├── node_modules
├── package.json
├── protractor.conf.js
├── src
├── tsconfig.json
└── tslint.json
```

この状態で,プロジェクト配下に移動し,ng serveあるいは,npm startを実行すると,angular-cli内部で設定されているwebpack-devserverが起動し,ひな型のWEBアプリケーションが起動します。webpackの設定は通常angular-cliのnode_modulesの中に隠蔽されているため,ngコマンドを使っている限り設定を変更することができませんが,webpackの設定を柔軟に行いたい場合などにおいて

```shell
ng eject
```

コマンドを使用してangular-cliのwebpackのデフォルト設定が施されているwebpack.config.jsonとpackage.jsonを生成することもできます。

#### Angularプロジェクトの基本構成

angular-cliを利用する場合,.angular-cli.jsonにbuildの設定が書き出されています。ここで,重要なのは,以下の設定です。

```json
      "index": "index.html",
      "main": "main.ts",
```

この設定は,main.tsの設定に従いテンプレートとしてのindex.htmlの中に設定されている後述のAngularのコンポーネントをコンパイルしていき,最終的にDOMレンダリングされたindex.htmlを生成する設定になります。この設定は,実は,index.html上にAngularを含む最終的にビルドされてバンドルされたjsをscriptタグで発火させているに過ぎませんが,より発展した設定を行うことで,WEBサーバーのレスポンスとしてサーバサイドレンダリングされたhtmlを返すことが出来たり,コンポーネントのlazy loadができるようにすることで,ユーザーエクスペリエンスを向上させることができます。main.tsは以下のようなコードが記述されています。

```ts
//main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

AppModuleは,Angularのモジュールです。Angularのモジュールは後述するように定義されているコンポーネントやその中で使われているモジュールや設定をindex.htmlや他のモジュール内で使用できるように定義する,いわば設定ファイルのような役割をします。

#### Angularのモジュールの構成

```ts
//app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SlidesComponent } from './slides/slides.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SlidesService } from './slides/slides.service';
import { SlideComponent  } from './slides/slide/slide.component';
import { SlideBusService } from './slides/slide-bus.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  { path: 'slides', component: SlidesComponent },
  { path: '',      component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SlidesComponent,
    SlideComponent,
    SpeechTextComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [ RouterModule ],
  providers: [SlidesService, SlideBusService, SlidesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

以上は本サンプルコードに使用されているapp.module.tsのソースコードになります。この例に沿って説明を行います。まず,@NgModuleはデコレータでAppModuleクラスがAngularのモジュールであることを定義するとともに,設定を渡します。@NgModuleの設定値に関しては,今回よく使われる上記の例のみを説明します。そのほかの設定値に興味がある方は公式のドキュメントをご覧ください。それぞれ指定されているコンポーネントやモジュールやサービスの詳細についてはここでは割愛します。

## declarations

  前述のmain.tsで呼ばれたhtmlファイル内において,declarationsで指定されているそれぞれのコンポーネントに指定されているセレクタの条件に当てはまるタグをコンパイルできるようにします。これはこのモジュール内で指定されているすべてのコンポーネントのテンプレートのタグにも有効になり,コンポーネントのセレクタの条件に当てはまるタグが階層的にコンポーネントに置き換わるようになります。また,Directiveや,Pipeを指定するとそれらをモジュールの中で指定されている全てのコンポーネント内で使用することができるようになります。

## imports

  外部のAngularモジュールをインポートします。このときimportsに指定したAngularモジュール内でexportsに設定されているModule,Component,Directive,Pipe,providersに指定されているServiceを,importsした側のコンポーネントで有効にします。

## exports

  外部のAngularモジュールのimportsにモジュールが指定された時に指定されたモジュールがエクスポートする機能を選択します。exportsで指定したModule,Component,Directive,Pipeをimportsした側のコンポーネント側で使用することができるようになります。

## providers

  このモジュール内および,このモジュールをimportしたコンポーネント内で*Data Injection(DI)によって使用可能になるサービスクラスを登録します。サービスはデータの送信・取得などコンポーネントへのデータの渡し方や,コンポーネントのデータと連動するイベントの処理など手続き的な処理を記述するクラスの名称です。これらのサービスは対象のモジュール内で使用可能なすべてのコンポーネントにおいてつけ外しが可能になります。

## bootstrap

  コンポーネントのエントリポイントです。最初にコンパイルを開始するコンポーネントを指定します。この指定により,このモジュールが適用されている範囲が明確になります。複数のAngularアプリケーションを一つのプロジェクトで使用したい場合かつ,お互いの実装が共存できないような場合に,他のbootstrapモジュールへの干渉を防ぐためimportsの代わりに指定が必要なものです。

*Data Injection:内部変数にクラスを持つオブジェクトにおいて,その内部変数にその場でクラスのインスタンスを生成して代入するのではなく,クラスのインスタンスを関数の引数として外部から渡してその値を内部変数に代入させることで,サブクラスやインターフェース経由で継承クラスを引数の型に指定できるようにしたり,処理の手順を確定させることによって,Data Injection先のコードを一切変えずにクラスのつけ外しによる変更を容易にする実装上のテクニック。AngularにおいてはサービスをData Injectionで指定することが規約になっています。

#### Angularのコンポーネントの構成

コンポーネントはそのコンポーネント内で指定されている独自のセレクタ条件にマッチするHTMLのタグを,内部に設定されたHTMLテンプレートに置き換えます。これをレンダリングまたは,Angularの場合はコンパイルと呼びます。さらに,そのテンプレート内の一部分をコンポーネントのデータと連動させることができ,ユーザーの操作や通信によってデータが変更された場合に画面表示やそのほかのデータへの影響を即座に反映させることができます。このように内部データ同士の変更や内部データと画面描画を連動させるように設定することをデータバインディングと呼びます。テンプレートにはこのデータバインディングと画面表示を制御するための様々な記法があります(ここでは割愛します)。また,テンプレート内で更にモジュールに定義済みのコンポーネントのセレクタ条件にマッチするタグを埋め込むことで連鎖的にコンポーネントをコンパイルすることができます。以下は単純なコンポーネントの例です。

```ts
import { Component } from '@angular/core';

export class Example {
  id: number;
  text: string;
}

@Component({
  selector: 'my-app',
  template: `
    <h1>{{example.text}}</h1>
    <div>
      <label>example data binding: </label>
      <input [(ngModel)]="example.text" placeholder="input free and change h1"/>
    </div>
  `,
  styles: [`
    h1 {
      text-color:red;
    }
  `]
})
export class AppComponent {
  example: Example = new Example();
}
```

以上の例では,`<my-app></my-app>`というタグをこのコンポーネントで定義されているテンプレートに置き換え,textboxに入力した文字をh1要素の文字列として即座に反映するコンポーネントの例になります。innerTextではマスタッシュ記法と呼ばれる{{}}で囲まれた文字列を,コンポーネント内の変数の参照に対応させることで,inputの入力には[(ngModel)]="example.text"のように[(ngModel)]の右辺をコンポーネント内の変数の参照に対応させることでデータバインディングを行うことができます。ちなみに[(ngModel)]の[]はinputプロパティの指定に使うシンタックスで内部変数が変更されるとtextboxの文字列も変更されるように単方向データバインディングします。この場合,textboxへの入力は内部変数には反映されません。そして,()はoutputプロパティの指定を表し指定されたプロパティの変更に応じて動作する処理を渡します。[(ngModel)]と指定するとプロパティの値の変更とtextboxの値を連動させ,ユーザーの入力を内部変数の変更と連動させることができます。ただし(ngModel)の指定は機能しません。これは,[ngModel]が内部変数のプロパティにsetterを付加するのに対し,(ngModel)単体の場合は未定義のsetterに対して入力値を代入するというような動作をしていると考えられます。stylesはこのコンポーネントの内部だけで有効なスタイルを指定できます。templateやstylesは外部ファイルに置き換えてパスを指定することもできます。

### 4.2 認証用APIを作成する

### 4.2.1 認証用APIのエンドポイントを設定する

AngularプロジェクトはTypeScriptでの開発が主流であるため、ここでは、認証用APIのモジュールはTypescriptで作ることにします。また、ExpressサーバーはES6で書くことにします。これは、tsconfig.jsonの設定をすることで、ESモジュールを読み込めるようにすることで、TypescriptとESどちらも読み込めるようになります。ここでは、Typescriptを実行できる環境としてts-nodeとtypescirptをインストールします。加えてExpressもインストールしておきましょう。body-parserはexpressのテンプレートエンジン拡張用のプラグインです。(最新版のangular-cliでは、ts-nodeはpacakge.jsonに最初から入っていますのであればインストールは不要です。)

```shell
npm install --save express body-parser typescript ts-node
```

ここで、angular-cliで作成したプロジェクトのルートフォルダに、serverディレクトリを作成します。nodeスクリプト(ts-nodeも同様で)はディレクトリ配下にindex.jsを配置すること、または、package.jsonのmainオプションにファイル名を指定することで、ディレクトリ名を指定してスクリプトを読み込むことが出来ます。そこで、作成したserverディレクトリにindex.jsを配置しましょう。ここでは以下のようにindex.jsを実装します。

```javascript
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const port =  process.env.PORT || 3000;
const watsonAuthService = require('./watson-auth-service');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTION');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser());

app.use(express.static(path.resolve(__dirname,'../','dist')));

server.listen(port, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined, function() {
  console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

app.get('/auth', function(req, res, next) {
  watsonAuthService.getAuthToken().then((token,err)=>res.json({token}));
});

```
ここで、httpモジュールはnodeの標準ライブラリになります。staticは、server/index.jsからexpress.staticはtemplateやjsに対するパスを解決して呼び出せるようにします。ここでは、Angularアプリケーションのbuild済みのファイルは全てdistディレクトリに配置されるため、distディレクトリを指定しておき、後ほどindex.htmlを読み込めるようにします。 watsonAuthServiceはエンドポイント/authにGETメソッドでリクエストが送られた際にWatsonのアクセストークンを取得できるようにするモジュールで後ほど実装します。これで最低限のserverの準備が出来ました。次に上述のwatsonAuthServiceを実装します。

### 4.2.2 認証用APIを実装する

serverディレクトリに、watson-auth-service.tsを作成し、実装します。ここで、実装に入る前にwatson-developer-cloudモジュールをインストールしておきます。

```sh
npm install --save watson-developer-cloud
```

それでは実装に入りましょう。以下のように、watson-developer-cloudに実装されているgetTokenメソッドを使用して、取得できたらトークンを渡して処理を継続し、失敗したら、error内容を渡して処理を継続するPromiseオブジェクトを作成します。それらのレスポンスは前述の/authエンドポイントにリクエストが投げられたとき、レスポンスとしてアクセストークンを返すように設定されています。

```ts
import * as watson from 'watson-developer-cloud';
import * as path from 'path';
import * as fs from 'fs';

const secret = JSON.parse(fs.readFileSync(path.join(__dirname, 'credential.json'), 'utf8'));
const authConfig = {
  version: 'v1',
  url: secret.url,
  username: secret.username,
  password: secret.password
};
const watsonAuthService = watson.authorization(authConfig);
export function getAuthToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    watsonAuthService.getToken({ url: authConfig.url }, (err, token: string) => {
      if (err) { reject(err); }
      resolve(token);
    });
  });
}
```

以上のファイルは、serverディレクトリの中にあるcredential.jsonというファイルからjson形式で、Watsonのアカウント情報を取得し、watson-developer-cloudモジュールにセットするようにしています。
そして、その認証情報を使用し、ユーザーにアクセストークンを取得させる処理を作成しています。よって、3.1節の画像にある、url、username、passwordを記述したcredential.jsonというファイルをserverディレクトリ配下に作成します。

```json
{
  "url": "your api url",
  "username": "your username",
  "password": "your password"
}
```

これでcredential.jsonを作成できました。ここで、Bluemix上のSpeech To Textを使用するためのアクセストークンが、ローカルサーバを起動して取得できるか確かめてみます。


### 4.2.3 アクセストークンをローカルサーバを経由して取得する

node.jsの実行環境ではカレントディレクトリにあるnode_modules内のnpmパッケージの実行ファイルのパスは`npm bin`というコマンドで取得できるようになっています。そのことを利用してnpmパッケージをグローバルインストールしなくても、以下のようにカレントディレクトリ内にローカルインストールされたのnpmパッケージの実行ファイルを実行する事ができます。以下の例では、ローカルインストールされたts-nodeを利用してserverを起動します。serverディレクトリ内にindex.jsを配置しているため、呼び出されるファイルはindex.jsになります。

```
$(npm bin)/ts-node server
```

この時、Expressのデフォルトportの3000が空いていればhttp://localhost:3000/authにブラウザからアクセスすると、アクセストークンが取得できます。無事アクセストークンを取得することが出来たら、今度は、Bluemix上にExpressサーバをデプロイしてみましょう。

### 4.3 Bluemix上のCloudFoundryにnode.jsアプリケーションをデプロイする

### 4.3.1 Bluemix CLIをインストールする
[こちらのリンク](https://console.bluemix.net/docs/cli/reference/bluemix_cli/all_versions.html#bluemix-cli-)からBlumix CLIをインストールすることが出来ます。

＊ Cloud Foundry CLIのみを使ってデプロイすることも可能です。Bluemix CLIにはCloud Foundry CLIが内蔵されているため、どちらを使用しても構いません。ここでは、Bluemix CLIのコマンドを利用して、デプロイを行います。

### 4.3.2 Cloud Foundryへのデプロイ設定を行う

node.jsアプリケーションをデプロイするのは、とても簡単です。.cfignoreファイルにデプロイに不必要なファイル、ディレクトリを記述しておくと、デプロイ時に除外されるため、必要なファイルのみをデプロイする事ができます。また、node.jsのフロントエンド側のスクリプトは全てビルド済みのファイルだけデプロイすれば良いため、ビルド前のスクリプトや本番環境で使われないファイルやnode_modulesなどはデプロイから外しておくことで、デプロイ時間を短縮できます。それらを踏まえた上で、.cfignoreの内容は以下のようになります。

```
e2e
src
node_modules
.nscode
.editorconfig
.gitignore
tslint.json
yarn.lock
karma.conf.json
*.md
asesets
typings
manifest.yml
proxy.config.json
```

Angularアプリは全てdistにビルドされるため、必要なものはts-nodeを動かすためのファイルと、Expressとそれによって配信するモジュールとdistだけになります。また、Cloud Foundryでは、デプロイ時に、Dependenciesに記述のあるパッケージのみnpm installが実行されます。よって、package.jsonからproductionに必要のないnpmパッケージは、devDependenciesに記述を移しておきましょう。このチュートリアルで使用したnpmパッケージでproductionに必要な物は最終的に以下のようになります。

```json
  "dependencies": {
    "body-parser": "^1.18.0",
    "typescript": "~2.3.3",
    "express": "^4.15.4",
    "watson-developer-cloud": "^2.39.0",
    "watson-speech": "^0.33.1",
    "ts-node": "~3.0.4"
  }
```

### 4.3.3 Cloud Foundryにデプロイを行う

BluemixにログインしてカタログからCloud Foundryを選択します。選択すると、以下のような設定画面が表示されるので、今回の例では以下のように設定しました。
以上のように設定を終えたら次にホストにデプロイするためにはmanifest.ymlというファイルを作成し、プロジェクトのディレクトリに配置して設定を行います。設定は以下の通りです。

```yaml
applications:
- path: .
  name: ng-slide
  memory: 512M
  instances: 1
  domain: mybluemix.net
  disk_quota: 1024M
```

pathはmanifest.ymlのパスを基準にディレクトリを指定します。nameは、applicationに設定した名前を使用します。

### 4.3.3 BluemixのCloud Foundryを使用可能にする



### 4.2 Angularでスライドを作成する

Angularの基本的な構成を踏まえ実際にスライドの表示と切り替え機能を持つコンポーネントを作成してみましょう。完成物は[こちら](https://github.com/motohashi/ng-slide)になります。

#### スライドを作るための準備

スライドを作成するためにhtmlファイルを文字列型でimportが出来るように設定します。
angular-cliのデフォルトの設定ではhtmlをlaw-loaderで読み込むようになっていますが
そのimport先の型が定まっていないため,importすることができません。そのため`src/typings.d.ts` に下記のような指定が必要となります。

```ts
declare module "*.html" {
  const content: string;
  export default content;
}
```


#### スライドを作るための構成

以下のようなファイル構成でスライド設置用のコンポーネントを作成していきます。

```
src/app/slides
├── slide
│   ├── slide.component.html
│   ├── slide.component.ts
│   └── template
│       ├── 1.html
│       ├── 2.html
│       └── 3.html
├── slide-bus.service.ts
├── slides.component.css
├── slides.component.html
├── slides.component.ts
├── slides.data.ts
└── slides.service.ts

```

angular-cli を使用することで,
`ng g component slides`を実行した後`ng g component slides/slide`と実行し,
直接作成する手間を省きます。


#### 各ファイルの実装

*スライドに対するcssの実装は任意なのでここでは割愛します。

slides.component.tsはスライド全体を管理するコンポーネントです。@HostListenerによってこのコンポーネントにおけるイベントをフックすることができます。ここでは,LeftキーとRightキーにイベントをフックできるようにしています。

```ts
//slides.component.ts
import {
  HostListener,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import {trigger, animate, style, transition, animateChild, group, query, stagger} from '@angular/animations';
import {SlideBusService} from './slide-bus.service';
import {SlidesService} from './slides.service';
import {SlideComponent} from './slide/slide.component';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css'],
})

export class SlidesComponent implements OnInit {

  @Input() public slides;
  currentIndex = 0;
  selectedSlide = null;

  constructor(private _slideBusService: SlideBusService,
              private _slideService: SlidesService,
            ) {
    this.slides = this._slideService.getAll();
  }

  ngOnInit() {
    this.selectSlide(this.currentIndex);
  }

  selectSlide(slide_id: any) {
    if ( slide_id !== this.selectedSlide) {
      this.selectedSlide = slide_id ;
    }else {
      this.selectedSlide = null;
    }
  }

  @HostListener('window:keyup.arrowRight')
  onArrowRight() {
    if (this.currentIndex + 1 < this.slides.length) {
      this.selectSlide(++this.currentIndex);
    }
  }

  @HostListener('window:keyup.arrowLeft')
  onArrowLeft() {
    if (this.currentIndex - 1 >= 0) {
      this.selectSlide(--this.currentIndex);
    }
  }

}

```

slides.componentのcurrentIndexというパラメータで現在何ページ目のスライドなのかを管理します。ここで子コンポーネントapp-slideに対して[html]要素を@Inputに受け渡しています。(*ngIf)によってcurrentIndexとslideに割り当てられた番号が一致した時にslideを表示するようになります。closeは新規に開かれたコンポーネント以外のcomponentに対してコールバックを設定しています。今回はスライドの管理はcurrentIndexの値のみで実現できているので設定する必要はありませんが,このように親のコンポーネントから必要な関数を@Outputに渡すことで子コンポーネント側で任意のコールバックを設定することができます。

```html
//slides.component.html
<ng-container *ngFor="let slide of slides;let i = index;">
  <app-slide [html]="slide.page" *ngIf="currentIndex==i" (close)="selectSlide(null)" ></app-slide>
</ng-container>
```

slide.serviceは,slideのデータを取得するためのクラスです。今回はデータをそのままファイルに保存しているため,データをファイルから読み取るメソッドのみを定義しています。実際の運用では,サーバーなどからデータを取得することもあるため,データをどこから取得するか,どのタイミングで取得するかによって様々なメソッドが実装されます。


```ts
//slides.service.ts
import {Injectable} from '@angular/core';
import {SLIDES} from './slides.data';

@Injectable()
export class SlidesService {
  private _slides = [].concat(SLIDES);

  getAll() {
    return this._slides;
  }

}
```

@Outputなどで設定された関数のイベントを管理するクラスをevent busなどと呼びます。event busではコンポーネント間のコールバックをどのように制御するかを設定します。以下の例では,新たに子コンポーネントが開かれた場合のイベント処理をnotifyOpenで定義し,子コンポーネント初期化時にonOtherSlideOpenというイベントを設定します。


```ts
//slide-bus.service.ts
import { Injectable } from '@angular/core';
import {SlidesService} from './slides.service';

@Injectable()
export class SlideBusService {
  private _callbacks = new Map<any, () => any>();

  constructor(private _slides: SlidesService) { }

  onOtherSlideOpen(previewComponent: any, cb: () => any) {
    this._callbacks.set(previewComponent, cb);
  }

  notifyOpen(previewComponent: any) {
    Promise.resolve().then(() => {
      this._callbacks.forEach((cb, cmp) => {
        if (previewComponent !== cmp) {
          cb();
        }
      });
    });
  }
}

```
slides.data.tsは今回用意したスライドのデータを保存しています。DBなどからデータを直接受け取る場合は用意する必要はありません。形式上titleキーを設定していますが,今回のアプリケーションでは使用していません。以下のように設定することで,任意のパスからHTMLを読み込むことができます。今回はtemplate配下には任意のHTMLを配置しています。
ページを増やす際はここにpage4,page5,,,と追加していくことになります。

```ts
//slides.data.ts
import page1 from './slide/template/1.html';
import page2 from './slide/template/2.html';
import page3 from './slide/template/3.html';

export const SLIDES = [
  {
    title: 'start',
    page: page1
  },
  {
    title: 'middle',
    page: page2
  },
  {
    title: 'end',
    page: page3
  }
]
```

slideの実態となるコンポーネントです。htmlというパラメータを設定することで,任意のDOMをAngularコンポーネントに渡せるようにしています。Angular Animationsに関しては詳細を割愛します。詳しくは,[公式のドキュメント](https://angular.io/guide/animations)を参照してください。

```ts
//slide.component.ts
import {HostBinding, Component, Input, Output, EventEmitter} from '@angular/core';
import {trigger, animate, style, transition, animateChild, query} from '@angular/animations';
import {SlideBusService} from '../slide-bus.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  animations: [
    trigger('nextAnimation', [
      transition(':enter', [
        query('*', [
          style({ transform: 'translateX(200px)', opacity: 0 }),
            animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*'))
        ])
      ])
    ])
  ]
})

export class SlideComponent {
  @Input() html;
  @Output('close')
  public closeNotify = new EventEmitter();

  @HostBinding('@nextAnimation') next = false;

  constructor(private _slideService: SlideBusService) {
    _slideService.onOtherSlideOpen(this, () => this.close());
  }

  close() {
    this.closeNotify.emit();
  }
}

```

以上でスライド関連のコンポーネントの実装は終わりになります。その後app.module.tsなどのmodule管理に,

```ts
//app.module.ts等

import { SlidesComponent } from './slides/slides.component';
import { SlidesService } from './slides/slides.service';
import { SlideComponent  } from './slides/slide/slide.component';
import { SlideBusService } from './slides/slide-bus.service'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//<中略>

@NgModule({
  declarations: [
    ...<中略>
    SlidesComponent,
    SlideComponent,
  ],
  imports: [
     ...<中略>
    BrowserAnimationsModule,
  ],
  providers: [SlidesService, SlideBusService, SlidesService],
})
```

の設定を追記することで,Routesや
```
<app-slides></app-slides>
```
で使用することが出来るようになります。



### 4.3 Watson Speech to Textを利用する
#### token取得
[こちら](https://github.com/motohashi/cognitive-server-starter)よりtoken取得部分を利用しましょう。
`server.ts`で `/api/token`というエンドポイントを提供しています。README通りに`secret/watson-speech-to-text.json`に3項で取得した`url``username``password`を設定すれば完了です。

ブラウザからアクセスすると以下のようにtokenが取得出来ることが確認できます。

![Screen_Shot_2017-07-24_at_19_26_32.png](https://qiita-image-store.s3.amazonaws.com/0/21849/0400757b-fde0-9671-e246-363f8776308d.png "Screen_Shot_2017-07-24_at_19_26_32.png")


### ブラウザからWatson Speech to Textを利用する

Watson Speech to Textを利用するための `SpeechTextComponent`を作成します。

```
$ ng g component speech-text
```

ファイル構成は以下のようになります。

```
speech-text
├── speech-text.component.css
├── speech-text.component.html
├── speech-text.component.spec.ts
├── speech-text.component.ts
└── speech-text.module.ts
```

テンプレートにイベント発火用のボタンを作成します。
`(click)`はonclickイベントを定義します。

```html
//speech-text.component.html
<button (click)="handleMicClick()">mic start</button>
```

まずtokenを取得する関数`getTokenAsync`を用意しましょう。先程作ったtoken取得用のサーバーを利用します。

```ts
//speech-text.component.ts
getTokenAsync() {
  return fetch('http://0.0.0.0:3000/api/token')
          .then(res => res.json() as any)
          .then(data => data.token)
}
```

awaitでtokenを含むjsonデータ取得します。そのtokenを利用しWatson Speech to Textをcallします。

```ts
//speech-text.component.ts
async handleMicClick() {
  await this.getTokenAsync()
    .then(token => {
      this.startRecognizeStream(token)
    })
}
```

文字起こしデータの書き出しの処理を書きます。
`keywords`に特に抽出したい文言をセットしておくと正確に取得できます。今回については「徐々に」と「倍速」をセットしています。
また,コメントアウトしてありますが,`outputElement`に任意のidを指定することで書き出された文字列をテンプレートへ渡すことが出来ます。字幕などリアルタイムの文字起こしが必要な際はこれを利用します。

```ts
//speech-text.component.ts
startRecognizeStream(token) {
  const stream = recognizeMicrophone({
    token,
    model: 'ja-JP_BroadbandModel',
    objectMode: true,
    extractResults: true,
    keywords: ['徐々に','倍速'],
    keywords_threshold: 0.7,
//    outputElement: '#output'
  })
  stream.on('data', data => {
    if (data.final) {
      const transcript = data.alternatives[0].transcript
    }
  })
  this.recognizeStream = stream
}
```


### 4.3 受け取ったデータを元にエフェクトをつける

Watson Speech to Textから返ってきた文字列を元にスライドにエフェクトを付けていきましょう。
`transcript`に入る文字列は話し方によりますが1単語~数十文字までの文字数となります。
`transcript`からエフェクトを作る関数を作成します。今回は一番シンプルな手法としてclassをセットしcssで透過画像を表示します。

```ts
//speech-text.component.ts
      if (data.final) {
        const transcript = data.alternatives[0].transcript
        this.checkEffectedWord(transcript);
      }
```

画像を表示するためのclassをセットします。CSSを自由に編集してフェードやいろいろなアニメーションを試してみましょう。

```ts
//speech-text.component.ts
private keywords = [
  {keyword: '徐々に', class: 'jojoni'},
  {keyword: '倍速', class: 'baisoku'},
];
checkEffectedWord(word) {
  let elm = document.getElementById('slide');
  body.className='effect-layer';
  this.keywords.forEach(obj => {
    if (word.match(obj.keyword)) {
      elm.classList.add(obj.class);
    }
  })
}
```

## 5 動作確認

それではここまで作成したものを画面で確認してみましょう。

![ezgif-2-9bf14ca8ac.gif](https://qiita-image-store.s3.amazonaws.com/0/21849/07f6e0f2-58aa-3faf-f801-eaf37f22a356.gif "ezgif-2-9bf14ca8ac.gif")

スライドの移動は左右キーで行います。
3枚目のスライド表示中にで「徐々に」というキーワードを発声します。

すると`jojoni`というclassが付与され奇妙な冒険風の画像が表示されます。これで声に反応しスライドを装飾するアプリケーションの完成です。
画像やキーワード, cssアニメーションを変えてオリジナルのスライドを作ってみましょう。

## 6 終わりに

社内社外や学内学外問わず勉強会での登壇やLTなどスライドを用い発表することは様々な機会であるとおもいます。無償有償問わずクールなスライドが世の中に出てきていますが,音声に反応するスライドを作り他の登壇者に差をつけましょう！

またWatsonの他のAPIを利用することでエフェクトを付けるだけでなくリアルタイムで字幕をつけたり,
Language Translatorを利用して和英/英和の翻訳を施した字幕をつけたりと,よりプレゼンとしての機能を拡張することが出来ます。ぜひお試しください。
