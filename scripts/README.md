# scripts

`scripts/` はコンテンツ更新を補助するための小さなユーティリティ置き場です.

## `doi2pub.py`

1 件の DOI メタデータを取得し, `src/data/publications/<type>.yml` を直接更新します.

### 使い方

```sh
cd scripts
uv run python doi2pub.py <DOI>
```

既定では `doi2bib3` を使います. Crossref を使いたいときは `--crossref` を付けてください.

```sh
uv run python doi2pub.py <DOI> --crossref
```

新規エントリの種類 (= 追加先のファイル) はメタデータから推定します. 推定が合わない場合は `--type` で指定してください.

```sh
uv run python doi2pub.py <DOI> --type demos
```

### 挙動

- `src/data/publications/` 以下のいずれかのファイルに同じ DOI があれば, 不足しているフィールドを埋めます
- 同じ DOI がなければ, 種類に対応するファイル (`article.yml`, `inproceedings.yml`, `demos.yml`, `domestic.yml`) の先頭に新しいエントリを追加します
    - 種類を推定できず `--type` も指定されていない場合はエラーになります
- `refId` は新規追加時に既存の全ファイルの `refId` と重複しないよう自動生成します
- 既存値と取得値が衝突するフィールドがある場合, そのエントリはスキップして標準エラー出力に警告を出します

### 反映手順

1. コマンドを実行する
2. `git diff src/data/publications/` などで変更内容を確認する
3. `volume`, `number`, `pages`, `eventDate`, `location`, `note` など不足があれば手で補う

### 注意

- `doi2bib3` と Crossref では取れるフィールドが少し異なることがあります
- DOI は `10.xxxx/...` でも `https://doi.org/10.xxxx/...` でも受け付けます

## `fix_data.py`

`check_data.py` で検出される違反のうち, 機械的に直せるものを自動修正します.

- `pages` の単純な数値範囲 (`10-20`, `10 - 20`, `10 – 20`, `10〜20` など) → `10--20`
- 著者名・受賞者名中の全角スペース → 半角スペース
- エントリ内のキーの間にある空行 → 削除

```sh
cd scripts
uv run python fix_data.py
```

PR で `src/data/` が変更されると, `.github/workflows/autofix.yml` が同じ修正を行い PR ブランチにコミットします.
