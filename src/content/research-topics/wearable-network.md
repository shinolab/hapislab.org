---
title: 衣服の上に構成するウェアラブル・ネットワーク
summary: 布状媒体の上にデバイスを着脱できる形で構成し、多数の小型デバイスを身体表面へ分散配置するウェアラブル基盤です。
date: '2017-06-01'
updated: '2019-03-07'
image: /assets/research-topics/wearable-network/hero.png
imageAlt: 衣服の上に構成するウェアラブル・ネットワーク
sourceUrl: 'https://hapislab.org/research-topics-ja/wearable-network_by_2dc'
---
ウェアラブルシステムの実装方式として，シンプルな布状媒体に対しデバイスを手軽に付け外しできる形態を研究しています．

市販の腕時計型のウェアラブルデバイス等では内部に電池を内蔵しています．しかし，非常に小さいデバイスを数多く身体表面に分布させたシステムを構成するには，新しい電力供給と通信の方法が必要です．例えば全身にアクチュエータを分散配置したウェアラブル触覚提示スーツをTシャツや肌着のように薄く軽く実現することは，各アクチュエータへの個別の配線を多数引き回す方法では困難です．  
このための一つの方法として私たちが提案しているのは，衣服を給電と通信の媒体として利用し，デバイスは衣服にピンバッジのように取り付けるという方法です．この衣服には特別な刺繍を施した布地を使用します．  
[](https://hapislab.org/wp-content/uploads/sites/7/2016/12/wearable2dc.png)1枚の基布の両面に導電性の糸（導電糸）を刺繍したものを通信・給電の媒体として用います．導電糸は別の絶縁性の糸によって基布表面に固定されており，表裏の導電糸が導通することはありません．これにより，1枚の布の両面に独立した2本の電流パスが形成されます．ピンバッジ状に形成されたデバイス（LED，アクチュエータ，センサ等）をこの布状媒体に突き刺すことで給電を可能にします．布地に突刺すことで布地の表と裏それぞれでピンバッジ状コネクタと接触導通させ，ここに接続された電気回路に給電します．  
[](https://hapislab.org/wp-content/uploads/sites/7/2016/12/clothandpin.png)  
電流のパスは2本（一方をグラウンドとして実質1本の信号線）しかありませんが，周波数分割多重（FDM）という技術を応用することで，直流で電力を供給しながら各デバイスへの給電を個別にオン・オフする制御用信号も同時に伝送できます．現在，3チャンネル程度の少数の個別制御を可能としたデモシステムを実現しています．パルス幅変調（PWM）という手法により，LEDの明るさ・振動アクチュエータの振動の強さをある程度段階的に調整することも可能です．現在のところ，導電糸そのものは伸縮性がありませんが，刺繍パターンの工夫により布地の伸縮性をそのまま活かすことも可能です．使用している導電糸は洗濯にも耐え，肌のかぶれなどを起こしにくい材料です．導電性インクのプリント等と比較して高い導電性を持ち，電圧を5Vとして2～3Wの電力を80%程度の効率で伝送できます．今後，チャンネル数の増加，オン・オフ制御より高度なデータ伝送，伸縮性の高い布地への適用，触覚提示スーツへの応用などの展開を予定しています．

謝辞  
本研究の一部はJST ACCEL 身体性メディアプロジェクトおよび総務省SCOPE（受付番号155103003）の委託によって行われました．  
また，導電刺繍を施した布状媒体は帝人株式会社から提供いただいています．

関連発表  
1\. Akihito Noda and Hiroyuki Shinoda: “Frequency-Division-Multiplexed Signal and Power Transfer for Wearable Devices Networked via Conductive Embroideries on a Cloth”, 2017 IEEE MTT-S International Microwave Symposium, accepted for presentation, Honolulu, HI, USA, to be published in June 2017.  
2\. 野田 聡人, 田島 優輝 and 篠田 裕之: “ウェアラブル触覚ディスプレイのための柔軟二次元通信シート上の分布アクチュエータへの無配線多重給電”, 第17回計測自動制御学会システムインテグレーション部門講演会論文集, pp. 1349-1353, 札幌, December 2016. （優秀講演賞受賞）  
3\. Yuki Tajima, Akihito Noda and Hiroyuki Shinoda: “Signal and Power Transfer to Actuators Distributed on Conductive Fabric Sheet for Wearable Tactile Display”, Proceedings of AsiaHaptics 2016, pp. 1-6, Kashiwanoha, Japan, November 2016.
