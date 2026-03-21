# scripts

`scripts/` はコンテンツ更新を補助するための小さなユーティリティ置き場です.

## `doi2pub.py`

1 件の DOI メタデータを取得し, `src/data/publications.yml` を直接更新します.

### 使い方

```sh
cd scripts
uv run python doi2pub.py <DOI>
```

既定では `doi2bib3` を使います. Crossref を使いたいときは `--crossref` を付けてください.

```sh
uv run python doi2pub.py <DOI> --crossref
```

### 挙動

- 既存エントリに同じ DOI があれば, 不足しているフィールドを埋めます
- 同じ DOI がなければ, 先頭に新しいエントリを追加します
- `refId` は新規追加時に既存の `src/data/publications.yml` を参照しつつ自動生成します
- 既存値と取得値が衝突するフィールドがある場合, そのエントリはスキップして標準エラー出力に警告を出します

### 反映手順

1. コマンドを実行する
2. `git diff src/data/publications.yml` などで変更内容を確認する
3. `volume`, `number`, `pages`, `eventDate`, `location`, `note` など不足があれば手で補う

### 注意

- `doi2bib3` と Crossref では取れるフィールドが少し異なることがあります
- DOI は `10.xxxx/...` でも `https://doi.org/10.xxxx/...` でも受け付けます
