<div align="center">
  <h1>gradio4-react-compose-lab</h1>
  <p>Docker Compose 上で 4 つの Gradio + React フロントを動かす最小モノレポ</p>

  <p>
    <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
    <img src="https://img.shields.io/badge/Gradio-4-FF7F50" />
    <img src="https://img.shields.io/badge/Nginx-Proxy-009639?logo=nginx&logoColor=white" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  </p>

  <p>
    <a href="./README.md">English</a> ·
    <a href="./examples/README.md">Examples</a>
  </p>

  <!-- 任意: スクリーンショットを用意できる場合は以下のコメントアウトを外してください
  <img src="frontend/public/screenshot.png" alt="Dashboard Screenshot" width="800" />
  -->
</div>

---

## 🚀 概要

Docker Compose 上で、4 つの Gradio サービス（Text / Vision / Audio / Tools）と React フロントエンドをまとめて動かす最小構成のモノレポです。フロントは Nginx 経由で各 Gradio にリバースプロキシします。

- リポジトリ: https://github.com/Sunwood-ai-labs/gradio4-react-compose-lab
- 英語 README は `README.md` を参照

## 🧩 サービスとポート

| サービス | 役割 | ローカル URL | コンテナ内ポート |
|---|---|---|---|
| Text | テキスト反転 | `http://localhost:8080/apps/text/` | 7860 |
| Vision | 画像反転 | `http://localhost:8080/apps/vision/` | 7860 |
| Audio | 音声エコー | `http://localhost:8080/apps/audio/` | 7860 |
| Tools | ユーティリティ | `http://localhost:8080/apps/tools/` | 7860 |
| Frontend | React + Nginx | `http://localhost:8080` | 8080 |

Docker Compose マッピング（抜粋）：

```yaml
# docker-compose.yml
services:
  text:    { ports: ["7861:7860"] }
  vision:  { ports: ["7862:7860"] }
  audio:   { ports: ["7863:7860"] }
  tools:   { ports: ["7864:7860"] }
  frontend:{ ports: ["8080:8080"] }
```

Nginx リバースプロキシ（`frontend/nginx.conf`）：

- `/apps/text/   → http://text:7860/`
- `/apps/vision/ → http://vision:7860/`
- `/apps/audio/  → http://audio:7860/`
- `/apps/tools/  → http://tools:7860/`
- 静的配信: `/` は React の `index.html` にフォールバック
- アップロード上限: `client_max_body_size 100m`

## 🧭 クイックスタート

前提: Docker / Docker Compose が利用可能

```bash
# ルートで実行
docker compose up -d --build

# アクセス
open http://localhost:8080   # Windows の場合はブラウザで手動で開く
```

トップページから 4 つのデモを操作できます。各カードは `@gradio/client` を使った React 実装（`frontend/src/components/*.tsx`）です。HTML のみの試用として `frontend/demo.html` も用意しています（ローカルで直接開くか、任意の静的サーバで配信）。

## 📡 呼び出し例（API）

- ブラウザ（React）から: `@gradio/client` を利用
  - ベース URL は `window.location.origin + /apps/<service>/`
  - 例（Text）：

```ts
import { client } from "@gradio/client";

const app = await client(`${window.location.origin}/apps/text/`);
const res = await app.predict("/predict", ["こんにちは"]);
const outText = res.data[0] as string;             // 反転文字列
const filePath = (res.data[1] as any).path;        // 一時ファイルの相対パス
const downloadUrl = `/apps/text/file=${filePath}`; // Nginx 経由でダウンロード
```

- 直接 HTTP POST（Gradio 標準 API）：

```bash
# Text (JSON)
curl -sS -X POST \
  -H 'Content-Type: application/json' \
  -d '{"data":["Hello"]}' \
  http://localhost:8080/apps/text/api/predict

# Vision (multipart、画像アップロードの例)
curl -sS -X POST -F "data=@/path/to/image.png" \
  http://localhost:8080/apps/vision/api/predict
```

- 返却されるファイルの配信: `/apps/<service>/file=<相対パス>`
  - 例: `/apps/tools/file=/tmp/tools_out_xxx.json`

## 🧱 ディレクトリ構成（抜粋）

```plaintext
├── frontend/
│   ├── public/           # HTML-only デモ向けの静的アセット
│   │   ├── hooks.js
│   │   └── styles.css
│   ├── src/
│   │   ├── components/   # 各サービスの React UI
│   │   ├── hooks/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── demo.html         # JS 最小で試せるサンプルページ
│   ├── nginx.conf        # /apps/* → Gradio のプロキシ設定
│   └── Dockerfile        # ビルド後、Nginx で配信
└── services/
    ├── text/
    ├── vision/
    ├── audio/
    └── tools/
```

## 🧪 各デモの挙動

- Text: 入力文字列を反転し、表示テキストとダウンロード用 `.txt` を返します。
- Vision: 画像を左右反転し、プレビュー用とダウンロード用に同一ファイルパスを返します。
- Audio: アップロード音声をパススルーし、再生・ダウンロードに同一ファイルパスを返します。
- Tools: ファイルがあればそれを返却、無ければ `action`/`text` を含む JSON を一時ファイルへ保存して返します。

## 🔧 開発（ローカル）

基本は Docker Compose で一括起動するのが簡単です。フロントのみをホットリロードで開発したい場合：

```bash
cd frontend
npm install
npm run dev
```

- 上記は Vite 開発サーバ（既定: `5173`）を起動します。バックエンドにアクセスする場合は Docker で `services/*` を別途起動し、アクセス先を `http://localhost:8080/apps/*` に向けるのが簡単です（必要に応じて Vite の dev サーバにプロキシ設定を追加してください）。

## 🆘 トラブルシュート

- 大きなファイルをアップロードできない: `frontend/nginx.conf` の `client_max_body_size` を調整（既定 100MB）。
- ポート競合: `docker-compose.yml` の公開ポート（7861–7864, 8080）を変更。
- Frontend コンテナのポートについて: Nginx はコンテナ内で `listen 8080;` です。`frontend/Dockerfile` の `EXPOSE 80` は情報提供用であり、Compose の `8080:8080` マッピングが優先されます。
- 依存関係の更新: 各サービスの `requirements.txt`、フロントの `package.json` を変更後、`docker compose build --no-cache` を推奨。

## 🔗 関連リンク / 参考

- Examples（使用例集）: `examples/README.md`
- 英語 README: `README.md`

## 📜 ライセンス / 貢献

- ライセンス表記がなければ、プロジェクト方針に従ってください。
- Issue / PR 歓迎です。主要コントリビューター: `maki`, `Maki`。

---

この README は `README.md` の日本語版です。詳細や最新情報はコミットログと各ディレクトリ内のソースをご確認ください。
