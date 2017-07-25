# Angular + Watsonでプレゼンスライドを奇妙な冒険にしよう！

## 1. Angularでオリジナルのプレゼンスライドを作ろう
こんにちは。勉強会などで登壇しているときのスライドがありきたりで個性が埋没し,自分が八百屋の店先に山のように並んだ大根の一本であるかのような気持ちになったことはありませんか。私はUSBが一発で入らない確率と同じぐらいあります。

この記事ではいま試してみたい技術であるAngularを使ったスライドに,さらに声に反応しエフェクトを表示します。
IBM BluemixのSpeech To Textを利用し単調になりがちなスライドにエフェクトを付けてあなたも唯一無二スタイルを実現しましょう。

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
アプリケーションに組み込む前に,音声の文字起こしのテストをしてみます。「音声　フリー素材 wav」などで検索すれば,利用フリーの音声ファイルがみつかると思うので,用意してください。公式ドキュメントでは `明瞭な話し方の録音された音声` を要求しているため,本記事ではアナウンサーの音声ファイルでテストしました。


まずサービス用の認証情報を作成します。 [Blumixコンソール](https://console.bluemix.net)の左上メニューよりWatsonサービスを選択します。

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

それでは実際にスライドを作成してみましょう。

### 4.1 Angularでスライドを作成する

#### Slideを作るための準備

Slideを作成するためにhtmlファイルを文字列型でimportが出来るように設定します。
angular-cliのデフォルトの設定ではhtmlをlaw-loaderで読み込むようになっていますが
そのimport先の型が定まっていないため,importすることができません。

```
declare module "*.html" {
  const content: string;
  export default content;
}
```


#### Slideを作るための構成

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
`ng g component slides`を実行した後`ng g component slides/slide`を実行することで,
直接作成する手間を省くことができます。


#### 各ファイルの実装

*スライドに対するcssの実装は任意なのでここでは割愛します。

slides.component.tsはスライド全体を管理するコンポーネントです。@HostListenerによってこのコンポーネントにおけるイベントをフックすることができます。ここでは,LeftキーとRightキーにイベントをフックできるようにしています。

```ts
// slides.component.ts
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
import {SlideDirective} from './slide/slide.directive';
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

slides.componentのcurrentIndexというパラメータで現在何ページ目のスライドなのかを管理します。ここで子コンポーネントapp-slideのに対して[html]要素を@Inputに受け渡しています。(*ngIf)によってcurrentIndexとslideに割り当てられた番号が一致した時にslideを表示するようになります。closeは新規に開かれたコンポーネント以外のcomponentに対してコールバックを設定しています。今回はスライドの管理はcurrentIndexの値のみで実現できているので,設定する必要はありませんが,このように親のコンポーネントから必要な関数を@Outputに渡すことで子コンポーネント側で任意のコールバックを設定することができます。

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


```ts
// slides.data.ts
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

```
// app.module.ts等
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



### 4.2 Watson Speech to Textを利用する
#### token取得
[公式サンプル](https://github.com/watson-developer-cloud/speech-to-text-nodejs)よりtoken取得部分を利用しましょう。
`app.js`で `/api/token`というエンドポイントを提供しています。README通りに`.env`に3項で取得した`username``password`を設定すれば完了です。

ブラウザからアクセスすると以下のようにtokenが取得出来ることが確認できます。

![Screen_Shot_2017-07-24_at_19_26_32.png](https://qiita-image-store.s3.amazonaws.com/0/21849/0400757b-fde0-9671-e246-363f8776308d.png "Screen_Shot_2017-07-24_at_19_26_32.png")


### ブラウザからWatson Speech to Textを利用する

Watson Speech to Textを利用するための `SpeechTextComponent`を作成します。

```
$ ng g component speech-text
```

テンプレートにイベント発火用のボタンを作成します。

```speech-text.component.html
<button (click)="handleMicClick()">mic start</button>
```

まずtokenを取得しましょう。

```Angular
getTokenAsync() {
  return fetch('http://0.0.0.0:3000/api/token')
          .then(res => res.json() as any)
          .then(data => data.token)
}
```

awaitでtokenを取得しそのtokenを利用しWatson Speech to Textを利用します。

```speech-text.component.ts
async handleMicClick() {
  await this.getTokenAsync()
    .then(token => {
      this.startRecognizeStream(token)
    })
}
```

書き出しの処理を書きます。
`keywords`に特に抽出したい文言をセットしておくと正確に取得できます。今回については「徐々に」と「倍速」をセットしています。
また,コメントアウトしてありますが,`outputElement`に任意のidを指定することで書き出された文字列をテンプレートへ渡すことが出来ます。

```speech-text.component.ts
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

```
      this.checkEffectedWord(transcript);

```

画像を表示するためのclassをセットします。CSSを自由に編集してフェードやいろいろなアニメーションを試してみましょう。

```speech-text.component.ts
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

画面で確認してみましょう。

![ezgif-2-9bf14ca8ac.gif](https://qiita-image-store.s3.amazonaws.com/0/21849/07f6e0f2-58aa-3faf-f801-eaf37f22a356.gif "ezgif-2-9bf14ca8ac.gif")



移動は左右キーで行います。
3枚目のスライド表示中にで「徐々に」というキーワードを発声します。

すると徐々に奇妙な世界が開けました。
画像やキーワードを変えてオリジナルのスライドを作ってみましょう。

## 6 終わりに

LTや勉強会で発表することはあるとおもいます。様々なクールなスライドが世の中に出てきていますが,音声に反応するを作り他の登壇者に差をつけましょう！

またエフェクトを付けるだけでなくリアルタイムで字幕をつけたり,
Language Translatorを利用して和英/英和の翻訳を施した字幕をつけたりとよりプレゼンとしての機能を拡張することが出来ます。ぜひお試しください。
