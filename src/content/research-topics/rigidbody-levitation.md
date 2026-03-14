---
title: 超音波による空中剛体浮揚
titleEn: Rigid-body Levitation by Ultrasound
summary: 空中超音波フェーズドアレイにより、波長の3倍以上大きい剛体の位置と回転を安定化しながら浮揚させる研究です。
summaryEn: >-
  A method for stably levitating rigid bodies larger than the acoustic
  wavelength using airborne ultrasound phased arrays.
date: '2020-10-14'
updated: '2020-10-15'
image: /assets/research-topics/rigidbody-levitation/hero.jpg
imageAlt: 超音波による空中剛体浮揚
---
[https://www.youtube.com/embed/zrlQEZ3K4a0?feature=oembed](https://www.youtube.com/embed/zrlQEZ3K4a0?feature=oembed)

超音波フェーズドアレイを用いて、剛体の位置と回転の6自由度に対して自立安定するような力場を設計することにより、波長の３倍以上大きい剛体の浮揚を初めて実証しました。特に非球物体の浮揚は他に類を見ないものです。

[](https://hapislab.org/wp-content/uploads/sites/7/2020/10/fig2.jpg)

波長より大きい物体を浮揚させるためには、物体の存在が音場に与える影響を無視することはできません。右図中段に示されるように、物体の有無により音場は大きく変化していることがわかります。本研究では、右図下段のように物体表面の音場を陽に設計する手法「境界ホログラム」を提案しました。

安定的な浮揚には、（１）重力などの外力と釣り合う力、（２）外トルクと釣り合うトルク、（３）微小変位に対する復元力、（４）微小回転に対する復元トルクの4つ、計12次元の制御が必要です。センサ等を用いずに静的な超音波場でこれを実現するために、力場Fとそのヤコビアン固有値λを用いて以下の最適化問題を解きます。最適化するパラメータは、フェーズドアレイの振動子出力ベクトルです。

[](https://hapislab.org/wp-content/uploads/sites/7/2020/10/7297ab511f3f3c84362ab858a3b2954d.png)

この最適化問題は、1992次元の非凸二次計画問題であり必ずしも大域的最適解を得ることはできませんが、l-BFGS法で効率良く解くことができます。

下記は、直径30mm球の浮揚中の軌跡をプロットしたものです。鉛直方向には5mm以内、水平方向には3mm以内で安定して浮揚できていることが示されています。  
[](https://hapislab.org/wp-content/uploads/sites/7/2020/10/fig11_smooth.png)

[Seki Inoue, Shinichi Mogami, Tomohiro Ichiyama, Akihito Noda, Yasutoshi Makino, and Hiroyuki Shinoda, “Acoustical boundary hologram for macroscopic rigid-body levitation,” Journal of the Acoustical Society of America 1. 145, pp.328–337, 2019.](https://doi.org/10.1121/1.5087130)

[Inoue, S., Mogami, S., Ichiyama, T., Noda, A., Makino, Y., & Shinoda, H. (2017). Acoustic macroscopic rigid body levitation by responsive boundary hologram. _arXiv preprint arXiv:1708.05988_.](https://arxiv.org/abs/1708.05988)

> This highly cited article from 2019 proposes a technique to generate a static and stable levitation field for macroscopic non-spherical rigid bodies : [https://t.co/vbGed2af30](https://t.co/vbGed2af30)[@UTokyo\_News\_en](https://twitter.com/UTokyo_News_en?ref_src=twsrc%5Etfw)[#acoustics](https://twitter.com/hashtag/acoustics?src=hash&ref_src=twsrc%5Etfw) [#acousticlevitation](https://twitter.com/hashtag/acousticlevitation?src=hash&ref_src=twsrc%5Etfw) [#ultrasound](https://twitter.com/hashtag/ultrasound?src=hash&ref_src=twsrc%5Etfw) [pic.twitter.com/3dprVShrcV](https://t.co/3dprVShrcV)
> 
> — JASA (@ASA\_JASA) [August 7, 2020](https://twitter.com/ASA_JASA/status/1291706208831901696?ref_src=twsrc%5Etfw)
