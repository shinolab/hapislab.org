---
title: トス動作の機械学習に基づくバレーボールの球軌跡予測
summary: バレーボールのセッターの身体動作を基に，ニューラルネットワークを用いて，セッターが上げたトスの，0.3秒先のボールの2次元的な位置を予測するシステムを開発しました．
date: '2019-03-01'
updated: '2023-03-31'
image: /assets/research-topics/volleyball-trajectory-prediction/hero.png
imageAlt: トス動作の機械学習に基づくバレーボールの球軌跡予測
---

バレーボールのセッターの身体動作を基に，ニューラルネットワークを用いて，セッターが上げたトスの，0.3秒先のボールの2次元的な位置を予測するシステムを開発しました．Kinectを用いてセッターの動作時の三次元骨格座標を測定し，この情報を時系列順に並べたデータセットを入力として用いています．結果として，0.3秒先のボールの画像平面内での座標が出力されます．

これを応用し，ニューラルネットワークに入力する骨格部位を，腕部分のみや下半身のみに限定することで，トス動作の特徴が顕著に表れている身体部位を特定できることを示しました．

さらに，三次元情報ではなく，セッターの側面から見た二次元骨格座標を入力として用いても，適切にトス軌跡予測が行えることも示しました．これには画像から人の骨格座標を推定できるOpenPoseというライブラリを使い二次元情報を取得しています．これにより，一般的な試合映像からでも推定できる可能性を示しました．

今後は，より実用性の高いシステムへと改善し，オリンピック等の世界大会での実応用を目指しています．

<iframe width="500" height="281" src="https://www.youtube.com/embed/tqnvM2L86-I" title="Prediction of Volleyball Trajectory Using Skeletal Motions of Setter Player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

国際学会で発表：[Shuya Suda, Yasutoshi Makino, Hiroyuki Shinoda, “Prediction of Volleyball Trajectory Using Skeletal Motions of Setter Player,” In AH 2019 Proceedings of the 10th Augmented Human International Conference 2019.](https://dl.acm.org/citation.cfm?id=3311844)