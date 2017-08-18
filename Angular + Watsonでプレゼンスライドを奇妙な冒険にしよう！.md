# Angular + Watsonでプレゼンスライドを奇妙な冒険にしよう！

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
![Screen Shot 2017-08-01 at 17.50.24.png](https://qiita-image-store.s3.amazonaws.com/0/21849/cd513d59-4e15-a995-6114-f88cbaf03099.png "Screen Shot 2017-08-01 at 17.50.24.png")

上記のような構成で実現します。
Wastonと書かれている側では,音声認識を行うSpeech To Textサービスとそれを利用するための認証を行います。また,スライドを構築するWebサーバーをAngularで,Token取得をするバックエンドをNodejsと二種のアプリケーションをローカルに構築します。


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

サービス資格情報から先ほど作成した資格情報のアクション[資格情報の表示]を選択し `username`と `password`を残しておきます。


![Screen_Shot_2017-07-24_at_11_53_18.png](https://qiita-image-store.s3.amazonaws.com/0/21849/321e9163-d7f5-86a3-db27-709471fb95b6.png "Screen_Shot_2017-07-24_at_11_53_18.png")



これで準備完了です。

### 3.2 Watson Speech to Textの精度の確認

[APIドキュメント](https://www.ibm.com/watson/developercloud/speech-to-text/api/v1/?curl#get_model)を参照し試してみましょう。

今回利用する音声ファイルはwav形式のためheaderには `Content-Type: audio/wav`を指定します。
また,日本語の音声ファイルのため `ja-JP_BroadbandModel`を指定します。
実行するコマンドは以下のようになります。

`<service_username>:<service_password>`は先程Bluemixコンソールで取得したものを,`<filepath>/sample.wav`は用意したファイルへのpathで置換して下さい。

```
$ curl -X POST -u <service_username>:<service_password> \
--header "Content-Type: audio/wav" \
--data-binary @"<filepath>/sample.wav" \
"https://stream.watsonplatform.net/speech-to-text/api/v1/models/ja-JP_BroadbandModel/recognize"
```

認証情報などのあとに以下のようなjsonレスポンスが表示されます。クリアな音声ファイルが用意できた場合,このように形態素解析済みの文言が高精度に取得できます。

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

### 4.1 Angularプロジェクトの概要

#### Angularプロジェクトを作成する

Angularのプロジェクトはangular-cliを使用することで簡単に作成することができます。本サンプルコードは以下の動作環境を用いて作成しています。

  |ツール|バージョン|備考|
  |--|--|--|
  |node|v7.8.0||
  |npm|v4.2.0||
  |angular-cli|v1.2.0|サンプルコードをcloneした場合はインストール不要|

その他使用しているライブラリの情報はpackage.json,package-lock.jsonに記載しています。また,[angular-cli](https://github.com/angular/angular-cli)を使用しています。新規のプロジェクトから作成を始める場合は,所定のバージョンのangular-cliを`npm install -g @angular/cli`でグローバルインストールし,ターミナルなどのコンソールで以下のコマンドを入力します。

```shell
ng new ${project}
```

上の${project}に任意のプロジェクト名を入れるとプロジェクト名のディレクトリが作成され,配下にプロジェクトのひな型が作成されます。この状態で,プロジェクト配下に移動し,ng serveあるいは,npm startを実行すると,angular-cli内部で設定されているwebpack-devserverが起動し,ひな型のWEBアプリケーションが起動します。webpackの設定は通常angular-cliのnode_modulesの中に隠蔽されているため,ngコマンドを使っている限り設定を変更することができませんが,webpackの設定を柔軟に行いたい場合などにおいて,

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

```typescript
//main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

AppModuleは,Angularのモジュールです。Angularのモジュールは後述するように定義されているコンポーネントやその中で使われているモジュールや設定をindex.htmlや他のモジュール内で使用できるように定義する,いわば設定ファイルのような役割をします。

#### Angularのモジュールの構成

```typescript
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

- declations 
  
  前述のmain.tsで呼ばれたhtmlファイル内において,declationsで指定されているそれぞれのコンポーネントに指定されているセレクタの条件に当てはまるタグをコンパイルできるようにします。これはこのモジュール内で指定されているすべてのコンポーネントのテンプレートのタグにも有効になり,コンポーネントのセレクタの条件に当てはまるタグが階層的にコンポーネントに置き換わるようになります。また,Directiveや,Pipeを指定するとそれらをモジュールの中で指定されている全てのコンポーネント内で使用することができるようになります。

- imports
  
  外部のAngularモジュールをインポートします。このときimportsに指定したAngularモジュール内でexportsに設定されているModule,Component,Directive,Pipe,providersに指定されているServiceを,importsした側のコンポーネントで有効にします。

- exports
  
  外部のAngularモジュールのimportsにモジュールが指定された時に指定されたモジュールがエクスポートする機能を選択します。exportsで指定したModule,Component,Directive,Pipeをimportsした側のコンポーネント側で使用することができるようになります。

- providers

  このモジュール内および,このモジュールをimportしたコンポーネント内で*Data Injection(DI)によって使用可能になるサービスクラスを登録します。サービスはデータの送信・取得などコンポーネントへのデータの渡し方や,コンポーネントのデータと連動するイベントの処理など手続き的な処理を記述するクラスの名称です。これらのサービスは対象のモジュール内で使用可能なすべてのコンポーネントにおいてつけ外しが可能になります。

- bootstrap

  コンポーネントのエントリポイントです。最初にコンパイルを開始するコンポーネントを指定します。この指定により,このモジュールが適用されている範囲が明確になります。複数のAngularアプリケーションを一つのプロジェクトで使用したい場合かつ,お互いの実装が共存できないような場合に,他のbootstrapモジュールへの干渉を防ぐためimportsの代わりに指定が必要なものです。

*Data Injection:内部変数にクラスを持つオブジェクトにおいて,その内部変数にその場でクラスのインスタンスを生成して代入するのではなく,クラスのインスタンスを関数の引数として外部から渡してその値を内部変数に代入させることで,サブクラスやインターフェース経由で継承クラスを引数の型に指定できるようにしたり,処理の手順を確定させることによって,Data Injection先のコードを一切変えずにクラスのつけ外しによる変更を容易にする実装上のテクニック。AngularにおいてはサービスをData Injectionで指定することが規約になっています。

#### Angularのコンポーネントの構成

コンポーネントはそのコンポーネント内で指定されている独自のセレクタ条件にマッチするHTMLのタグを,内部に設定されたHTMLテンプレートに置き換えます。これをレンダリングまたは,Angularの場合はコンパイルと呼びます。さらに,そのテンプレート内の一部分をコンポーネントのデータと連動させることができ,ユーザーの操作や通信によってデータが変更された場合に画面表示やそのほかのデータへの影響を即座に反映させることができます。このように内部データ同士の変更や内部データと画面描画を連動させるように設定することをデータバインディングと呼びます。テンプレートにはこのデータバインディングと画面表示を制御するための様々な記法があります(ここでは割愛します)。また,テンプレート内で更にモジュールに定義済みのコンポーネントのセレクタ条件にマッチするタグを埋め込むことで連鎖的にコンポーネントをコンパイルすることができます。以下は単純なコンポーネントの例です。

```typescript
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

以上の例では,`<my-app></my-app>`というタグをこのコンポーネントで定義されているテンプレートに置き換え,textboxに入力した文字をh1要素の文字列として即座に反映するコンポーネントの例になります。innerTextではマスタッシュ記法と呼ばれる{{}}で囲まれた文字列を,コンポーネント内の変数の参照に対応させることで,inputの入力には[(ngModel)]="example.text"のように[(ngModel)]の右辺をコンポーネント内の変数の参照に対応させることでデータバインディングを行うことができます。ちなみに[(ngModel)]の[]はinputプロパティの指定に使うシンタックスで内部変数が変更されるとtextboxの文字列も変更されるように単方向データバインディングします。この場合,textboxへの入力は内部変数には反映されません。そして,()はoutputプロパティの指定を表し指定されたプロパティの変更に応じて動作する処理を渡します。[(ngModel)]と指定するとプロパティの値の変更とtextboxの値を連動させ,ユーザーの入力を内部変数の変更と連動させることができます。ただし(ngModel)の指定は機能しません。これは,[ngModel]が内部変数のプロパティにsetterを付加するのに対し,(ngModel)単体の場合は未定義のsetterに対して入力値を代入するというような動作をしていると考えられます。stylesはこのコンポーネントの内部だけで有効なスタイルを指定できます。templateやstylesは外部ファイルに置き換えて,パスを指定することもできます。

### 4.2 Angularでスライドを作成する

Angularの基本的な構成を踏まえ実際にスライドの表示と切り替え機能を持つコンポーネントを作成してみましょう。完成物は[こちら](https://github.com/motohashi/ng-slide)になります。

#### スライドを作るための準備

スライドを作成するためにhtmlファイルを文字列型でimportが出来るように設定します。
angular-cliのデフォルトの設定ではhtmlをlaw-loaderで読み込むようになっていますが
そのimport先の型が定まっていないため,importすることができません。そのため`src/typings.d.ts` に下記のような指定が必要となります。

```
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
    this.closeNotify.next();
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
