---
title: 熱画像による空中超音波の２次元計測
titleEn: Two-dimensional Measurement of Airborne Ultrasound Using Thermography
summary: 空中超音波を用いた触覚提示や音響マニピュレーションで課題となる音場分布を、熱画像から簡便に計測する二次元計測手法です。
summaryEn: >-
  A thermography-based technique for quickly visualizing airborne ultrasound
  fields used in haptics and acoustic manipulation.
date: '2022-10-20'
updated: '2025-08-15'
image: /assets/research-topics/2d-ultrasound-measurement/hero.png
imageAlt: 熱画像による空中超音波の２次元計測
---
[https://www.youtube.com/embed/vski7YC5alM?feature=oembed](https://www.youtube.com/embed/vski7YC5alM?feature=oembed)

空中超音波を用いた触覚提示や音響マニピュレーションなどの技術では、音場の分布を簡単に計測できないことが問題でした。実用的にはマイクを自動ステージやロボットアームで動かして分布計測するしかありませんでした。

この研究ではサーモカメラを用いることで、3次元空間中の任意の2次元面における音圧分布を計測します。瞬時かつ高い空間分解能での計測を実現できました。

-   超音波を透過するメッシュスクリーン表面の熱画像を用い、リアルタイムに二次元超音波場を可視化できます。スクリーンを動かして３次元分布を把握することも容易です。

[](https://hapislab.org/wp-content/uploads/sites/7/2022/10/3-1.png)

**図1. メッシュスクリーン、4台の超音波フェーズドアレイ、サーモグラフィーカメラ、そしてモニターに表示された1フレームの熱画像が示されています。 (a) 焦点とそのサイドローブや、(b) 定在波の音圧の腹と節といった音場の特徴が明瞭に可視化されています。**

-   さらにメッシュスクリーンを用いずに、手や指の表面の音圧分布を計測することもできます。

**図2. (a) 手のひら表面の温度分布から、音場に対応する同心円状のパターンが観察されました。（b）指先の温度分布を示す画像シーケンスから、焦点が0.4秒ごとに2 mmステップで移動する様子が確認されました。**

-   指表面の超音波焦点を、たった 0.2 sで、誤差 1 mm 以内に計測できます。

**図3. 指腹に超音波焦点を生成したときの温度変化の分布をあらわしています。青枠は、もっとも温度変化が大きい点を示しています。**  
**0.13 sの時点で、焦点位置が推定できていることがわかります。**

主な論文**:**

1.  Ryoya Onishi\*, Sota Iwabuchi\*, Shun Suzuki, Takaaki Kamigaki, Yasutoshi Makino, and Hiroyuki Shinoda, “Measurement of Airborne Ultrasound Focus on Skin Surface Using Thermal Imaging” _I**EEE Transactions on Haptics**_, 2025, \*Equal contribution. [(Open Access)](https://ieeexplore.ieee.org/abstract/document/10906472) [10.1109/TOH.2025.3546270](https://doi.org/10.1109/TOH.2025.3546270)
2.  Sota Iwabuchi\*, Ryoya Onishi\*, Shun Suzuki, Takaaki Kamigaki, Yasutoshi Makino and Hiroyuki Shinoda, “[Performance Evaluation of Airborne Ultrasound Focus Measurement Using Thermal Imaging on the Surface of a Finger](https://ieeexplore.ieee.org/abstract/document/10224365)”, **_IEEE World Haptics 2023_**, Technical paper, July 10-13, 2023, Delft, the Netherlands.
3.  Ryoya Onishi, Takaaki Kamigaki, Shun Suzuki, Tao Morisaki, Masahiro Fujiwara, Yasutoshi Makino, and Hiroyuki Shinoda, “Two-Dimensional Measurement of Airborne Ultrasound Field Using Thermal Images” **_Phys. Rev. Applied_** 18, no. 4 (2022) 044047 ([Open Access](https://journals.aps.org/prapplied/abstract/10.1103/PhysRevApplied.18.044047))
4.  Onishi, R., Kamigaki, T., Suzuki, S., Morisaki, T., Fujiwara, M., Makino, Y., & Shinoda, H. (2022). **“[Visualization of airborne ultrasound field using thermal images”.](https://arxiv.org/abs/2203.07862)** _arXiv preprint arXiv:2203.07862_.
5.  小丹枝 涼哉, 神垣 貴晶, 鈴木 颯, 森崎 汰雄, 藤原 正浩, 牧野 泰才, 篠田 裕之,  “[熱画像を用いた強力空中超音波の音場分布計測](https://jglobal.jst.go.jp/detail?JGLOBAL_ID=202202279107131732),”  第38回センシングフォーラム計測部門大会, pp. 141-145, Online , Sep. 30・Oct 1, 2021 **\*SICE センシングフォーラム研究奨励賞 受賞**
