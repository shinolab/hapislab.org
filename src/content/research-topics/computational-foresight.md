---
title: 機械学習を用いた0.5秒後の運動のリアルタイム推定
summary: ニューラルネットワークを用いて、リアルタイムに0.5秒後の人間の動きを推定し提示するシステムを開発しました。
date: '2017-11-01'
updated: '2023-03-31'
thumbnail: /assets/research-topics/computational-foresight/thumbnail.png
thumbnailAlt: 機械学習を用いた0.5秒後の運動のリアルタイム推定
---

<iframe width="500" height="281" src="https://www.youtube.com/embed/TXbhXgTMtNU" title="Computational Foresight: Realtime Forecast of Human Body Motion" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

ニューラルネットワークを用いて、リアルタイムに0.5秒後の人間の動きを推定し提示するシステムを開発しました。

Kinectを用いて人間の動きの測定し、その動きを時系列順に並べた物を入力として用いています。また、結果として0.5秒後の動きを出力しています。

現在では、ジャンプ、歩行時の運動の推定を行っており、体幹部では3cmほどでの誤差でのリアルタイム推定が可能になっています。

国際会議で発表: [Yuuki Horiuchi, Yasutoshi Makino, and Hiroyuki Shinoda. 2017. Computational Foresight: Forecasting Human Body Motion in Real-time for Reducing Delays in Interactive System. In _Proceedings of the 2017 ACM International Conference on Interactive Surfaces and Spaces_ (ISS ’17).](https://dl.acm.org/citation.cfm?id=3135076&CFID=821848232&CFTOKEN=62276908)

上記論文に対するweb記事: [東京大学、機械学習を用いて0.5秒後の人間の動きをリアルタイムに推定する体動予測システム「Computational Foresight」を論文にて発表](http://shiropen.com/2017/11/17/29625)

Siggraph Asiaで発表予定: [紹介ページ](https://sa2017.siggraph.org/attendees/emerging-technologies?view=event&eid=124)
