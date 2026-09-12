# LUMIÈRE — 仕上げ手順

今回の変更点は2つです。**あと2つの作業をすれば完成します。**

---

## 1. 予約フォーム（設定済み・作業不要）

送信先は **Google フォーム**です。設定は完了しているので、追加の作業はありません。

- フォーム名：ヘアサロン 予約リクエストフォーム
- 編集画面：https://docs.google.com/forms/d/1Gd0aaHwu5ZQtQoMIx9WY4XlMP1o53q4Nv3jveN2rFkA/edit
- 質問9個（お名前／フリガナ／電話番号／メールアドレス／ご希望日／ご希望時間／ご希望メニュー／ご指名スタイリスト／ご要望・ご質問）

### 回答の見かた
上記の編集画面 →「回答」タブ。
スプレッドシートで見たい場合は、回答タブの表計算アイコンから1クリックで連携できます。

### 仕組み
サイト側のフォームは**見た目そのまま**で、送信だけを Google フォームに転送しています。
各入力欄の `name` が `entry.xxxxxxxxx`（Google側の項目ID）になっているのがその設定です。

### 注意点（重要）
- **Google フォーム側の質問を削除・並べ替えすると、`entry.` の対応が壊れます。** 質問を触るときは `reservation.html` の `name` も合わせて確認してください
- ブラウザの仕様（CORS）上、**送信が成功したかをサイト側で受け取れません。** 通信が完了した時点で完了画面を出しています。ネットワーク自体が失敗した場合のみエラー表示になります
- これは Google が公式に案内している使い方ではありません。将来 Google 側の仕様変更で動かなくなる可能性があります

### 実装済みの内容
- 必須項目（お名前／電話番号／メール）の入力チェック
- 項目ごとのエラー文表示、入力し直すと自動で消える
- 送信中はボタンを無効化＋「送信中…」表示
- 予約日に過去の日付を選べない（当日以降のみ）
- スパム対策のハニーポット項目
- 送信完了後に完了メッセージへ自動スクロール

## 2. 画像を本物に差し替える

`images/` に**仮画像**が入っています。**同じファイル名で上書きするだけ**で反映されます。
HTML・CSSを触る必要はありません。

### 使う11枚（ライセンス確認済み）

すべて Unsplash License（商用可・改変可・クレジット表記不要）であることを、
個別ページで1枚ずつ確認しています。有料の Unsplash+ は含まれていません。

| 保存名 | サイズ | URL | 撮影者 |
|---|---|---|---|
| `hero.jpg` | 1920×1080 | https://unsplash.com/photos/salon-chairs-with-mirrors-and-products-jsuWg7IXx1k | Greg Trowman |
| `concept-01.jpg` | 1000×1000 | https://unsplash.com/photos/hairstylist-blow-drying-client-hair-FkAZqQJTbXM | Adam Winger |
| `concept-02.jpg` | 900×900 | https://unsplash.com/photos/stainless-steel-scissors-and-hair-comb-WbEibGKHBMY | Sinval Carvalho |
| `gallery-01.jpg` | 1400×1400 | https://unsplash.com/photos/close-up-of-a-womans-back-and-dark-hair-2cHO589iZxs | Wilhelm Gunkel |
| `gallery-02.jpg` | 1000×1000 | https://unsplash.com/photos/blonde-woman-with-bob-haircut-in-black-and-white-Nx5eWVnVTXk | ola szkolda |
| `gallery-03.jpg` | 1000×1000 | https://unsplash.com/photos/kjeblOliM08 | Luis Quintero |
| `gallery-04.jpg` | 1000×1000 | https://unsplash.com/photos/a-close-up-of-a-person-with-wavy-hair-z50YODyJU4c | Crystal Clark |
| `gallery-05.jpg` | 1400×900 | https://unsplash.com/photos/young-woman-with-dark-hair-and-freckles-wearing-turtleneck-tn6c20YUF_I | Beyza Yurtkuran |
| `gallery-06.jpg` | 1000×1000 | https://unsplash.com/photos/OxEoBJ3Q4fw | rosalye simard |
| `gallery-07.jpg` | 1000×1000 | https://unsplash.com/photos/a-man-getting-his-hair-washed-in-a-sink-WHLG1uhxLUA | Redd Francisco |
| `gallery-08.jpg` | 1000×1000 | https://unsplash.com/photos/person-with-grey-and-black-hair-KBoUUqE97r8 | Lera Kogan |

### 手順
1. 各ページの **Download free** → サイズは **Large** で十分
2. 指定の縦横比にトリミング
3. **全枚数に同じ調整**：露出 −10〜20%／彩度 −10〜20%（ここが完成度に最も効きます）
4. 1枚 **300KB以下**に圧縮 — https://squoosh.app/
5. `images/` に同じファイル名で上書き

> 画像が無い／読み込めない場合は、自動で元のグラデーション背景に戻ります。壊れた画像アイコンは出ません。

### スタイリスト写真は入れません（変更点）

無料素材のポートレートは全て外国人モデルで、日本人名と一致せず違和感が出ます。
代わりに**モノグラム（A・T・Y・R）の意匠をそのまま使う**方針に変更しました。
仮画像4枚は削除済みで、追加の作業は不要です。

あわせて、この意匠の不具合を2点修正しています。
- 1枚目のカードだけ背景グラデーションが当たっていなかった（セレクタの記述ミス）
- モノグラムが背景の下に隠れて見えなくなっていた（重なり順）

将来 `images/stylist-01.jpg` 〜 `-04.jpg` を置けば、この意匠は自動で非表示になり写真に切り替わります。

## 3. ポートフォリオとして見せるときの注意

このサイトには「顧客満足度98%」「AI診断実績2,400+」という**架空の数値**が入っています。

実在サロンの実績と誤認されないよう、ポートフォリオに掲載する際は
**「架空サロンのデモサイト」と明記**してください。実案件では必ず実データに差し替えます。
